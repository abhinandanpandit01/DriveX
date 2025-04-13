import { Router } from "express";
import {
  signUpController,
  signInController,
  signOutController,
  currentUserController,
  updateUserController,
  refreshAccessAndRefreshTokenController,
  forgotPasswordController,
} from "../controllers/user.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import verifyAuth from "../middlewares/verifyAuth.middleware";

const router = Router();

router.post("/signup", uploadFile.single("avatar"), signUpController);
router.post("/signin", signInController);

router.get("/signout", verifyAuth, signOutController);
router.get("/currentUser", verifyAuth, currentUserController);
router.patch(
  "/updateCurrentUser/:id",
  verifyAuth,
  uploadFile.single("avatar"),
  updateUserController
);
router.get(
  "/refreshAccessAndRefreshToken",
  refreshAccessAndRefreshTokenController
);
router.post("/forgotPassword", forgotPasswordController);
export default router;
