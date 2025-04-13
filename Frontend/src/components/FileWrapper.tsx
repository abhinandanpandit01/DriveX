import { ResponseFilesAndFolders } from "@/Pages/DrivePage";
import File from "./File";

type FileWrapperProps = {
  allFoldersAndFiles: ResponseFilesAndFolders;
  insideFolder?: boolean;
};
function FileWrapper({ allFoldersAndFiles, insideFolder }: FileWrapperProps) {
  return (
    <div className="w-full h-fit flex flex-col pl-5">
      <h1 className="text-3xl font-semibold">Files</h1>
      <div className="w-full flex flex-wrap gap-12 mt-5">
        {allFoldersAndFiles &&
          allFoldersAndFiles.allFiles &&
          allFoldersAndFiles.allFiles.map((file) => (
            <File
              fileInfo={file}
              key={file._id}
              isInsideFolder={insideFolder!}
            />
          ))}
      </div>
    </div>
  );
}
export default FileWrapper;
