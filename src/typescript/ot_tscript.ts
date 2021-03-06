type FileTypes = "video" | "audio" | "image" | "other";

type FileWithMetadata = {
  file: string; // Replaced file with string to make it easier
  customType: FileTypes;
  // ... Extra stuff
};

type InputFilesType = {
  video?: FileWithMetadata[];
  audio?: FileWithMetadata[];
  image?: FileWithMetadata[];
  other?: FileWithMetadata[];
};

type FileTransformType = {
  state: "Move" | "Insert" | "Delete";
  position?: number; // Position A
  fileObj?: FileWithMetadata;
  type: FileTypes;
  secondPosition?: number; // Position B
};

type FileCount = {
  videos?: number;
  images?: number;
  audioFiles?: number;
  others?: number;
};

/* Beginning of assessment code */

const TRANSFORM_SUCCESS: String = "Transforms executed correctly";
const TRANSFORM_FAILURE: String = "Transforms executed incorrectly";
const ABSURDLY_LARGE_NUMBER = Number.MAX_VALUE;

// custom error types
class FileTypeNotFoundError extends Error {
  constructor(fileType: String) {
    super(`Illegal transform on type: ${fileType}`);
    this.name = "FileTypeNotFoundError";
  }
}

class FileNotFoundError extends Error {
  constructor() {
    super(`File of type not found, cannot apply transform`);
    this.name = "FileNotFoundError";
  }
}

function isValid(
  stale: InputFilesType,
  latest: InputFilesType,
  transforms: FileTransformType[]
) {
  try {
    transforms!.forEach((transform, index) => {
      // type of file to apply transform on
      let fileType = transform.type;

      switch (transform.state) {
        case "Move": {
          //file type does not exist on stale object, move transform not possible

          if (!stale.hasOwnProperty(fileType)) {
            throw new FileTypeNotFoundError(fileType);
          }

          let fPos =
            transform.position != null
              ? transform.position
              : ABSURDLY_LARGE_NUMBER;
          let lPos =
            transform.secondPosition != null
              ? transform.secondPosition
              : ABSURDLY_LARGE_NUMBER;

          // cannot move a file to a postion more than the number of files
          console.assert(fPos < stale[fileType]!.length);
          console.assert(lPos < stale[fileType]!.length);

          // move the file
          [stale[fileType]![fPos], stale[fileType]![lPos]] = [
            stale[fileType]![lPos],
            stale[fileType]![fPos],
          ];
          break;
        }
        case "Insert": {
          let file =
            transform.fileObj?.file != null ? transform.fileObj?.file : null;
          let customFileType =
            transform.fileObj?.customType != null
              ? transform.fileObj?.customType
              : null;
          if (file && customFileType) {
            if (!stale.hasOwnProperty(fileType)) {
              stale[fileType] = [
                {
                  file: file,
                  customType: customFileType,
                },
              ];
            } else {
              stale[fileType]!.push({
                file: file,
                customType: customFileType,
              });
            }
          }
          break;
        }
        case "Delete": {
          let delPos =
            transform.position != null
              ? transform.position
              : ABSURDLY_LARGE_NUMBER;

          // cannot delete a file from a postion more than the number of files
          console.assert(delPos < stale[fileType]!.length);

          stale[fileType]!.splice(delPos, 1);
          break;
        }
      }
    });
  } catch (err) {
    console.error(err);
  }

  JSON.stringify(stale) === JSON.stringify(latest)
    ? console.log(TRANSFORM_SUCCESS)
    : console.log(TRANSFORM_FAILURE);
}

/* End of assessment code */

isValid(
  {
    video: [
      { file: "1.mp4", customType: "video" },
      { file: "2.mp4", customType: "video" },
      { file: "3.mp4", customType: "video" },
    ],
  },
  {
    video: [
      { file: "2.mp4", customType: "video" },
      { file: "1.mp4", customType: "video" },
    ],
    image: [{ file: "1.png", customType: "image" }],
  },
  [
    { state: "Move", position: 0, secondPosition: 2, type: "video" },
    {
      state: "Insert",
      fileObj: { file: "1.png", customType: "image" },
      type: "image",
    },
    {
      state: "Delete",
      position: 0,
      type: "video",
    },
  ]
); // true

isValid(
  {},
  {
    video: [
      { file: "1.mov", customType: "video" },
      { file: "2.mov", customType: "video" },
    ],
    image: [
      { file: "1.png", customType: "image" },
      { file: "2.png", customType: "image" },
      { file: "3.png", customType: "image" },
    ],
  },
  [
    {
      state: "Insert",
      fileObj: { file: "1.png", customType: "image" },
      type: "image",
    },
    {
      state: "Insert",
      fileObj: { file: "1.mp3", customType: "audio" },
      type: "audio",
    },
    {
      state: "Insert",
      fileObj: { file: "1.mov", customType: "video" },
      type: "video",
    },
    {
      state: "Delete",
      position: 0,
      type: "video",
    },
    {
      state: "Insert",
      fileObj: { file: "2.png", customType: "image" },
      type: "image",
    },
    {
      state: "Insert",
      fileObj: { file: "3.png", customType: "image" },
      type: "image",
    },
    {
      state: "Insert",
      fileObj: { file: "2.mov", customType: "video" },
      type: "video",
    },
    {
      state: "Move",
      position: 2,
      secondPosition: 1,
      type: "video",
    },
  ]
); // false
/***
 * Three reasons why
 * Audio not there
 * Video not deleted
 * Images not moved
 */

isValid(
  {
    video: [
      { file: "1.mp4", customType: "video" },
      { file: "2.mp4", customType: "video" },
      { file: "3.mp4", customType: "video" },
    ],
    image: [{ file: "1.png", customType: "image" }],
  },
  {
    video: [
      { file: "3.mp4", customType: "video" },
      { file: "1.mp4", customType: "video" },
    ],
    image: [
      { file: "1.png", customType: "image" },
      { file: "2.png", customType: "image" },
    ],
  },
  [
    { state: "Move", position: 0, secondPosition: 2, type: "video" },
    {
      state: "Insert",
      fileObj: { file: "2.png", customType: "image" },
      type: "image",
    },
    {
      state: "Delete",
      position: 1,
      type: "video",
    },
    {
      state: "Insert",
      fileObj: { file: "3.png", customType: "image" },
      type: "image",
    },
    {
      state: "Delete",
      position: 1,
      type: "image",
    },
  ]
); // false, wrong image deletion
