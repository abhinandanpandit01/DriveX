import { Router } from "express";
import {
  uploadFileInDriveController,
  uploadFileInFolderController,
  deleteFileInDriveController,
  deleteFileInFolderContoller,
} from "../controllers/driveFile.controller";
import { uploadFile } from "../middlewares/multer.middleware";

const router = Router();

router.get("/test", (req, res) => {
  res.send("(Drive File)For Testing Only");
});
router.post(
  "/createFileInDrive",
  uploadFile.single("file"),
  uploadFileInDriveController
);
router.post(
  "/createFileInFolder/:folderId",
  uploadFile.single("file"),
  uploadFileInFolderController
);
router.delete("/deleteFileInDrive/:fileId", deleteFileInDriveController);
router.delete("/deleteFileInFolder/:fileId", deleteFileInFolderContoller);
export default router;
