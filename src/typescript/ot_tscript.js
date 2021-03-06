var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* Beginning of assessment code */
var TRANSFORM_SUCCESS = "Transforms executed correctly";
var TRANSFORM_FAILURE = "Transforms executed incorrectly";
var ABSURDLY_LARGE_NUMBER = Number.MAX_VALUE;
// custom error types
var FileTypeNotFoundError = /** @class */ (function (_super) {
    __extends(FileTypeNotFoundError, _super);
    function FileTypeNotFoundError(fileType) {
        var _this = _super.call(this, "Illegal transform on type: " + fileType) || this;
        _this.name = "FileTypeNotFoundError";
        return _this;
    }
    return FileTypeNotFoundError;
}(Error));
var FileNotFoundError = /** @class */ (function (_super) {
    __extends(FileNotFoundError, _super);
    function FileNotFoundError() {
        var _this = _super.call(this, "File of type not found, cannot apply transform") || this;
        _this.name = "FileNotFoundError";
        return _this;
    }
    return FileNotFoundError;
}(Error));
function isValid(stale, latest, transforms) {
    try {
        transforms.forEach(function (transform, index) {
            var _a;
            var _b, _c, _d, _e;
            // type of file to apply transform on
            var fileType = transform.type;
            switch (transform.state) {
                case "Move": {
                    //file type does not exist on stale object, move transform not possible
                    if (!stale.hasOwnProperty(fileType)) {
                        throw new FileTypeNotFoundError(fileType);
                    }
                    var fPos = transform.position != null
                        ? transform.position
                        : ABSURDLY_LARGE_NUMBER;
                    var lPos = transform.secondPosition != null
                        ? transform.secondPosition
                        : ABSURDLY_LARGE_NUMBER;
                    // cannot move a file to a postion more than the number of files
                    console.assert(fPos < stale[fileType].length);
                    console.assert(lPos < stale[fileType].length);
                    // move the file
                    _a = [
                        stale[fileType][lPos],
                        stale[fileType][fPos],
                    ], stale[fileType][fPos] = _a[0], stale[fileType][lPos] = _a[1];
                    break;
                }
                case "Insert": {
                    var file = ((_b = transform.fileObj) === null || _b === void 0 ? void 0 : _b.file) != null ? (_c = transform.fileObj) === null || _c === void 0 ? void 0 : _c.file : null;
                    var customFileType = ((_d = transform.fileObj) === null || _d === void 0 ? void 0 : _d.customType) != null
                        ? (_e = transform.fileObj) === null || _e === void 0 ? void 0 : _e.customType
                        : null;
                    if (file && customFileType) {
                        if (!stale.hasOwnProperty(fileType)) {
                            stale[fileType] = [
                                {
                                    file: file,
                                    customType: customFileType
                                },
                            ];
                        }
                        else {
                            stale[fileType].push({
                                file: file,
                                customType: customFileType
                            });
                        }
                    }
                    break;
                }
                case "Delete": {
                    var delPos = transform.position != null
                        ? transform.position
                        : ABSURDLY_LARGE_NUMBER;
                    // cannot delete a file from a postion more than the number of files
                    console.assert(delPos < stale[fileType].length);
                    stale[fileType].splice(delPos, 1);
                    break;
                }
            }
        });
    }
    catch (err) {
        console.error(err);
    }
    JSON.stringify(stale) === JSON.stringify(latest)
        ? console.log(TRANSFORM_SUCCESS)
        : console.log(TRANSFORM_FAILURE);
}
/* End of assessment code */
isValid({
    video: [
        { file: "1.mp4", customType: "video" },
        { file: "2.mp4", customType: "video" },
        { file: "3.mp4", customType: "video" },
    ]
}, {
    video: [
        { file: "2.mp4", customType: "video" },
        { file: "1.mp4", customType: "video" },
    ],
    image: [{ file: "1.png", customType: "image" }]
}, [
    { state: "Move", position: 0, secondPosition: 2, type: "video" },
    {
        state: "Insert",
        fileObj: { file: "1.png", customType: "image" },
        type: "image"
    },
    {
        state: "Delete",
        position: 0,
        type: "video"
    },
]); // true
isValid({}, {
    video: [
        { file: "1.mov", customType: "video" },
        { file: "2.mov", customType: "video" },
    ],
    image: [
        { file: "1.png", customType: "image" },
        { file: "2.png", customType: "image" },
        { file: "3.png", customType: "image" },
    ]
}, [
    {
        state: "Insert",
        fileObj: { file: "1.png", customType: "image" },
        type: "image"
    },
    {
        state: "Insert",
        fileObj: { file: "1.mp3", customType: "audio" },
        type: "audio"
    },
    {
        state: "Insert",
        fileObj: { file: "1.mov", customType: "video" },
        type: "video"
    },
    {
        state: "Delete",
        position: 0,
        type: "video"
    },
    {
        state: "Insert",
        fileObj: { file: "2.png", customType: "image" },
        type: "image"
    },
    {
        state: "Insert",
        fileObj: { file: "3.png", customType: "image" },
        type: "image"
    },
    {
        state: "Insert",
        fileObj: { file: "2.mov", customType: "video" },
        type: "video"
    },
    {
        state: "Move",
        position: 2,
        secondPosition: 1,
        type: "video"
    },
]); // false
/***
 * Three reasons why
 * Audio not there
 * Video not deleted
 * Images not moved
 */
isValid({
    video: [
        { file: "1.mp4", customType: "video" },
        { file: "2.mp4", customType: "video" },
        { file: "3.mp4", customType: "video" },
    ],
    image: [{ file: "1.png", customType: "image" }]
}, {
    video: [
        { file: "3.mp4", customType: "video" },
        { file: "1.mp4", customType: "video" },
    ],
    image: [
        { file: "1.png", customType: "image" },
        { file: "2.png", customType: "image" },
    ]
}, [
    { state: "Move", position: 0, secondPosition: 2, type: "video" },
    {
        state: "Insert",
        fileObj: { file: "2.png", customType: "image" },
        type: "image"
    },
    {
        state: "Delete",
        position: 1,
        type: "video"
    },
    {
        state: "Insert",
        fileObj: { file: "3.png", customType: "image" },
        type: "image"
    },
    {
        state: "Delete",
        position: 1,
        type: "image"
    },
]); // false, wrong image deletion
