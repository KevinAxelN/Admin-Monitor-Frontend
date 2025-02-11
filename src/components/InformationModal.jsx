import React from "react";
import { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";

const InformationModal = ({ show, onHide, icon, header, item }) => {
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    // Tambahkan kelas 'overflow-hidden' pada elemen body ketika modal terbuka
    if (show) {
      document.body.classList.add("overflow-hidden");
      setAnimationKey((prevKey) => prevKey + 1);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Fungsi untuk menghapus kelas 'overflow-hidden' saat komponen di-unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      key={animationKey}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: [0, 0.71, 0.2, 1.01],
        scale: {
          type: "spring",
          damping: 8,
          stiffness: 100,
          restDelta: 0.001,
        },
      }}
      className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center  ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="absolute h-full w-full bg-white/10 backdrop-blur-sm"></div>

      <div className="absolute max-h-full w-full max-w-2xl overflow-auto p-4 lg:p-0 ">
        <div className="container overflow-hidden rounded-lg bg-white p-2">
          <div className="modal-header p-2">
            <h5 className="text-center text-xl font-bold text-red-500">
              <InfoIcon className="mb-1" /> Information
            </h5>
            <div className="mb-4 mt-4 border border-b-orange-500 "></div>
          </div>
          <div className="grid place-items-center text-red-500">{icon}</div>

          <div className="modal-body text-md flex flex-wrap justify-center p-4 font-bold text-red-500">
            <p>{header}</p>
            <p>{item}</p>
          </div>

          <div className="modal-footer flex justify-end gap-2 p-4">
            <button
              type="button"
              className="w-12 rounded-lg bg-red-500 p-2 text-white"
              onClick={onHide}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InformationModal;