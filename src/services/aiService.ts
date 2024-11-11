import axios from 'axios';
import { OPENAI_ASSISTANT_ID } from '@/config/constants';
import type { ChatMessage, ProcessedData } from '@/types';

class AIService {
  private assistantId = OPENAI_ASSISTANT_ID;

  async createThread(): Promise<string> {
    try {
      const response = await axios.post('/api/ai/threads');
      return response.data.threadId;
    } catch (error) {
      throw new Error('Failed to create conversation thread');
    }
  }

  async analyzeBlueprintData(
    processedData: ProcessedData,
    fileName: string
  ): Promise<{
    materials: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    laborEstimate: {
      hours: number;
      rate: number;
      total: number;
    };
    recommendations: string[];
  }> {
    try {
      const response = await axios.post('/api/ai/analyze-blueprint', {
        processedData,
        fileName,
        assistantId: this.assistantId,
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to analyze blueprint data');
    }
  }

  async sendMessage(
    threadId: string,
    content: string,
    files?: File[]
  ): Promise<ChatMessage> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('threadId', threadId);
      formData.append('assistantId', this.assistantId);
      
      if (files?.length) {
        files.forEach(file => formData.append('files', file));
      }

      const response = await axios.post('/api/ai/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }

  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`/api/ai/threads/${threadId}/messages`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to retrieve messages');
    }
  }
}

export const aiService = new AIService();