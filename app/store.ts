import { create } from "zustand";

type AgentBusyStore = {
  agentBusy: boolean;
  setAgentBusy: (agentBusy: boolean) => void;
};

export const useAgentBusyStore = create<AgentBusyStore>((set) => ({
  agentBusy: false,
  setAgentBusy: (agentBusy: boolean) => set({ agentBusy }),
}));

type AgentTalkingStore = {
  AgentTalking: boolean;
  setAgentTalking: (AgentTalking: boolean) => void;
};

export const useAgentTalkingStore = create<AgentTalkingStore>((set) => ({
  AgentTalking: false,
  setAgentTalking: (AgentTalking: boolean) => set({ AgentTalking }),
}));
