"use client";

import React, { useState, useEffect } from "react";
import AudioRecorder from "@/components/audio_recorder";
import { Button } from "@/components/ui/button";
import { useAgentBusyStore, useAgentTalkingStore } from "@/app/store";
import SidebarSlider from "@/components/sidebar_slider";
import Modal from "@/components/modal";

type Message = {
  role: string;
  content: string | object;
  timestamp: string;
};

export default function Home() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const agentBusy = useAgentBusyStore((state) => state.agentBusy);
  const setAgentBusy = useAgentBusyStore((state) => state.setAgentBusy);
  const agentTalking = useAgentTalkingStore((state) => state.AgentTalking);
  const setAgentTalking = useAgentTalkingStore(
    (state) => state.setAgentTalking
  );

  async function deleteResponseFiles() {
    try {
      const response = await fetch("/api/delete-responses", {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        console.log("Files deleted successfully");
      } else {
        console.error("Failed to delete files");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getResponse(prompt: string) {
    setAgentBusy(true);
    try {
      const res = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      return data;
    } finally {
      setAgentBusy(false);
    }
  }

  async function getConversationHistory() {
    setAgentBusy(true);
    try {
      const res = await fetch("http://localhost:5000/conversation_history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data.conversation_history || [];
    } finally {
      setAgentBusy(false);
    }
  }

  useEffect(() => {
    getConversationHistory().then((data) => {
      setConversationHistory(data || []);
    });
  }, []);

  const makeQuery = async (query: string) => {
    setAgentBusy(true);
    deleteResponseFiles();
    try {
      const aiResponse = await getResponse(query);

      const conversationHistory = await getConversationHistory();
      setConversationHistory(conversationHistory);

      const responseAudioUrl = await fetch("/api/text_to_speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: aiResponse.response }),
      });

      if (responseAudioUrl.ok) {
        const data = await responseAudioUrl.json();
        const audioUrl = data.responseAudioFilePath;
        const audio = new Audio(audioUrl);

        audio.addEventListener("play", () => {
          setAgentTalking(true);
        });

        audio.addEventListener("ended", () => {
          setAgentTalking(false);
        });

        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setAgentTalking(false);
        });
      } else {
        console.error("Failed to fetch audio:", responseAudioUrl.status);
      }
    } finally {
      setAgentBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = e.currentTarget.prompt.value;
    e.currentTarget.prompt.value = "";

    await makeQuery(query);
  };

  const handleQueryAudioUpload = async () => {
    setAgentBusy(true);
    try {
      const filePath = "/query.wav";
      const file = await fetch(filePath).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", file, "./public/query.wav");

      const response = await fetch("/api/speech_to_text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await makeQuery(data.transcription);
      } else {
        console.error("Failed to upload audio");
      }
    } finally {
      setAgentBusy(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="flex bg-violet-200 w-full h-dvh p-8 justify-center">
        <div className="flex flex-col gap-4 max-w-2xl w-full justify-between">
          <div className="flex justify-between items-center w-full pb-8">
            <div className="flex flex-col justify-between h-full py-8 items-start">
              <h2 className="text-4xl font-bold text-secondary">Jarvy</h2>
              <SidebarSlider />
            </div>
            <div
              className={`bg-zinc-900 w-[200px] h-[200px] flex items-center justify-center rounded-[150px] border-8 border-secondary overflow-hidden ${
                agentBusy && "z-[1010]"
              }`}
            >
              <div className="relative inline-block">
                <img
                  src="./robot.png"
                  alt="robot"
                  className="w-[280px] h-[280px] object-cover object-center mt-[70px]"
                />
                {agentTalking ? (
                  <div className="absolute top-[155px] right-[64px]">
                    <div className="flex items-center justify-center">
                      <div className="sound-wave">
                        <div className="sound-bar robot-eyes"></div>
                        <div className="sound-bar robot-eyes"></div>
                        <div className="sound-bar robot-eyes"></div>
                        <div className="sound-bar robot-eyes"></div>
                        <div className="sound-bar robot-eyes"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-[145px] left-[52px]">
                      <div
                        className={`w-[30px] h-[40px] ${
                          agentBusy ? "loading-bar bg-black" : "robot-eyes"
                        } flex rounded-full`}
                      ></div>
                    </div>
                    <div className="absolute top-[145px] right-[50px]">
                      <div
                        className={`w-[30px] h-[40px] ${
                          agentBusy ? "loading-bar bg-black" : "robot-eyes"
                        } flex rounded-full`}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-white p-4 bg-zinc-900 rounded-xl h-full overflow-y-auto space-y-2">
            {conversationHistory.length > 0 ? (
              conversationHistory.map((msg, index) => (
                <p key={index}>
                  <strong className="text-zinc-400">{msg.role}:</strong>{" "}
                  {typeof msg.content === "string"
                    ? msg.content
                    : JSON.stringify(msg.content, null, 2)}{" "}
                </p>
              ))
            ) : (
              <p>No conversation history available.</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 text-white mt-2">
            <input
              type="text"
              name="prompt"
              placeholder="Enter your prompt"
              required
              className="text-white px-2 rounded-xl p-4 pl-8 w-full"
              disabled={agentBusy}
            />
            <Button type="submit" disabled={agentBusy} className="h-full">
              Submit
            </Button>
            <AudioRecorder
              onUpload={handleQueryAudioUpload}
              disabled={agentBusy}
            />
          </form>
          <div>
            <Modal isOpen={agentBusy}>
              <div className="relative inline-block"></div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
