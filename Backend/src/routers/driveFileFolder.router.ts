import { Router } from "express";
import {
  driveFileFolderTestController,
  getDriveFileFolder,
} from "../controllers/driveFileFolder.controller.ts";
const router = Router();

router.get("/test", driveFileFolderTestController);
router.get("/getFileFolder", getDriveFileFolder);
export default router;
