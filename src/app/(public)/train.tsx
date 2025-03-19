// import Image from "next/image";
// import React from "react";

// const MarqueeTrain = () => {
//   return (
//     <div className="w-full bg-blue overflow-hidden py-2 text-white whitespace-nowrap relative">
//       <div className="flex w-max animate-marquee">
//         <MarqueeContent />
//         <MarqueeContent />
//       </div>
//     </div>
//   );
// };

// const MarqueeContent = () => {
//   return (
//     <div className="flex gap-10">
//       <Notification
//         label="Thông báo:"
//         text="Đường sắt công bố đường dây nóng tiếp nhận thông tin sự cố, tai nạn"
//         link="#"
//       />
//       <Notification
//         label="Thông báo:"
//         text="Thông báo tuyển dụng lao động tháng 4/2024"
//         link="#"
//       />
//       <Notification
//         label="Thông báo:"
//         text="Tuyển dụng nhân sự cho Trung tâm VHTTDL Công đoàn ĐS"
//         link="#"
//       />
//     </div>
//   );
// };
// interface NotificationProps {
//   label: string;
//   text: string;
//   link: string;
// }

// const Notification: React.FC<NotificationProps> = ({ label, text, link }) => {
//   return (
//     <div className="flex items-start w-full">
//       {/* Đầu tàu */}
//       <div className="flex items-center text-lg gap-3">
//         <Image
//           src="/train-head.png"
//           width={60}
//           height={30}
//           quality={100}
//           alt="Train Head"
//           className="w-[60px] h-auto"
//         />
//       </div>
//       {/* Nội dung thông báo */}
//       <div className="flex flex-col w-full">
//         <div>
//           <span className="font-bold text-yellow-400 mr-2">{label}</span>
//           <a href={link} className="text-black hover:underline">
//             {text}
//           </a>
//         </div>
//         {/* Dây chở (toa tàu kéo theo) */}
//         <div className="w-full h-5">
//           <Image
//             src="/train.png" // Thay ảnh toa tàu
//             width={120}
//             height={40}
//             quality={100}
//             alt="Train Car"
//             className="w-full h-auto" // Để ảnh kéo dài 100%
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarqueeTrain;

import Image from "next/image";
import React from "react";

const MarqueeTrain = () => {
  return (
    <div className="w-full bg-blue overflow-hidden py-2 text-white whitespace-nowrap relative">
      <div className="flex w-max animate-marquee">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

const MarqueeContent = () => {
  return (
    <div className="flex gap-10">
      <Notification
        label="Thông báo:"
        text="Đường sắt công bố đường dây nóng tiếp nhận thông tin sự cố, tai nạn"
        link="#"
      />
      <Notification
        label="Thông báo:"
        text="Thông báo tuyển dụng lao động tháng 4/2024"
        link="#"
      />
      <Notification
        label="Thông báo:"
        text="Tuyển dụng nhân sự cho Trung tâm VHTTDL"
        link="#"
      />
    </div>
  );
};

interface NotificationProps {
  label: string;
  text: string;
  link: string;
}

const Notification: React.FC<NotificationProps> = ({ label, text, link }) => {
  return (
    <div className="flex items-start">
      {/* Đầu tàu */}
      <div className="flex items-center text-lg gap-3 relative top-[-10px] ">
        <Image
          src="/train-head1.png"
          width={60}
          height={30}
          quality={100}
          alt="Train Head"
          className="w-[60px] h-auto"
        />
      </div>
      {/* Nội dung thông báo */}
      <div className="flex flex-col items-start">
        <div>
          <span className="font-bold text-yellow-400 mr-2 text-lg">
            {label}
          </span>
          <a
            href={link}
            className="text-white hover:underline text-2xl font-extrabold drop-shadow-xl"
          >
            {text}
          </a>
        </div>
        {/* Toa tàu */}
        <div className="w-auto h-5 overflow-hidden">
          <Image
            src="/train.png"
            width={700} // Tăng chiều rộng để tránh hình ảnh bị biến mất
            height={40}
            quality={100}
            alt="Train Car"
            className="h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default MarqueeTrain;
