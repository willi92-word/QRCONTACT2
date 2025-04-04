"use client";

import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "react-share";

import {
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";

export default function ShareButtons({ shareUrl }: { shareUrl: string }) {
  const commonClasses =
    "flex items-center justify-center gap-2 text-white font-medium py-2 rounded-lg text-sm transition-colors";

  return (
    <div className="grid grid-cols-2 gap-2">
      <WhatsappShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-green-500 hover:bg-green-600`}>
          <FaWhatsapp /> WhatsApp
        </div>
      </WhatsappShareButton>

      <TelegramShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-blue-400 hover:bg-blue-500`}>
          <FaTelegramPlane /> Telegram
        </div>
      </TelegramShareButton>

      <FacebookShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-blue-600 hover:bg-blue-700`}>
          <FaFacebookF /> Facebook
        </div>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-neutral-900 hover:bg-neutral-800`}>
          <FaTwitter /> X (Twitter)
        </div>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-blue-700 hover:bg-blue-800`}>
          <FaLinkedinIn /> LinkedIn
        </div>
      </LinkedinShareButton>

      <EmailShareButton url={shareUrl} className="w-full">
        <div className={`${commonClasses} bg-red-600 hover:bg-red-700`}>
          <FaEnvelope /> E-Mail
        </div>
      </EmailShareButton>
    </div>
  );
}