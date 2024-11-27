import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  onUpload: () => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onUpload,
  disabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];
      await uploadAudio(audioBlob);

      onUpload();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "./public/query.wav");

    await fetch("/api/upload_audio", {
      method: "POST",
      body: formData,
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "F4" && !disabled) {
      if (!isRecording) {
        startRecording();
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "F4" && !disabled) {
      if (isRecording) {
        stopRecording();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording, disabled]);

  return (
    <Button
      variant={"secondary"}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className="h-full"
    >
      {isRecording && !disabled ? (
        <img
          src="./mic_on.svg"
          alt="mic on icon"
          className="min-w-[24px] min-h-[24px]"
        />
      ) : (
        <img
          src="./mic_off.svg"
          alt="mic off icon"
          className="min-w-[24px] min-h-[24px]"
        />
      )}
    </Button>
  );
};

export default AudioRecorder;
