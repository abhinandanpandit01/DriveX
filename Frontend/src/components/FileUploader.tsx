import { Input } from "./ui/input";
type FileUploaderProps = {
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
function FileUploader({ onChangeFile }: FileUploaderProps) {
  return <Input type="file" className="mt-5" onChange={onChangeFile} />;
}
export default FileUploader;
