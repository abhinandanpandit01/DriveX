import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  driveId: string;
  driveName: string;
};
type UserAuthProviderProps = {
  children: React.ReactNode;
};

type UserAuthContextType = {
  user: User;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  logOut: (type: string) => void;
  isAuthenticated: boolean;
};

const UserAuthContext = createContext<UserAuthContextType>({
  user: {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    driveId: "",
    driveName: "",
  },
  setUser: () => {},
  isLoggedIn: false,
  logOut: () => {},
  isAuthenticated: false,
});

const UserAuthContextProvider = ({ children }: UserAuthProviderProps) => {
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    avatar: "",
    driveId: "",
    driveName: "",
  });
  const isLoggedIn = Boolean(user._id);
  const navigate = useNavigate();
  useEffect(() => {
    if (document.cookie == "") return;
    const accessTokenAndRefreshTokens = document.cookie.split(";");
    if (accessTokenAndRefreshTokens.length !== 2) {
      //* means refresh token is there but accessToken is not there
      const refreshToken = accessTokenAndRefreshTokens[0].replace(
        "refreshToken=",
        ""
      );
      if (refreshToken) {
        axios
          .get("users/refreshAccessAndRefreshToken")
          .then((res) => {
            setUser(res.data.data.user);
          })
          .catch((err) => console.error(err));
        return;
      }
    }
    //* Access Token is present therefore no refresh in needed
    axios
      .get("users/currentUser")
      .then((res) => {
        setUser(res.data.data.currentUser);
        setUser((prev) => ({ ...prev, driveName: res.data.data.driveName }));
      })
      .catch((err) => console.error(err));
  }, []);
  const logOut = async (type: string) => {
    await axios
      .get("users/signout")
      .then(() => {
        setUser({
          _id: "",
          name: "",
          email: "",
          avatar: "",
          driveId: "",
          driveName: "",
        });
        if (type !== "switch") navigate("/"); // Here Switch means the user is switching his account and currently logges in.
      })
      .catch((err) => console.error(err));
  };
  return (
    <UserAuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        logOut,
        isAuthenticated: Boolean(user._id),
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
export default UserAuthContextProvider;

const useAuth = () => {
  try {
    const context = useContext(UserAuthContext);
    if (!context)
      throw new Error(
        "UserAuthContext must be used within a UserAuthContextProvider"
      );
    return context;
  } catch (err) {
    console.error(err);
  }
};

export { useAuth };
