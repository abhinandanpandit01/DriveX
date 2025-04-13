import mongoose from "mongoose";
const connectToMongoDB = async () => {
  try {
    return await mongoose.connect(process.env.MONGODB_URL as string);
  } catch (err) {
    console.log(err);
  }
};
export default connectToMongoDB;
