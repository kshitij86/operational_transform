/* Beginning of assessment code */

const TRANSFORM_SUCCESS = "Transforms executed correctly";
const TRANSFORM_FAILURE = "Transforms executed incorrectly";

// custom error types
class FileTypeNotFoundError extends Error {
  constructor(fileType) {
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

function isValid(stale, latest, transforms) {
  try {
    transforms.forEach((transform, index) => {
      // type of file to apply transform on
      let fileType = transform["type"];

      switch (transform.state) {
        case "Move": {
          //file type does not exist on stale object, move transform not possible

          if (!stale.hasOwnProperty(fileType)) {
            throw new FileTypeNotFoundError(fileType);
          }
          // cannot move a file from a postion more than the number of files
          console.assert(transform.position < stale[fileType].length);
          console.assert(transform.secondPosition < stale[fileType].length);

          // move the file
          [
            stale[fileType][transform.position],
            stale[fileType][transform.secondPosition],
          ] = [
            stale[fileType][transform.secondPosition],
            stale[fileType][transform.position],
          ];
          break;
        }
        case "Insert": {
          if (!stale.hasOwnProperty(fileType)) {
            stale[fileType] = [
              {
                file: transform.fileObj.file,
                customType: transform.fileObj.customType,
              },
            ];
          } else {
            stale[fileType].push({
              file: transform.fileObj.file,
              customType: transform.fileObj.customType,
            });
          }
          break;
        }
        case "Delete": {
          // cannot delete a file to a postion more than the number of files
          console.assert(transform.position < stale[fileType].length);
          stale[fileType].splice(transform.position, 1);
          break;
        }
      }
    });
  } catch (err) {
    console.error(err);
  }

  // console.log(stale);
  // console.log(latest);
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
