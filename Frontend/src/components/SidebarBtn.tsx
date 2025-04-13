import { Plus } from "lucide-react";

function SidebarBtn() {
  return (
    <div className="inline-flex gap-1 bg-blue-500 lg:px-8 lg:py-4 px-4 py-2 rounded-full text-xl items-center lg:mt-4 mt-2 ml-5 justify-center">
      <span>
        <Plus strokeWidth={3} />
      </span>
      <span>New</span>
    </div>
  );
}
export default SidebarBtn;
