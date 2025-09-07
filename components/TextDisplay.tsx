import React, { useRef, useEffect } from 'react';
import { splitGraphemes } from '../utils/text';
import type { Language } from '../types';

interface TextDisplayProps {
  words: string[];
  completedWords: { word: string; status: 'correct' | 'incorrect' }[];
  currentWordIndex: number;
  userInput: string;
  language: Language;
}

const Caret: React.FC = () => (
    <span className="animate-pulse absolute -left-px top-[10%] h-[80%] w-0.5 bg-yellow-400 rounded-full"></span>
);

const Character: React.FC<{
    char: string;
    state: 'correct' | 'incorrect' | 'pending' | 'current';
}> = React.memo(({ char, state }) => {
    const classMap = {
        correct: 'text-slate-300',
        incorrect: 'text-red-400',
        pending: 'text-slate-500',
        current: 'relative',
    };
    return <span className={classMap[state]}>{char}</span>;
});


const CurrentWord: React.FC<{ word: string, userInput: string, language: Language, isActive: boolean }> =
    ({ word, userInput, language, isActive }) => {
        const textGraphemes = React.useMemo(() => splitGraphemes(word, language), [word, language]);
        const inputGraphemes = React.useMemo(() => splitGraphemes(userInput, language), [userInput, language]);
        const wordRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (isActive && wordRef.current) {
                wordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, [isActive]);

        return (
            <div ref={wordRef} className="bg-slate-700/50 rounded-md px-1 py-0.5 relative">
                {textGraphemes.map((char, index) => {
                    let state: 'correct' | 'incorrect' | 'pending' = 'pending';
                    if (index < inputGraphemes.length) {
                        state = char === inputGraphemes[index] ? 'correct' : 'incorrect';
                    }
                    return <Character key={`${char}_${index}`} char={char} state={state} />;
                })}
                <span className="relative">
                    {inputGraphemes.length <= textGraphemes.length && <Caret />}
                </span>
                {/* Show extra typed characters in red */}
                 {inputGraphemes.slice(textGraphemes.length).map((char, index) => (
                    <Character key={`extra_${index}`} char={char} state="incorrect" />
                ))}
            </div>
        );
    };

const CompletedWord: React.FC<{ word: string, status: 'correct' | 'incorrect' }> =
    ({ word, status }) => {
        const color = status === 'correct' ? 'text-slate-400' : 'text-red-400 line-through';
        return <span className={color}>{word}</span>;
    };


const TextDisplay: React.FC<TextDisplayProps> = ({ words, completedWords, currentWordIndex, userInput, language }) => {
    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl h-40 overflow-hidden relative">
            <div className="text-2xl md:text-3xl leading-loose tracking-wider font-mono flex flex-wrap gap-x-3 gap-y-4" aria-label="Text to type">
                {words.map((word, index) => {
                    if (index < currentWordIndex) {
                        const completed = completedWords[index];
                        return <CompletedWord key={`${word}_${index}`} word={word} status={completed ? completed.status : 'incorrect'} />;
                    }
                    if (index === currentWordIndex) {
                        return <CurrentWord key={`${word}_${index}`} word={word} userInput={userInput} language={language} isActive={true} />;
                    }
                    return <span key={`${word}_${index}`} className="text-slate-500">{word}</span>;
                })}
            </div>
        </div>
    );
};

export default TextDisplay;