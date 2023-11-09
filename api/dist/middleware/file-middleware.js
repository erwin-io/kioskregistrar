"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line no-unused-vars
const multer_1 = __importDefault(require("multer"));
const convert_units_1 = __importDefault(require("convert-units"));
class FileMiddleware {
}
FileMiddleware.memoryLoader = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: (0, convert_units_1.default)(2).from('Mb').to('b'),
    },
});
FileMiddleware.diskLoader = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, path_1.default.join(__dirname, './tmp/upload'));
        },
    }),
    limits: {
        fileSize: (0, convert_units_1.default)(64).from('Mb').to('b'),
    },
});
exports.default = FileMiddleware;
