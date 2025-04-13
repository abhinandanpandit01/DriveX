import CreateFolderMenu from "@/components/CreateFolderMenu";
import FileWrapper from "@/components/FileWrapper";
import FolderWrapper from "@/components/FolderWrapper";
import LocationIndicator from "@/components/LocationIndicator";
import Sidebar from "@/components/Sidebar";
import UploadFileMenu from "@/components/UploadFileMenu";
import { usePath } from "@/context/PathProvider";
import { useAuth } from "@/context/UserAuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";

export type ResponseFolder = {
  _id: string;
  name: string;
  driveId: string;
  filesId: string[];
  foldersId: string[];
  path: string;
};
export type ResponseFile = {
  _id: string;
  name: string;
  driveId: string;
  fileUrl: string;
  type: string;
};
export type ResponseFilesAndFolders = {
  allFiles: ResponseFile[];
  allFolders: ResponseFolder[];
};
export type OptionType = "new_folder" | "upload_file" | "upload_folder";
function DrivePage() {
  const [option, setOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const path = usePath();
  const currentUser = useAuth();
  const [allFoldersAndFiles, setAllFoldersAndFiles] =
    useState<ResponseFilesAndFolders>();
  const onOptionChange = (option: OptionType) => {
    setOption(option);
    setIsOpen(true);
  };
  useEffect(() => {
    axios
      .get("driveFileFolder/getFileFolder")
      .then((res) => {
        setAllFoldersAndFiles(res.data.data as ResponseFilesAndFolders);
        path.setPath(`${currentUser?.user.driveName}`);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);
  return (
    <div className="container max-w-screen min-h-screen grid lg:grid-cols-[15rem_1fr] grid-cols-1 lg:grid-rows-none grid-rows-[5rem_1fr] relative">
      <Sidebar onOptionChange={onOptionChange} />
      {option == "new_folder" && (
        <CreateFolderMenu onOpenChange={setIsOpen} isOpen={isOpen} />
      )}
      {option == "upload_file" && (
        <UploadFileMenu onOpenChange={setIsOpen} isOpen={isOpen} />
      )}
      <div className="w-full h-full pl-5 pr-5 pb-8 flex flex-col gap-[2rem] lg:col-[2_/_3]">
        <LocationIndicator />
        <FolderWrapper
          allFoldersAndFiles={allFoldersAndFiles!}
          insideFolder={false}
        />
        <FileWrapper allFoldersAndFiles={allFoldersAndFiles!} />
      </div>
    </div>
  );
}
export default DrivePage;
