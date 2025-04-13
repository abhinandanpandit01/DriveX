import { useNavigate, useParams } from "react-router-dom";
import FolderIcon from "../assets/Folder.svg";
import { useAuth } from "@/context/UserAuthProvider";
import { ResponseFolder } from "@/Pages/DrivePage";
import { usePath } from "@/context/PathProvider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FolderX, List } from "lucide-react";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "sonner";

type FolderProps = {
  folderInfo: ResponseFolder;
  insideFolder: boolean;
};
function Folder({ folderInfo, insideFolder }: FolderProps) {
  const navigate = useNavigate();
  const { folderId: holdingFolderId } = useParams();
  const currentUser = useAuth();
  const toNavigatePath = `/drive/${currentUser?.user._id}/${currentUser?.user.driveId}/${folderInfo._id}`;
  const path = usePath();
  const onDeleteFolder = async (folderId: string) => {
    if (!folderId) return;
    let response;
    try {
      if (!insideFolder) {
        response = await axios.delete(`driveFolder/deleteFolder/${folderId}`);
      } else {
        response = await axios.delete(
          `driveFolder/deleteFolderInFolder/${holdingFolderId}/${folderId}`
        );
      }
      toast.success(response.data.message);
      location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Failed to Delete");
    }
  };
  return (
    <div className="flex flex-col items-center relative">
      <div
        className="icon-wrapper"
        onClick={() => {
          navigate(toNavigatePath);
          path.setPath(folderInfo.path);
        }}
      >
        <img src={FolderIcon} alt="" className="w-[120px]" />
      </div>
      <div className="flex items-center gap-5">
        <span>{folderInfo.name}</span>
        <Popover>
          <PopoverTrigger>
            <div className="w-fit h-fit p-1 bg-neutral-700 rounded-full">
              <List size={25} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-2">
            <div className="flex flex-col gap-2">
              <Label onClick={() => onDeleteFolder(folderInfo._id)}>
                <FolderX /> Delete Folder
              </Label>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
export default Folder;
