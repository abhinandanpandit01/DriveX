import { Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Folder from "../models/folder.model.ts";
import File from "../models/file.model.ts";
import Drive from "../models/drive.model.ts";
import { CustomRequest } from "../middlewares/verifyAuth.middleware";
const driveFileFolderTestController = AsyncWrapper(
  async (req: Request, res: Response) => {
    res.status(200).send("This is only for testing purpose....");
  }
);

const getDriveFileFolder = AsyncWrapper(
  async (req: Request & CustomRequest, res: Response) => {
    const currentUser = req?.user;
    if (!currentUser) throw new ApiError(401, "Unauthorized");

    const driveId = currentUser.driveId;
    if (!driveId) throw new ApiError(401, "Unauthorized");

    try {
      const allFiles = await File.find({
        $and: [{ driveId: driveId }, { isInFolder: false }],
      });
      const allFolders = await Folder.find({
        $and: [{ driveId: driveId }, { isInFolder: false }],
      });

      if (!(allFiles || allFolders))
        throw new ApiError(
          500,
          "Something went wrong during fetching all the files and folders."
        );
      res.status(200).json(
        new ApiResponse(200, "Files and Folder are successfully fetched", {
          allFiles,
          allFolders,
        })
      );
    } catch (err) {
      throw new ApiError(500, "Failed to send the files and folders");
    }
  }
);

export { driveFileFolderTestController, getDriveFileFolder };
