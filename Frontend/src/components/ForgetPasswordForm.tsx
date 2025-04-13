import { useState } from "react";
import { Input } from "./ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/UserAuthProvider";
import { toast } from "sonner";
import axios from "axios";

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
};
function ForgetPasswordForm() {
  const { email: userEmail } = useParams();
  const [formData, setFormData] = useState<FormData>({
    email: userEmail as string,
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = useAuth();

  const onChangePassword = async () => {
    if (!formData.email || !formData.newPassword || !formData.currentPassword) {
      toast.error("All Fields are needed");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("users/forgotPassword", formData);
      toast.success(response.data.message);
      userInfo?.setUser(response.data.data);
      navigate(`/drive/${response.data.data.driveName}`);
      return;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <div className="w-[30rem] h-fit bg-[#1E1E1E] py-8 md:px-8 px-5 rounded-xl">
      <h1 className="md:text-4xl text-2xl font-semibold">
        Forget Password Form
      </h1>
      <div className="input-fields flex flex-col gap-4 mt-8">
        <Input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          name="Current Password"
          value={formData.currentPassword}
          placeholder="Current Password"
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
        />
        <Input
          type="password"
          name="New Password"
          value={formData.newPassword}
          placeholder="New Password"
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
        />
      </div>
      <div className="btn-wrapper mt-5">
        <button
          className="w-full bg-blue-500 py-[11px] md:text-xl text-lg rounded-lg font-semibold"
          onClick={onChangePassword}
        >
          {loading ? "Loading..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}
export default ForgetPasswordForm;
