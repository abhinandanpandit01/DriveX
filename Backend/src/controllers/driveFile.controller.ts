import { raw, Request, Response } from "express";
import Folder from "../models/folder.model.ts";
import Drive from "../models/drive.model.ts";
import File from "../models/file.model.ts";
import AsyncWrapper from "../utils/AsyncWrapper.ts";
import ApiError from "../utils/ApiError.ts";
import ApiResponse from "../utils/ApiResponse.ts";
import { Schema } from "mongoose";
import { CustomRequest } from "../middlewares/verifyAuth.middleware.ts";
import uploadFileToCloud from "../utils/Cloudinary.ts";

const uploadFileInDriveController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const currentUser = req.user;
    const file = req.file;
    if (!file) throw new ApiError(400, "File is needed");
    if (!currentUser) throw new ApiError(401, "Unauthorized");
    const driveId = currentUser.driveId;
    const filePath = file.path;
    const resource_type = file.mimetype.startsWith("image") ? "image" : "raw";
    try {
      const isFilePresent = await File.find({ name: file.filename });
      if (isFilePresent.length !== 0)
        throw new ApiError(400, "File already exists");
      // file upload to cloudinary logic
      const { url: uploadedFileUrl, type } = await uploadFileToCloud(
        filePath,
        resource_type
      );
      if (!uploadedFileUrl) throw new ApiError(500, "Failed To upload file");
      const newUplodedFile = await File.create({
        name: file.filename,
        fileUrl: uploadedFileUrl,
        driveId: driveId,
        type: type,
        isInFolder: false,
      });
      const currentUserDrive = await Drive.findById(driveId);
      if (!currentUserDrive) throw new ApiError(404, "No Drive is found");
      currentUserDrive.fileIds.push(
        newUplodedFile._id as Schema.Types.ObjectId
      );
      await currentUserDrive.save();
      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            "File Uploaded Created Successfully",
            newUplodedFile
          )
        );
    } catch (err) {
      throw new ApiError(500, "Failed to create File");
    }
  }
);

const deleteFileInDriveController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { fileId } = req.params;
    const currentUser = req.user;
    if (!currentUser) throw new ApiError(401, "Unauthorized");
    if (!fileId) throw new ApiError(400, "File Id is needed for deletion");
    const driveId = currentUser.driveId;
    try {
      const deletedFile = await File.findByIdAndDelete(fileId);
      const currentUserDrive = await Drive.findById(driveId);
      if (!currentUserDrive) throw new ApiError(404, "Drive Not Found");
      currentUserDrive.fileIds = currentUserDrive.fileIds.filter(
        (id) => id.toString() !== fileId
      );
      await currentUserDrive.save();
      res
        .status(200)
        .json(new ApiResponse(200, "File Successfully Deleted", deletedFile));
    } catch (err) {
      throw new ApiError(500, "Failed to delete File");
    }
  }
);
const uploadFileInFolderController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const file = req.file;
    const { folderId: sentFolderId } = req.params;
    const currentUser = req.user;
    if (!currentUser) throw new ApiError(401, "Unauthorized");
    const driveId = currentUser.driveId;
    if (!sentFolderId)
      throw new ApiError(400, "FolderId and Filename is required");
    if (!file) throw new ApiError(400, "File is needed");
    try {
      const isFilePresent = await File.find({ name: file?.filename });
      if (isFilePresent.length !== 0)
        throw new ApiError(400, "File already exists");
      const targetFolder = await Folder.findById(sentFolderId);
      if (!targetFolder) throw new ApiError(404, "Folder not found");
      const folderId = targetFolder._id;
      // upload file in cloudinary logic
      const { url: uploadedFileUrl, type } = await uploadFileToCloud(
        file.path,
        "raw"
      );
      if (!uploadedFileUrl) throw new ApiError(500, "Failed To upload file");
      const newFile = await File.create({
        name: file?.filename,
        fileUrl: uploadedFileUrl,
        folderId: folderId,
        driveId: driveId,
        type: type,
        isInFolder: true,
      });
      if (!newFile) throw new ApiError(500, "Failed to create file");
      targetFolder.filesId.push(newFile._id as Schema.Types.ObjectId);
      await targetFolder.save();
      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            "File Successfully created in the folder",
            newFile
          )
        );
    } catch (err) {
      throw new ApiError(500, "Failed To Create file in the folder");
    }
  }
);
const deleteFileInFolderContoller = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { fileId } = req.params;

    if (!fileId) throw new ApiError(400, "File id is needed");
    try {
      const targetFile = await File.findByIdAndDelete(fileId);
      if (!targetFile)
        throw new ApiError(500, "Failed to delete file in the folder");
      const fileContainingFolder = await Folder.findById(targetFile.folderId);
      if (!fileContainingFolder)
        throw new ApiError(
          500,
          "Something Went Wrong during file deleting from folder"
        );
      fileContainingFolder.filesId = fileContainingFolder.filesId.filter(
        (id) => id.toString() !== fileId
      );
      await fileContainingFolder.save();
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "File successfully Removed from the folder",
            targetFile
          )
        );
    } catch (err) {
      throw new ApiError(500, "Failed to delete the file from folder");
    }
  }
);
export {
  uploadFileInDriveController,
  deleteFileInDriveController,
  uploadFileInFolderController,
  deleteFileInFolderContoller,
};
