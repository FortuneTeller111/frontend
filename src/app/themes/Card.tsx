import Payment from "./Payment";

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
          <Payment />
        </div>
      </div>
    </div>
  );
};

export default Card;
