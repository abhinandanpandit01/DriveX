import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth, User } from "@/context/UserAuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "sonner";

type CurrentUser = Omit<User, "avatar"> & {
  password: string | undefined;
  avatar: string | File;
};

function ProfilePage() {
  const currentUser = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<CurrentUser | null>();
  const [loading, setLoading] = useState(false);
  const handleEdit = () => {
    setLoading(true);
    if (
      !(
        currentUserData?.name ||
        currentUserData?.email ||
        currentUserData?.avatar ||
        currentUserData?.password
      )
    )
      return;
    const formData = new FormData();
    if (currentUserData.password)
      formData.append("password", currentUserData.password);
    if (currentUserData.avatar)
      formData.append("avatar", currentUserData.avatar);
    if (currentUserData.name) formData.append("name", currentUserData.name);
    if (currentUserData.email) formData.append("email", currentUserData.email);
    axios
      .patch(`users/updateCurrentUser/${currentUser?.user._id}`, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          currentUser?.setUser(res.data.data);
          setCurrentUserData({
            _id: res.data.data._id,
            name: res.data.data.name,
            email: res.data.data.email,
            password: undefined,
            avatar: res.data.data.avatar,
            driveId: res.data.data.driveId,
            driveName: res.data.data.driveName,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });

    setEditMode(false);
  };
  useEffect(() => {
    if (currentUser?.user) {
      setCurrentUserData({
        _id: currentUser.user._id,
        name: currentUser.user.name,
        email: currentUser.user.email,
        avatar: currentUser.user.avatar,
        password: undefined,
        driveId: currentUser.user.driveId,
        driveName: currentUser.user.driveName,
      });
    }
  }, [currentUser]);
  return (
    <div className="w-full text-white md:px-10 px-3">
      <div className="edit-form-wrapper w-full py-8">
        <Avatar className="w-36 h-36 relative">
          <AvatarImage
            src={currentUser?.user?.avatar}
            className="rounded-full"
          />
          <div className="camera-wrapper absolute w-full py-2 bg-[rgba(255,255,255,0.3)] backdrop-blur-sm bottom-0 left-0 flex items-center justify-center z-40">
            <FaCamera size={"1.6em"} />
          </div>
        </Avatar>
        <Input
          className="mt-5"
          type="file"
          disabled={!editMode}
          accept="image/*"
          onChange={(e) => {
            setCurrentUserData((prev) => {
              return { ...prev!, avatar: e.target.files![0] };
            });
          }}
        />
      </div>
      <div className="general-info-section w-full rounded-lg px-8 bg-[rgba(30,30,30,.6)] py-10 flex flex-col gap-4 items-center">
        <Input
          value={editMode ? currentUserData!.name : currentUser?.user.name}
          type="text"
          className="py-5 text-lg"
          disabled={!editMode}
          onChange={(e) => {
            setCurrentUserData((prev) => {
              return { ...prev!, name: e.target.value };
            });
          }}
        />
        <Input
          value={editMode ? currentUserData!.email : currentUser?.user.email}
          type="email"
          className="py-5 text-lg"
          disabled={!editMode}
          onChange={(e) => {
            setCurrentUserData((prev) => {
              return { ...prev!, email: e.target.value };
            });
          }}
        />
        <Input
          type="password"
          value={currentUserData?.password ?? "**********"}
          className="py-5 text-lg"
          disabled={!editMode}
          onChange={(e) => {
            setCurrentUserData((prev) => {
              return { ...prev!, password: e.target.value };
            });
          }}
        />
        <div className="flex w-full justify-end px-2 sm:gap-8 sm:flex-row flex-col gap-4 mt-7">
          <button
            className={`px-4 py-3 bg-[#76ABAE] rounded-lg disabled:bg-[#76ABAE]/40 disabled:cursor-not-allowed sm:text-md text-sm`}
            onClick={() => setEditMode(true)}
            disabled={editMode}
          >
            Wanna Change
          </button>
          <button
            className={`px-4 py-2 bg-[#76ABAE] rounded-lg disabled:bg-[#76ABAE]/40 disabled:cursor-not-allowed`}
            disabled={!editMode}
            onClick={handleEdit}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
