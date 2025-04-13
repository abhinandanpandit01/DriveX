import { useParams } from "react-router-dom";
import LocationIndicator from "../components/LocationIndicator";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { OptionType, ResponseFilesAndFolders } from "@/Pages/DrivePage";
import axios from "axios";
import FolderWrapper from "@/components/FolderWrapper";
import FileWrapper from "@/components/FileWrapper";
import CreateFolderMenu from "@/components/CreateFolderMenu";
import UploadFileMenu from "@/components/UploadFileMenu";
import { usePath } from "@/context/PathProvider";

function MoreFileFolder() {
  const { folderId } = useParams();
  const [option, setOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const path = usePath();
  const [filesAndFolders, setFilesAndFolders] =
    useState<ResponseFilesAndFolders | null>();
  const onOptionChange = (option: OptionType) => {
    setOption(option);
    setIsOpen(true);
  };

  useEffect(() => {
    axios
      .get(`driveFolder/allFileAndFolder/${folderId}`)
      .then((res) => {
        const { fileDetails, folderDetails } = res.data.data;
        path.setPath(res.data.data.path || "");
        setFilesAndFolders(() => {
          return {
            allFiles: fileDetails,
            allFolders: folderDetails,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [folderId, path]);
  return (
    <div className="w-full h-screen grid lg:grid-cols-[15rem_1fr] grid-cols-1 lg:grid-rows-none grid-rows-[5rem_1fr]">
      <Sidebar onOptionChange={onOptionChange} />
      {option == "new_folder" && (
        <CreateFolderMenu
          onOpenChange={setIsOpen}
          isOpen={isOpen}
          isInsideFolder={true}
          folderId={folderId}
        />
      )}
      {option == "upload_file" && (
        <UploadFileMenu
          onOpenChange={setIsOpen}
          isOpen={isOpen}
          isInsideFolder={true}
          folderId={folderId}
        />
      )}
      <div className="">
        <LocationIndicator />
        {filesAndFolders?.allFolders.length ? (
          <FolderWrapper
            allFoldersAndFiles={filesAndFolders!}
            insideFolder={true}
          />
        ) : null}
        {filesAndFolders?.allFiles.length ? (
          <FileWrapper
            allFoldersAndFiles={filesAndFolders!}
            insideFolder={true}
          />
        ) : null}
      </div>
    </div>
  );
}
export default MoreFileFolder;
