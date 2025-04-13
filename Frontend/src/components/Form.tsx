import { useState } from "react";
import { Input } from "./ui/input";
import FileUploader from "./FileUploader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/UserAuthProvider";
import { toast } from "sonner";

type FormProps = {
  type: "signup" | "signin";
};
export type FormData = {
  name?: string;
  email: string;
  password: string;
  avatar?: File | null;
};
function Form({ type }: FormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const navigate = useNavigate();
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleSignUp = async () => {
    if (
      type == "signup"
        ? !(
            formData.name &&
            formData.email &&
            formData.password &&
            formData.avatar
          )
        : !(formData.email && formData.password)
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (type === "signup") {
        data.append("name", formData.name!);
        if (formData.avatar) data.append("avatar", formData.avatar);
      }
      const res = await axios.post(`users/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        toast.success(res.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          avatar: null,
        });
      }
      setLoading(false);
      navigate("/signin");
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  };
  const handleSignIn = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    axios
      .post(`users/signin`, {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setFormData({
            name: "",
            email: "",
            password: "",
            avatar: null,
          });
        }
        currentUser?.setUser(res.data.data);
        setLoading(false);
        navigate("/drive/" + res.data.data.driveName);
      })
      .catch((err) => {
        toast.error((err as Error).message);
        setLoading(false);
      });
  };
  return (
    <div className="w-[30rem] h-fit bg-[#1E1E1E] py-8 md:px-8 px-5 rounded-xl">
      <h1 className="md:text-4xl text-2xl font-semibold">
        {type === "signup" ? "Sign Up" : "Sign In"}
      </h1>
      <div className="input-fields flex flex-col gap-4 mt-8">
        {type === "signup" && (
          <>
            <FileUploader onChangeFile={onChangeFile} />
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Username"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </>
        )}
        <Input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <div className="btn-wrapper mt-5">
        <button
          className="w-full bg-blue-500 py-[11px] md:text-xl text-lg rounded-lg font-semibold"
          onClick={type === "signup" ? handleSignUp : handleSignIn}
        >
          {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Sign In"}
        </button>
      </div>
      {type === "signin" && (
        <div className="mt-5 text-center">
          <Link
            to={`/signin/forgetPassword/${formData.email}`}
            className="underline-offset-4 underline text-gray-200 md:text-base text-sm"
          >
            Forget Password
          </Link>
        </div>
      )}
    </div>
  );
}

export default Form;
