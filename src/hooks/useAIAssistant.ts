import { create } from 'zustand';
import { useAIService } from '@/services/useAIService';
import type { ChatMessage, Client } from '@/types';

interface AIAssistantState {
  messages: ChatMessage[];
  isProcessing: boolean;
  clientContext: Client | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setClientContext: (client: Client | null) => void;
  processMessage: (content: string) => Promise<void>;
}

export const useAIAssistant = create<AIAssistantState>((set, get) => {
  const aiService = useAIService();

  return {
    messages: [],
    isProcessing: false,
    clientContext: null,

    addMessage: (message) => {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            ...message,
          },
        ],
      }));
    },

    clearMessages: () => set({ messages: [] }),

    setClientContext: (client) => set({ clientContext: client }),

    processMessage: async (content: string) => {
      const state = get();
      const { clientContext } = state;

      set({ isProcessing: true });

      try {
        // Add user message
        state.addMessage({ role: 'user', content });

        // Process with AI service
        const response = await aiService.processMessage(content, clientContext);
        
        // Add AI response
        state.addMessage(response);
      } catch (error) {
        state.addMessage({
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
        });
      } finally {
        set({ isProcessing: false });
      }
    },
  };
});