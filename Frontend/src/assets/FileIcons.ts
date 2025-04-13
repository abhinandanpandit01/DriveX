import ImageFileIcon from "../assets/imageFile.svg";
import RawFileIcon from "../assets/defaultFileIcon(large).png";
type IconType = {
  extensions: string[];
  icon: string;
};
type FileTypes = {
  raw: IconType;
  image: IconType;
};
const FileIcons: Record<keyof FileTypes, IconType> = {
  raw: {
    extensions: ["*"],
    icon: RawFileIcon,
  },

  image: {
    extensions: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
    icon: ImageFileIcon,
  },
};

export default FileIcons;
