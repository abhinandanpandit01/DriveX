import mongoose, { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Drive from "../models/drive.model.ts";
import ApiError from "../utils/ApiError";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  driveId: Schema.Types.ObjectId;
  driveName: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password must be at least 6 characters long"],
  },
  avatar: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  driveId: {
    type: Schema.Types.ObjectId,
    ref: "Drive",
  },
  driveName: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const encryptedPassword = await bcrypt.hash(this.password, 10);
  this.password = encryptedPassword;
});
UserSchema.post("save", async function () {
  if (this.driveId) return;
  try {
    await Drive.create({
      creator: this._id,
      name: `Drive-${this._id}`,
    });
    const drive = await Drive.findOne({ creator: this._id });
    if (!drive) throw new ApiError(500, "Failed to create drive");
    this.driveId = drive._id as mongoose.Types.ObjectId;
    this.driveName = drive.name as string;
    await this.save();
  } catch (err) {
    throw new ApiError(500, "Failed to create drive");
  }
});
UserSchema.methods.comparePassword = async function (password: string) {
  if (!password) return;
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  const accessToken = await jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return accessToken;
};
UserSchema.methods.generateRefreshToken = async function () {
  const refreshToken = await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "10d",
    }
  );

  return refreshToken;
};
const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
