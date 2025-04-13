import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DeleteIcon, FileUp, MoreVertical } from "lucide-react";

type MoreOptionsType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & PropsWithChildren;
function MoreOptions({ open, setOpen }: MoreOptionsType) {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuContent>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuItem>
          <FileUp /> Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DeleteIcon /> Delete File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default MoreOptions;
