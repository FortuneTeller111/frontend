import Payment from "./Payment";

const Card = ({
  title,
  desc,
  imageSrc,
  disable,
}: {
  title: string;
  desc: string;
  imageSrc?: string;
  disable: boolean;
}) => {
  return (
    <div
      className={`relative w-[380px] min-h-[492px] ${
        disable
          ? "bg-fortune-blue/10  cursor-not-allowed  pointer-events-none opacity-65"
          : "bg-fortune-blue"
      } text-white`}
      style={{
        backgroundImage: "url('/images/card-frame.svg')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-4 py-2">
        <div
          className="flex flex-col items-center px-6 py-8 h-[475px]"
          style={{
            backgroundImage: "url('/images/card-corner.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top",
          }}
        >
          <div className="w-[280px] h-[200px] bg-fortune-purple"></div>
          <p className="pt-4">{title}</p>
          <p className="pt-2 h-[100px]">{desc}</p>
          <div className="w-full flex justify-between pt-2 pb-4">
            <div>
              <p>Pay for reading</p>
            </div>
            <div>
              <p className="text-fortune-yellow">1 USDC</p>
            </div>
          </div>
          <Payment />
        </div>
      </div>
    </div>
  );
};

export default Card;
