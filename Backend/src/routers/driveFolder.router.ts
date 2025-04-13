import { Router } from "express";
import {
  createFolderInDriveController,
  deleteFolderInDriveController,
  createFolderInFolderController,
  deleteFolderInFolderController,
  getAllFolderAndFileOfFolderController,
} from "../controllers/driveFolder.controller";
import verifyAuth from "../middlewares/verifyAuth.middleware";
const router = Router();

router.get("/test", (req, res) => {
  res.send("(Drive Folder)For Testing Only");
});
router.get(
  "/allFileAndFolder/:folderId",
  verifyAuth,
  getAllFolderAndFileOfFolderController
);
router.post("/createFolder", createFolderInDriveController);
router.post("/createFolderInFolder/:folderId", createFolderInFolderController);
router.delete("/deleteFolder/:folderId", deleteFolderInDriveController);
router.delete(
  "/deleteFolderInFolder/:containingFolderId/:targetFolderId",
  deleteFolderInFolderController
);

export default router;
