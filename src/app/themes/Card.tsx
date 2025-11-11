const Card = ({
  title,
  desc,
  imageSrc,
}: {
  title: string;
  desc: string;
  imageSrc?: string;
}) => {
  return (
    <div
      className="w-full max-w-md relative p-2 min-h-[550px] mx-3 flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/vector.svg')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="p-1"
        style={{
          backgroundImage: "url('/images/line.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="sm:p-8 md:p-6 p-4 flex flex-col overflow-hidden relative min-h-[450px] pb-32"
          style={{
            backgroundImage: "url('/images/design.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-[180px] object-cover mb-4 rounded-lg"
            />
          ) : (
            <div className="w-full h-[180px] bg-gray-800 mb-4 rounded-lg" />
          )}
          <h2 className="text-white text-left text-md mb-2">{title}</h2>
          <p className="text-white text-left text-md mb-4">{desc}</p>
          <div className="absolute bottom-6 left-6 right-6">
            <button
              className="w-full py-2 sm:py-3 text-white text-center relative transition-all duration-300 
               hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(198,166,103,0.65)]"
              style={{
                backgroundImage: "url('/images/stake-btn.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              GET READINGS
            </button>
            <img
              src="/images/img.svg"
              width={118}
              height={17}
              alt="logo"
              className="mx-auto mt-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
