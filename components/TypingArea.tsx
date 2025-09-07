import React, { useEffect } from 'react';
import type { TestStatus } from '../types';

interface TypingAreaProps {
  userInput: string;
  onInputChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  status: TestStatus;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const TypingArea: React.FC<TypingAreaProps> = ({ userInput, onInputChange, onKeyDown, status, inputRef }) => {
    
    useEffect(() => {
        if (status !== 'finished') {
            inputRef.current?.focus();
        }
    }, [status, inputRef]);

    return (
        <div className="relative">
            <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full h-20 p-6 bg-slate-800 rounded-xl text-xl font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 resize-none placeholder:text-slate-600 tracking-wider"
                disabled={status === 'finished'}
                aria-label="Typing input"
                placeholder={status === 'waiting' ? "Type the words here... press space after each word" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                rows={1}
            />
        </div>
    );
};

export default TypingArea;