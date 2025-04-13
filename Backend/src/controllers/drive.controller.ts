import { Request, Response } from "express";
import AsyncWrapper from "../utils/AsyncWrapper.ts";
import ApiError from "../utils/ApiError.ts";
import ApiResponse from "../utils/ApiResponse.ts";
import Drive from "../models/drive.model.ts";
const testController = AsyncWrapper(async (req: Request, res: Response) => {
  res.send("For Drive Testing Purpose Only");
});

const getDriveController = AsyncWrapper(async (req: Request, res: Response) => {
  const { driveId } = req.params;
  if (!driveId) throw new ApiError(400, "Please provide drive id");
  try {
    const drive = await Drive.findById(driveId);
    if (!drive) throw new ApiError(400, "Drive does not exist");
    res
      .status(200)
      .json(new ApiResponse(200, "Drive found successfully", drive));
  } catch (err) {
    throw new ApiError(500, "Failed to find drive");
  }
});

export { testController, getDriveController };
