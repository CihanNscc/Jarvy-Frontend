"use client";

import React, { useState } from "react";

interface CopyPasteSectionProps {
  title: string;
  value: string;
  num_rows?: number;
  onCopy: () => void;
}

const CopyPasteSection: React.FC<CopyPasteSectionProps> = ({
  title,
  value,
  num_rows = 1,
  onCopy,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <div className="flex flex-col p-8 bg-zinc-900 rounded-xl">
      <div className="flex w-full justify-between items-center">
        <strong className="pl-4">{title}:</strong>
        {isCopied ? (
          <img
            src="./check.svg"
            alt="copied"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        ) : (
          <img
            onClick={handleCopyClick}
            src="./content_copy.svg"
            alt="copy content"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
      <textarea
        value={value}
        readOnly
        className="w-full bg-transparent p-2 h-auto overflow-auto"
        rows={num_rows}
      />
    </div>
  );
};

export default CopyPasteSection;
