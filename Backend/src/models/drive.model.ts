import { model, Schema, Document } from "mongoose";

export interface DriveInterface extends Document {
  name: string;
  creator: Schema.Types.ObjectId;
  folderIds: Schema.Types.ObjectId[];
  fileIds: Schema.Types.ObjectId[];
}

const DriveSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    folderIds: {
      type: [Schema.Types.ObjectId],
      ref: "Folder",
    },
    fileIds: {
      type: [Schema.Types.ObjectId],
      ref: "File",
    },
  },
  { timestamps: true }
);

const DriveModel = model<DriveInterface>("Drive", DriveSchema);
export default DriveModel;
