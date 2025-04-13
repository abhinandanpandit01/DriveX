import multer, { diskStorage } from "multer";
import path from "path";
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/temp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadFile = multer({ storage: storage });
