import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FolderUp } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

type FileReponse = {
  name: string;
  fileUrl: string;
  createdAt: string;
  driveId: string;
};
type UploadFileMenuProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  isInsideFolder?: boolean;
  folderId?: string;
};
function UploadFileMenu({
  onOpenChange,
  isOpen,
  isInsideFolder,
  folderId,
}: UploadFileMenuProps) {
  const [file, setFile] = useState<File | undefined>();
  const [, setResData] = useState<FileReponse>();
  const [loading, setLoading] = useState(false);
  const onUploadFile = async () => {
    if (!file) {
      toast.error("File is needed");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file as Blob);
      let response;
      if (!isInsideFolder) {
        response = await axios.post("driveFile/createFileInDrive", formData);
      } else {
        response = await axios.post(
          `driveFile/createFileInFolder/${folderId}`,
          formData
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(response?.data.message);
      setResData(response?.data.data);
      setFile(undefined);
      onOpenChange(false);
      location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Something Went wrong");
    }
    setLoading(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex w-full">
          <DialogTitle className="flex justify-between">
            Upload New File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <Label className="text-nowrap text-lg">File Name:</Label>
          <Input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.item(0) as File);
            }}
          />
        </div>
        <div className="w-full flex justify-end mt-4">
          <button
            className="inline-flex gap-2 items-center bg-blue-500 px-3 py-2 rounded-xl"
            onClick={onUploadFile}
            disabled={loading}
          >
            <FolderUp />
            <span className="text-lg">
              {loading ? "Uploading..." : "Upload"}
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default UploadFileMenu;
