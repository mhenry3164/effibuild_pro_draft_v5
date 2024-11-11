import { create } from 'zustand';
import axios from 'axios';
import type { Client } from '@/types/client';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4-1106-preview';

interface AIServiceConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

interface AIMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface AIServiceState {
  loading: boolean;
  error: string | null;
  messages: AIMessage[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMessage: (message: AIMessage) => void;
  clearMessages: () => void;
  processMessage: (content: string, client?: Client, config?: AIServiceConfig) => Promise<AIMessage>;
  generateSystemPrompt: (client?: Client) => string;
}

export const useAIService = create<AIServiceState>((set, get) => ({
  loading: false,
  error: null,
  messages: [],

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  processMessage: async (content: string, client?: Client, config?: AIServiceConfig) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      if (client?.assistantId) {
        const response = await axios.post(
          `https://api.openai.com/v1/assistants/${client.assistantId}/messages`,
          {
            content,
            metadata: {
              clientId: client.id,
              company: client.company,
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v1',
            },
          }
        );

        setLoading(false);
        return {
          content: response.data.content,
          role: 'assistant',
        };
      }

      const clientSettings = client?.customAISettings?.modelPreferences;
      
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: get().generateSystemPrompt(client),
            },
            {
              role: 'user',
              content,
            },
          ],
          temperature: config?.temperature ?? clientSettings?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? clientSettings?.maxTokens ?? 2048,
          top_p: config?.topP ?? clientSettings?.topP ?? 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setLoading(false);
      return {
        content: response.data.choices[0].message.content,
        role: 'assistant',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process AI request';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  },

  generateSystemPrompt: (client?: Client) => {
    const basePrompt = `You are an AI assistant for EffiBuild Pro, a construction estimation platform. 
    Your role is to help with construction estimates, project planning, and general construction queries.`;

    if (client) {
      return `${basePrompt}
      You are currently assisting ${client.company}. 
      Use their specific industry terms and estimation rules when applicable.`;
    }

    return basePrompt;
  },
}));