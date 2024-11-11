import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FileUpload } from '@/components/ai/FileUpload';
import { MessageList } from '@/components/ai/MessageList';
import { QuickActions } from '@/components/ai/QuickActions';
import { aiService } from '@/services/aiService';
import { AlertCircle, Send, Loader2 } from 'lucide-react';
import type { ChatMessage } from '@/types';

export function AIAssistant() {
  const navigate = useNavigate();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeThread();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeThread = async () => {
    try {
      const newThreadId = await aiService.createThread();
      setThreadId(newThreadId);
      
      // Load existing messages if any
      const existingMessages = await aiService.getThreadMessages(newThreadId);
      setMessages(existingMessages);
    } catch (err) {
      setError('Failed to initialize chat. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!threadId || (!input.trim() && !files.length)) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.sendMessage(threadId, input, files);
      setMessages(prev => [...prev, response]);
      setInput('');
      setFiles([]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionId: string, prompt: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.executeQuickAction(threadId, actionId as any);
      setMessages(prev => [...prev, response]);

      // If the action creates an estimate, navigate to it
      if (actionId === 'estimate' && response.data?.estimateId) {
        navigate(`/dashboard/estimates/${response.data.estimateId}`);
      }
    } catch (err) {
      setError(`Failed to execute ${actionId} action. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <QuickActions onActionSelect={handleQuickAction} />
          
          <Card className="p-4">
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </Card>
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <FileUpload
            onUpload={handleFileUpload}
            files={files}
            onRemove={(index) => {
              setFiles(prev => prev.filter((_, i) => i !== index));
            }}
          />

          <div className="mt-4 flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !files.length)}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}