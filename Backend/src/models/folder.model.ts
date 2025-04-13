import { model, Schema, Document } from "mongoose";

export interface FolderInterface extends Document {
  name: string;
  driveId: Schema.Types.ObjectId;
  filesId: Schema.Types.ObjectId[];
  foldersId: Schema.Types.ObjectId[];
  path: string;
  isInFolder: boolean;
}
const FolderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    driveId: {
      type: Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
    filesId: {
      type: [Schema.Types.ObjectId],
      ref: "File",
    },
    foldersId: {
      type: [Schema.Types.ObjectId],
      ref: "Folder",
    },
    path: {
      type: String,
      required: true,
    },
    isInFolder: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const FolderModel = model<FolderInterface>("Folder", FolderSchema);
export default FolderModel;
