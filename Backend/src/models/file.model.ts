import { model, Schema, Document } from "mongoose";

interface FileInterface extends Document {
  name: string;
  driveId: Schema.Types.ObjectId;
  folderId: Schema.Types.ObjectId;
  type: string;
  isInFolder: boolean;
}
const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    driveId: {
      type: Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    fileUrl: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    isInFolder: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const FileModel = model<FileInterface>("File", FileSchema);
export default FileModel;
