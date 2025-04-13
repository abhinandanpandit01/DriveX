import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FolderPlus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

type CreateFolderMenuProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isInsideFolder?: boolean;
  folderId?: string;
};
function CreateFolderMenu({
  isOpen,
  onOpenChange,
  isInsideFolder,
  folderId,
}: CreateFolderMenuProps) {
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const onCreateFolder = async () => {
    if (!folderName) toast.error("Folder Name is required");
    try {
      setIsloading(true);
      if (!isInsideFolder) {
        await axios.post("driveFolder/createFolder", {
          folderName,
        });
      } else {
        await axios.post(`driveFolder/createFolderInFolder/${folderId}`, {
          newFolderName: folderName,
        });
      }
      onOpenChange(false);
      toast.success("Folder Successfully Created");
      location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
    setIsloading(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="w-full">
          <DialogTitle className="flex justify-between"></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <Label className="text-nowrap text-lg">Folder Name:</Label>
          <Input
            className="min-w-[13rem]"
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-end mt-4">
          <button
            className="inline-flex gap-2 items-center bg-blue-500 px-3 py-2 rounded-xl disabled:bg-blue-900"
            onClick={onCreateFolder}
            disabled={isLoading}
          >
            <FolderPlus />
            <span className="text-lg">
              {isLoading ? "Loading....." : "Create"}
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CreateFolderMenu;
