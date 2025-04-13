import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/UserAuthProvider";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
function Navbar() {
  const currentUser = useAuth();
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#171717] lg:px-8  px-2 lg:py-4 py-2 flex justify-between items-center">
      <div className="logo-wrapper">
        <NavLink
          to={currentUser?.user ? `/drive/user/${currentUser.user._id}` : ""}
          className="lg:text-6xl text-3xl font-bold text-[#EEEEEE]"
        >
          Drive<span className="text-[#76ABAE]">X</span>
        </NavLink>
      </div>
      {currentUser?.isLoggedIn ? (
        <div className="profile flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="lg:w-14 lg:h-14 w-12 h-12 rounded-full">
                <AvatarImage
                  src={currentUser.user.avatar}
                  className="rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/profile/user/" + currentUser.user._id);
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/drive/${currentUser.user.driveName}`)}
              >
                My Drive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  currentUser?.logOut("switch");
                  toast.success("Logged out successfully");
                  navigate("/signup");
                }}
              >
                Register Other Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  currentUser?.logOut("switch");
                  toast.success("Logged out successfully");
                  navigate("/signin");
                }}
              >
                Switch Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  currentUser?.logOut("");
                  toast.success("Logged out successfully");
                  navigate("/signin");
                }}
              >
                Log Out <LogOut className="ml-5" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex md:gap-10 gap-5">
          <NavLink
            to="/signin"
            className="md:text-lg text-sm font-semibold text-[#76ABAE] hover:text-[#EEEEEE] hover:underline"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className="md:text-lg text-sm font-semibold text-[#76ABAE] hover:text-[#EEEEEE] hover:underline"
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </div>
  );
}
export default Navbar;
