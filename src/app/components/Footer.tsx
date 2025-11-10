import {
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaTelegramPlane
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-20 py-4 px-8 text-[#E3C679] border-[#C6A667]/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex gap-8 text-sm tracking-wider">
          <button className="hover:text-white transition">GITBOOK</button>
          <button className="hover:text-white transition">TUTORIALS</button>
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-white hover:scale-110 transition">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="hover:text-white hover:scale-110 transition">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="hover:text-white hover:scale-110 transition">
            <FaDiscord size={20} />
          </a>
          <a href="#" className="hover:text-white hover:scale-110 transition">
            <FaTelegramPlane size={20} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default Footer;
