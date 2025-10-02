'use client';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { MessageContent } from "@/components/ai-elements/message";
import { Message } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Input } from "@/components/Input";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4111/chat',
    }),
  });

  console.log(messages);

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <Conversation className="relative w-full" style={{ height: '500px' }}>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    console.log(part)
                    switch (part.type) {
                      case 'data-weather':
                        return (
                          <Response key={`${message.id}-${i}`}>
                            Searching for the weather in {part.data.location}...
                          </Response>
                        );
                      case 'text': // we don't use any reasoning or tool calls in this example
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}</MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <Input status={status} onSubmit={message => {
        console.log({ status })
        if (status === 'streaming') {
          stop();
          return;
        }

        if (!message.files && !message.text) {
          return
        }

        sendMessage({
          text: message.text || '',
          files: message.files,
        });
      }} />
    </div >
  );
}