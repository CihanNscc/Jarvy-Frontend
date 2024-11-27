"use client";

import { on } from "events";
import React, { useState } from "react";

type MiniConfirmationBoxProps = {
  iconUrl: string;
  onClick: () => void;
};

const MiniConfirmationBox: React.FC<MiniConfirmationBoxProps> = ({
  iconUrl,
  onClick,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    onClick();
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[24px] min-w-[24px]">
      {!open ? (
        <img
          src={iconUrl}
          alt="cancel icon"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-between min-h-[60px] min-w-[24px]">
          <img
            src="./disabled_by_default.svg"
            alt="cancel icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <img
            src="./select_check_box.svg"
            alt="confirm icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
      )}
    </div>
  );
};

export default MiniConfirmationBox;
