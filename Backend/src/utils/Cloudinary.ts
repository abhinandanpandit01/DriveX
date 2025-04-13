import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFileToCloud = async (pathName: string, fileType: string) => {
  const resourceType = fileType.startsWith("image") ? "image" : "raw";
  if (!pathName) throw new ApiError(400, "Please upload a file");
  try {
    const result = await cloudinary.uploader.upload(pathName, {
      resource_type: resourceType,
      access_mode: "public",
    });
    return {
      url: result.url,
      type: result.resource_type,
    };
  } catch (err) {
    fs.unlinkSync(pathName);
    throw new ApiError(500, "Failed to upload file");
  }
};

export default uploadFileToCloud;
