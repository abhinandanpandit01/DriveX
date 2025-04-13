import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routers/user.router.ts";
import DriveRouter from "./routers/drive.router.ts";
import DriveFolderRouter from "./routers/driveFolder.router.ts";
import DriveFileRouter from "./routers/driveFile.router.ts";
import DriveFileFolderRouter from "./routers/driveFileFolder.router.ts";
import connectToMongoDB from "./Db/mongooseConnection.ts";
import verifyAuth from "./middlewares/verifyAuth.middleware.ts";
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send("For Testing Only");
});
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/drive", verifyAuth, DriveRouter);
app.use("/api/v1/driveFolder", verifyAuth, DriveFolderRouter);
app.use("/api/v1/driveFile", verifyAuth, DriveFileRouter);
app.use("/api/v1/driveFileFolder", verifyAuth, DriveFileFolderRouter);
connectToMongoDB()
  .then(() => {
    console.log("🚀 Connected to MongoDB .......");
    app.listen(process.env.SERVER_PORT || 8080, () => {
      console.log(`⚙️  Server is running on port ${process.env.SERVER_PORT}`);
    });
  })
  .catch((err) => console.log(err));
export default app;
