import { ResponseFile } from "@/Pages/DrivePage";
import FileIcons from "@/assets/FileIcons";
import { useState } from "react";
import Viewer from "react-viewer";
import { EllipsisVertical, FileUp, FileX } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";
type FileProps = {
  fileInfo: ResponseFile;
  isInsideFolder: boolean;
};
function File({ fileInfo, isInsideFolder }: FileProps) {
  const [visible, setVisible] = useState(false);
  // const [showOptions, setShowOptions] = useState(false);
  const fileType = fileInfo.type;
  const fileIcon = fileInfo.type.startsWith("raw")
    ? FileIcons.raw.icon
    : FileIcons.image.icon;

  const onViewImage = () => {
    if (!fileType.startsWith("image")) return;
    setVisible(true);
  };
  const onDownloadDocs = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const onDeleteFile = async (fileId: string) => {
    if (!fileId) return;
    let response;
    try {
      if (!isInsideFolder) {
        response = await axios.delete(`driveFile/deleteFileInDrive/${fileId}`);
      } else {
        response = await axios.delete(`driveFile/deleteFileInFolder/${fileId}`);
      }
      toast.success(response.data.message);
      location.reload();
      return;
    } catch (err) {
      console.log(err);
      toast.error("Failed To Delete File");
    }
  };
  return (
    <div className="flex flex-col items-end relative bg-neutral-800 px-4 rounded-sm pb-3">
      <Popover>
        <PopoverTrigger>
          <div className="download rounded-full mt-1 -mr-1.5">
            <EllipsisVertical size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-2">
          <div className="flex flex-col gap-3">
            <Label
              onClick={() => onDownloadDocs(fileInfo.fileUrl, fileInfo.name)}
            >
              <FileUp /> Download File
            </Label>

            <Label onClick={() => onDeleteFile(fileInfo._id)}>
              <FileX /> Delete File
            </Label>
          </div>
        </PopoverContent>
      </Popover>
      <div className="">
        <div className="icon-wrapper" onClick={onViewImage}>
          <img src={fileIcon} alt="" className="w-[100px]" />
        </div>

        <div className="text-center mt-3">
          <span className="">
            {fileInfo.name.slice(0, 8) +
              fileInfo.name.slice(
                fileInfo.name.length - 4,
                fileInfo.name.length
              )}
          </span>
        </div>
        <Viewer
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          images={[{ src: fileInfo.fileUrl, alt: "" }]}
        />
      </div>
    </div>
  );
}
export default File;
