function HomePage() {
  return (
    <div className="w-full bg-[#1E1E1E] min-h-screen flex items-center justify-center">
      <div className="hero-section px-5">
        <div className="">
          <h1 className="font-bold md:text-5xl text-3xl break-words text-center">
            Drive<span className="text-[#76ABAE]">X</span>,
            <span className="text-green-300">An App For Personal Storage</span>
          </h1>
        </div>
        <p className="text-lg text-blue-400 md:mt-5 mt-2 text-center">
          It gives you full security for all your files and folders. Moreover,
          It gives you your own privacy.
        </p>
      </div>
    </div>
  );
}
export default HomePage;
