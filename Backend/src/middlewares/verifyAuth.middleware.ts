import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiResponse from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.ts";
import Drive from "../models/drive.model.ts";
import ApiError from "../utils/ApiError";
export interface CustomRequest extends Request {
  user?: any;
  driveName?: string;
}
const verifyAuth: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken)
    return res.status(401).json(new ApiError(401, "Unauthorized"));
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & { _id: string };
    const currentUser = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    const drive = await Drive.findById(currentUser?.driveId);
    if (!drive) throw new ApiError(401, "Unauthorized");
    if (!currentUser)
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    req.user = currentUser;
    req.driveName = drive.name;
    return next() as any;
  } catch (err) {
    console.log(err);
    return res.status(401).json(new ApiResponse(401, "Unauthorized"));
  }
};

export default verifyAuth;
