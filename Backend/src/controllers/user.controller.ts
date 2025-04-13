import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import AsyncWrapper from "../utils/AsyncWrapper";
import uploadFileToCloud from "../utils/Cloudinary";
import { CustomRequest } from "../middlewares/verifyAuth.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (_id: string) => {
  if (!_id) throw new ApiError(400, "User does not exist");
  const user = await User.findById(_id);
  if (!user) throw new ApiError(400, "User does not exist");
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  if (!(accessToken && refreshToken))
    throw new ApiError(500, "Failed to generate tokens");
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
const signUpController = AsyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!(name || email || password))
    throw new ApiError(400, "Please fill all the fields");

  const isUserExists = await User.findOne({ email });
  if (isUserExists) throw new ApiError(400, "User already exists");

  if (!req.file) throw new ApiError(400, "Please upload an avatar");
  const avatarPath = req.file?.path;
  if (!avatarPath) throw new ApiError(400, "Please upload an avatar");

  const { url: uploadedAvatarUrl } = await uploadFileToCloud(
    avatarPath,
    "image"
  );
  if (!uploadedAvatarUrl) throw new ApiError(500, "Failed to upload avatar");
  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: uploadedAvatarUrl,
    });
    const {
      password: savedPassword,
      refreshToken,
      ...userDetails
    } = user.toObject();
    res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", userDetails));
  } catch (err) {
    throw new ApiError(500, "Failed to create user");
  }
});

const signInController = AsyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!(email || password))
    throw new ApiError(400, "Please fill all the fields");
  try {
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) throw new ApiError(400, "User does not exist");
    const isPasswordCorrect = await isUserExists.comparePassword(password);
    if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      isUserExists._id as string
    );
    const {
      password: savedPassword,
      refreshToken: savedRefreshToken,
      ...userDetails
    } = isUserExists.toObject();
    const cookieOptions = {
      // httpOnly: true,
      // secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, "User signed in successfully", userDetails));
  } catch (err) {
    throw new ApiError(500, "Failed to sign in user");
  }
});

const signOutController = AsyncWrapper(
  async (req: CustomRequest, res: Response) => {
    const { accessToken } = req.cookies;

    if (!accessToken) throw new ApiError(401, "Unauthorized");
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload & { _id: string };
      const currentUser = await User.findById(decoded._id).select(
        "-password -refreshToken"
      );
      if (!currentUser) throw new ApiError(401, "Unauthorized");
      currentUser.refreshToken = "";
      await currentUser.save();
      res
        .status(200)
        .cookie("accessToken", "", { httpOnly: true, secure: true })
        .cookie("refreshToken", "", { httpOnly: true, secure: true })
        .json(new ApiResponse(200, "User signed out successfully"));
    } catch (err) {
      throw new ApiError(500, "Failed to sign out user");
    }
  }
);
const currentUserController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const currentUser = req?.user;
    const driveName = req?.driveName;
    if (!(currentUser || driveName)) throw new ApiError(401, "Unauthorized");
    res.status(200).json(
      new ApiResponse(200, "CurrentUser fetched successfully", {
        currentUser,
        driveName,
      })
    );
  }
);

const updateUserController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { email, name, password } = req.body;
    const { id } = req.params;
    const avatarURL = req.file?.path;
    const currentUser = req?.user;
    if (!currentUser) throw new ApiError(401, "Unauthorized");
    const updatingData: { [key: string]: string } = {};
    if (email) updatingData["email"] = email;
    if (name) updatingData["name"] = name;
    if (password) updatingData["password"] = await bcrypt.hash(password, 10);
    try {
      if (avatarURL) {
        const { url: uploadedAvatarUrl } = await uploadFileToCloud(
          avatarURL,
          "image"
        );
        if (!uploadedAvatarUrl)
          throw new ApiError(500, "Failed to upload avatar");
        updatingData["avatar"] = uploadedAvatarUrl;

        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              ...updatingData,
            },
          },
          { new: true }
        ).select("-password -refreshToken");
        if (!updatedUser) throw new ApiError(500, "Failed to update user");
        res
          .status(200)
          .json(new ApiResponse(200, "User updated successfully", updatedUser));
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          currentUser._id,
          {
            $set: {
              ...updatingData,
            },
          },
          { new: true }
        ).select("-password -refreshToken");
        if (!updatedUser) throw new ApiError(500, "Failed to update user");
        res
          .status(200)
          .json(new ApiResponse(200, "User updated successfully", updatedUser));
      }
    } catch (err) {
      throw new ApiError(500, "Failed to update user");
    }
  }
);
const refreshAccessAndRefreshTokenController = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new ApiError(401, "Unauthorized");
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload & { _id: string };
      if (!decoded._id) throw new ApiError(400, "Invalid Refresh Token");
      const user = await User.findById(decoded._id);
      if (!user) throw new ApiError(404, "User not found");
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshToken(user._id as string);
      if (!(newAccessToken || newRefreshToken))
        throw new ApiError(500, "Failed to generate tokens");
      user.refreshToken = newRefreshToken;
      await user.save();
      const currentUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      if (!currentUser) throw new ApiError(404, "User not found");

      res
        .status(200)
        .cookie("accessToken", newAccessToken)
        .cookie("refreshToken", newRefreshToken)
        .json(
          new ApiResponse(200, "Tokens Refreshed Successfully", {
            user: currentUser,
          })
        );
    } catch (err) {
      throw new ApiError(500, "Failed to refresh Access And Refresh Token");
    }
  }
);
const forgotPasswordController = AsyncWrapper(
  async (req: Request, res: Response) => {
    const {
      currentPassword: sentPreviousPassword,
      newPassword: sentNewPassword,
      email,
    } = req.body;
    if (!(sentNewPassword || sentPreviousPassword))
      throw new ApiError(400, "Both previous and current passwords are needed");
    try {
      const user = await User.findOne({ email: email });
      if (!user) throw new ApiError(404, "User not found");
      const isPasswordCorrect = await user.comparePassword(
        sentPreviousPassword
      );
      if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Passowrd");
      const newHashedPassword = await bcrypt.hash(sentNewPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          password: newHashedPassword,
        },
        { new: true }
      ).select("-password -refreshToken");
      if (!updatedUser) throw new ApiError(500, "Failed to set new Password");
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        updatedUser._id as string
      );
      if (!accessToken || !refreshToken)
        throw new ApiError(500, "Failed to generate tokens");
      await updatedUser.save();
      res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(
          new ApiResponse(200, "Password updated Successfully", updatedUser)
        );
    } catch (err) {
      throw new ApiError(500, "Failed to change password");
    }
  }
);
export {
  signUpController,
  signInController,
  signOutController,
  currentUserController,
  updateUserController,
  refreshAccessAndRefreshTokenController,
  forgotPasswordController,
};
