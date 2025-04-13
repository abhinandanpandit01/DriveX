import { Request, Response } from "express";
import Drive from "../models/drive.model.ts";
import Folder from "../models/folder.model.ts";
import AsyncWrapper from "../utils/AsyncWrapper.ts";
import ApiError from "../utils/ApiError.ts";
import ApiResponse from "../utils/ApiResponse.ts";
import mongoose, { Schema } from "mongoose";
import { CustomRequest } from "../middlewares/verifyAuth.middleware.ts";

const createFolderInDriveController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { folderName } = req.body;
    const currentUser = req?.user;
    const driveId = currentUser?.driveId;
    const driveName = req?.driveName;
    if (!(driveId || folderName || driveName))
      throw new ApiError(400, "Please provide drive id and folder name");
    try {
      const isFolderPresent = await Folder.find({ name: folderName });
      if (isFolderPresent) await new ApiError(400, "Folder is not present");
      const newFolder = await Folder.create({
        name: folderName,
        driveId: driveId,
        path: `${driveName}/${folderName}`,
        isInFolder: false,
      });
      if (!newFolder) throw new ApiError(500, "Failed to Create new Folder");
      const drive = await Drive.findById(driveId);
      if (!drive) throw new ApiError(400, "Drive does not exist");
      drive.folderIds.push(newFolder._id as mongoose.Schema.Types.ObjectId);
      await drive.save();
      res
        .status(201)
        .json(new ApiResponse(201, "Folder created successfully", newFolder));
    } catch (err) {
      throw new ApiError(500, "Failed to create folder");
    }
  }
);
const deleteFolderInDriveController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { folderId } = req.params;
    const currentUser = req?.user;
    const driveId = currentUser?.driveId;
    if (!folderId) throw new ApiError(400, "Please provide folder id");
    try {
      const folder = await Folder.findByIdAndDelete(folderId);
      if (!folder) throw new ApiError(400, "Folder does not exist");
      const drive = await Drive.findById(driveId);
      if (!drive) throw new ApiError(400, "Drive does not exist");
      drive.folderIds = drive.folderIds.filter(
        (id) => id.toString() !== folderId
      );
      await drive.save();
      res
        .status(200)
        .json(new ApiResponse(200, "Folder deleted successfully", folder));
    } catch (err) {
      throw new ApiError(500, "Failed to delete folder");
    }
  }
);
const createFolderInFolderController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { folderId } = req.params;
    const { newFolderName } = req.body;
    if (!(folderId || newFolderName))
      throw new ApiError(400, "Both folderId and new folder name is required");
    const currentUser = req.user;
    if (!currentUser) throw new ApiError(401, "Unauthorized");
    const driveId = currentUser.driveId;
    if (!driveId) throw new ApiError(401, "Unauthorized");
    try {
      const targetFolder = await Folder.findById(folderId);
      if (!targetFolder) throw new ApiError(404, "Folder not found");
      const newFolder = await Folder.create({
        name: newFolderName,
        driveId: driveId,
        path: `${targetFolder.path}/${newFolderName}`,
        isInFolder: true,
      });
      targetFolder.foldersId.push(newFolder._id as Schema.Types.ObjectId);
      await targetFolder.save();
      res
        .status(201)
        .json(new ApiResponse(201, "Folder Successfully Create", newFolder));
    } catch (err) {
      throw new ApiError(500, "Failed to create folder inside the folder");
    }
  }
);
const deleteFolderInFolderController = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { containingFolderId, targetFolderId } = req.params;
    if (!(containingFolderId || targetFolderId))
      throw new ApiError(
        400,
        "Both ContainingFolder and targetFolder is required"
      );
    try {
      const containingFolder = await Folder.findById(containingFolderId);
      if (!containingFolder)
        throw new ApiError(404, "Containing Folder Not Found");
      const targetFolder = await Folder.findByIdAndDelete(targetFolderId);
      if (!targetFolder)
        throw new ApiError(404, "Target Folder Not Found or Server Error");
      containingFolder.foldersId = containingFolder.foldersId.filter(
        (id) => id.toString() !== targetFolderId
      );
      await containingFolder.save();
      res
        .status(200)
        .json(
          new ApiResponse(200, "Successfully Deleted the folder", targetFolder)
        );
    } catch (err) {
      throw new ApiError(500, "Failed to delete the folder");
    }
  }
);
const getAllFolderAndFileOfFolderController = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const { folderId } = req.params;
    if (!folderId) throw new ApiError(400, "Folder id is needed");
    const folderObjId = new mongoose.Types.ObjectId(folderId as string);
    try {
      const result = await Folder.aggregate([
        {
          $match: {
            _id: folderObjId,
          },
        },
        {
          $lookup: {
            from: "folders",
            localField: "foldersId",
            foreignField: "_id",
            as: "folderDetails",
          },
        },
        {
          $lookup: {
            from: "files",
            localField: "filesId",
            foreignField: "_id",
            as: "fileDetails",
          },
        },
      ]);
      if (!result)
        throw new ApiError(
          500,
          "Failed to get files and folders of the current folder"
        );
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Successfully Fetched the folders and files of the current folder",
            result[0]
          )
        );
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to fetch folders and files of the current folder"
      );
    }
  }
);
export {
  createFolderInDriveController,
  deleteFolderInDriveController,
  createFolderInFolderController,
  deleteFolderInFolderController,
  getAllFolderAndFileOfFolderController,
};
