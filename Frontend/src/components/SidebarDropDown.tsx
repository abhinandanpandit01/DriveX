import { Folder, FileUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { PropsWithChildren } from "react";
import { OptionType } from "@/Pages/DrivePage";
type SidebarDropDownProps = {
  onOptionChange: (option: OptionType) => void;
} & PropsWithChildren;
function SidebarDropDown({ children, onOptionChange }: SidebarDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="mb-2"
          onClick={() => onOptionChange("new_folder")}
        >
          <Folder /> New Folder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onOptionChange("upload_file");
          }}
        >
          <FileUp /> Upload File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default SidebarDropDown;
