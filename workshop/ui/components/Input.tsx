import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import { ChatStatus } from 'ai';
import { useState } from 'react';

export function Input({ status, onSubmit }: { status: ChatStatus, onSubmit: (message: PromptInputMessage) => void }) {
  const [message, setMessage] = useState('');

  return (
    <PromptInput onSubmit={(e) => {
      onSubmit(e);
    }} className="mt-4 relative">
      <PromptInputBody>
        <PromptInputAttachments>
          {(attachment) => (
            <PromptInputAttachment data={attachment} />
          )}
        </PromptInputAttachments>
        <PromptInputTextarea onChange={(e) => {
          setMessage(e.target.value);
        }} value={message} />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit
          status={status}

        />
      </PromptInputToolbar>
    </PromptInput>
  );
};