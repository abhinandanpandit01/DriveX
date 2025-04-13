import { Router } from "express";
import {
  testController,
  getDriveController,
} from "../controllers/drive.controller.ts";

const router = Router();

router.get("/test", testController);
router.get("/getDrive/:driveId", getDriveController);
export default router;
