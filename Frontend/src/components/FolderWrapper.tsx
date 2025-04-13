import { ResponseFilesAndFolders } from "@/Pages/DrivePage";
import Folder from "./Folder";
type FolderWrapperProps = {
  allFoldersAndFiles: ResponseFilesAndFolders;
  insideFolder: boolean;
};
function FolderWrapper({
  allFoldersAndFiles,
  insideFolder,
}: FolderWrapperProps) {
  return (
    <div className="w-full h-fit flex flex-col pl-5">
      <h1 className="text-3xl font-semibold">Folders</h1>
      <div className="w-full flex flex-wrap gap-12">
        {allFoldersAndFiles &&
          allFoldersAndFiles.allFolders &&
          allFoldersAndFiles.allFolders.map((folder) => (
            <Folder
              key={folder._id}
              folderInfo={folder}
              insideFolder={insideFolder}
            />
          ))}
      </div>
    </div>
  );
}
export default FolderWrapper;
