import { OptionType } from "@/Pages/DrivePage";
import SidebarBtn from "./SidebarBtn";
import SidebarDropDown from "./SidebarDropDown";
type SidebarProps = {
  onOptionChange: (option: OptionType) => void;
};
function Sidebar({ onOptionChange }: SidebarProps) {
  return (
    <div className="h-full w-full relative py-2 bg-[#171717] lg:row-[1_/_3]">
      <div className="create-btn-wrapper w-full">
        <SidebarDropDown onOptionChange={onOptionChange}>
          <SidebarBtn />
        </SidebarDropDown>
      </div>
    </div>
  );
}
export default Sidebar;
