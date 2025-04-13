import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import axios from "axios";
import UserAuthContextProvider from "./context/UserAuthProvider";
import ProtectedRouter from "./components/ProtectedRouter";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import PathContextProvider from "./context/PathProvider";

const HomePage = lazy(() => import("./Pages/HomePage"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage"));
const SignInPage = lazy(() => import("./Pages/SignInPage"));
const DrivePage = lazy(() => import("./Pages/DrivePage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const ForgetPasswordPage = lazy(() => import("./Pages/ForgetPasswordPage"));
const MoreFileFolderPage = lazy(() => import("./Pages/MoreFileFolderPage"));
axios.defaults.baseURL = "http://localhost:8080/api/v1/";
axios.defaults.withCredentials = true;

const router = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loader />}>
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<Loader />}>
        <SignInPage />
      </Suspense>
    ),
  },
  {
    path: "/drive/:driveName",
    element: (
      <Suspense fallback={<Loader />}>
        <DrivePage />
      </Suspense>
    ),
  },
  {
    path: "/profile/user/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <ProfilePage />
      </Suspense>
    ),
  },
  {
    path: "/drive/:userId/:driveId/:folderId",
    element: (
      <Suspense fallback={<Loader />}>
        <MoreFileFolderPage />
      </Suspense>
    ),
  },
  {
    path: "/signin/forgetPassword/:email",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgetPasswordPage />
      </Suspense>
    ),
  },
];

function App() {
  const ProtectedRoutes = ["/drive/*", "/profile/*"];
  return (
    <UserAuthContextProvider>
      <PathContextProvider>
        <Navbar />
        <Routes>
          {router.map((route) => {
            if (ProtectedRoutes.includes(route.path)) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRouter key={route.path}>
                      {route.element}
                    </ProtectedRouter>
                  }
                />
              );
            } else {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            }
          })}
        </Routes>
      </PathContextProvider>
    </UserAuthContextProvider>
  );
}

export default App;
