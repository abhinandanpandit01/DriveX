import MoonLoader from "react-spinners/MoonLoader";
function Loader() {
  return (
    <div className="flex items-center justify-center absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8">
      <MoonLoader size={55} color="#eeeeee" />
    </div>
  );
}
export default Loader;
