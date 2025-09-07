import React from 'react';
import { splitGraphemes } from '../utils/text';
import type { Language } from '../types';

interface TextDisplayProps {
  textToType: string;
  userInput: string;
  language: Language;
}

const Caret: React.FC = () => (
    <span className="animate-pulse absolute -left-px top-[3px] h-[80%] w-0.5 bg-yellow-400"></span>
);

const Character: React.FC<{
    char: string;
    state: 'correct' | 'incorrect' | 'pending' | 'current';
}> = React.memo(({ char, state }) => {
    const classMap = {
        correct: 'text-slate-200',
        incorrect: 'text-red-400 bg-red-500/20 rounded-sm',
        pending: 'text-slate-500',
        current: 'relative',
    };
    return <span className={`relative transition-colors duration-150 ${classMap[state]}`}>{char}{state === 'current' && <Caret />}</span>;
});


const TextDisplay: React.FC<TextDisplayProps> = ({ textToType, userInput, language }) => {
    const textGraphemes = React.useMemo(() => splitGraphemes(textToType.normalize('NFC'), language), [textToType, language]);
    const inputGraphemes = React.useMemo(() => splitGraphemes(userInput.normalize('NFC'), language), [userInput, language]);

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-2xl mb-6">
            <p className="text-2xl md:text-3xl leading-relaxed tracking-wide font-mono break-all" aria-label="Text to type">
                {textGraphemes.map((char, index) => {
                    let state: 'correct' | 'incorrect' | 'pending' | 'current' = 'pending';
                    if (index < inputGraphemes.length) {
                        state = char === inputGraphemes[index] ? 'correct' : 'incorrect';
                    } else if (index === inputGraphemes.length) {
                        state = 'current';
                    }

                    return <Character key={`${char}_${index}`} char={char} state={state} />;
                })}
            </p>
        </div>
    );
};

export default TextDisplay;