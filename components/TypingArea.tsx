
import React, { useRef, useEffect } from 'react';
import type { TestStatus } from '../types';

interface TypingAreaProps {
  userInput: string;
  onInputChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionChange: (isComposing: boolean) => void;
  status: TestStatus;
  textToType: string;
}

const TypingArea: React.FC<TypingAreaProps> = ({ userInput, onInputChange, onKeyDown, onCompositionChange, status, textToType }) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (status === 'running' || status === 'waiting') {
            inputRef.current?.focus();
        }
    }, [status, textToType]); // Also focus when text changes (e.g., on restart)

    const handleAreaClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="relative" onClick={handleAreaClick}>
            <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                onCompositionStart={() => onCompositionChange(true)}
                onCompositionEnd={() => onCompositionChange(false)}
                className="w-full h-32 p-4 bg-slate-900/50 rounded-md text-xl font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                disabled={status === 'finished'}
                aria-label="Typing input"
                placeholder={status === 'waiting' ? "Start typing to begin the test..." : "Type the sentence above..."}
            />
        </div>
    );
};

export default TypingArea;
