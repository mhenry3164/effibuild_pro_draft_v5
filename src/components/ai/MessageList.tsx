import { memo } from 'react';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = memo(function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[80%] items-start space-x-2 rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.role === 'user' ? (
              <User className="h-5 w-5" />
            ) : (
              <Bot className="h-5 w-5" />
            )}
            <div className="space-y-1">
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70">
                {format(new Date(message.timestamp), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});