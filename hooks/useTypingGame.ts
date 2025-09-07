import { useState, useEffect, useCallback, useRef } from 'react';
import { getSentence } from '../services/textGenerator';
import { loadHistory, saveHistory } from '../services/localStorage';
import { splitGraphemes, normalizeText } from '../utils/text';
import type { TestStatus, TestResult, Language } from '../types';

const useTypingGame = (initialDuration: number = 60, initialLanguage: Language = 'en') => {
    const [duration, setDuration] = useState<number>(initialDuration);
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [status, setStatus] = useState<TestStatus>('waiting');
    
    // IME composition state
    const [isComposing, setIsComposing] = useState<boolean>(false);

    // Current sentence state
    const [textToType, setTextToType] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    
    // Timer
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const timerInterval = useRef<number | null>(null);

    // Cumulative stats for the entire session
    const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
    const [totalCorrectWords, setTotalCorrectWords] = useState<number>(0);
    const [totalWrongWords, setTotalWrongWords] = useState<number>(0);
    const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
    const [totalCorrectChars, setTotalCorrectChars] = useState<number>(0);
    
    const [history, setHistory] = useState<TestResult[]>([]);
    
    // Function to process a completed sentence and update cumulative stats
    const processCompletedSentence = useCallback(() => {
        const normalizedSource = normalizeText(textToType);
        const normalizedInput = normalizeText(userInput);

        const sourceWords = normalizedSource.split(/\s+/).filter(Boolean);
        const typedWords = normalizedInput.split(/\s+/).filter(Boolean);

        let correctInSentence = 0;
        let wrongInSentence = 0;

        sourceWords.forEach((sourceWord, index) => {
            if (index < typedWords.length) {
                if (typedWords[index] === sourceWord) {
                    correctInSentence++;
                } else {
                    wrongInSentence++;
                }
            }
        });
        
        setTotalCorrectWords(prev => prev + correctInSentence);
        setTotalWrongWords(prev => prev + wrongInSentence);

        // Unicode-safe grapheme counting and comparison, now language-aware
        const sourceGraphemes = splitGraphemes(normalizedSource, language);
        const typedGraphemes = splitGraphemes(normalizedInput, language);

        let correctCharsInSentence = 0;
        typedGraphemes.forEach((char, index) => {
            if (index < sourceGraphemes.length && char === sourceGraphemes[index]) {
                correctCharsInSentence++;
            }
        });
        
        setTotalTypedChars(prev => prev + typedGraphemes.length);
        setTotalCorrectChars(prev => prev + correctCharsInSentence);

        // Load new sentence and reset input
        setTextToType(getSentence(language, textToType));
        setUserInput('');
    }, [userInput, textToType, language]);


    const resetTest = useCallback((newDuration?: number, newLanguage?: Language) => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
        }
        const selectedDuration = newDuration ?? duration;
        const selectedLanguage = newLanguage ?? language;

        setStatus('waiting');
        setTextToType(getSentence(selectedLanguage));
        setUserInput('');
        
        setTotalKeystrokes(0);
        setTotalCorrectWords(0);
        setTotalWrongWords(0);
        setTotalTypedChars(0);
        setTotalCorrectChars(0);
        
        setDuration(selectedDuration);
        setTimeLeft(selectedDuration);
        if (newLanguage) setLanguage(newLanguage);
    }, [duration, language]);
    
    useEffect(() => {
        setHistory(loadHistory());
        resetTest(duration, language);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (status === 'running' && timeLeft > 0) {
            timerInterval.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000) as unknown as number;
        } else if (timeLeft <= 0 && status === 'running') {
            if (timerInterval.current) clearInterval(timerInterval.current);
            setStatus('finished');
        }
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, [status, timeLeft]);
    
    useEffect(() => {
        if (status === 'finished') {
             // Use totalCorrectChars for WPM as it's a better measure of effective speed
             const finalWPM = (totalCorrectChars / 5) / (duration / 60);
             const finalAccuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 0;
            
             const newResult: TestResult = {
                 id: Date.now().toString(),
                 wpm: Math.round(finalWPM) || 0,
                 accuracy: Math.round(finalAccuracy),
                 correctWords: totalCorrectWords,
                 wrongWords: totalWrongWords,
                 keystrokes: totalKeystrokes,
                 correctChars: totalCorrectChars,
                 totalChars: totalTypedChars,
                 duration,
                 date: Date.now(),
                 language,
             };
            
             const updatedHistory = [newResult, ...history].slice(0, 10);
             setHistory(updatedHistory);
             saveHistory(updatedHistory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (status !== 'running' && status !== 'waiting') return;
        
        // Exclude modifier keys from keystroke count
        if (['Control', 'Alt', 'Shift', 'Meta', 'CapsLock', 'Tab'].includes(event.key)) {
            return;
        }

        setTotalKeystrokes(k => k + 1);

        if (event.key === 'Enter') {
            event.preventDefault();
            if (status === 'running' && userInput.trim().length > 0) {
                processCompletedSentence();
            }
        }
    };

    const handleUserInputChange = (value: string) => {
        if (status === 'finished') return;

        // Start the timer on the very first valid input if test is waiting
        if (status === 'waiting' && value.length > 0 && !isComposing) {
            setStatus('running');
        }

        if (status === 'running' || status === 'waiting') {
            setUserInput(value);
            // Auto-submit sentence if typed grapheme count matches/exceeds source, only when not composing
            const sourceGraphemes = splitGraphemes(textToType, language);
            const typedGraphemes = splitGraphemes(value, language);

            if (!isComposing && typedGraphemes.length >= sourceGraphemes.length) {
                processCompletedSentence();
            }
        }
    };

    const changeDuration = (newDuration: number) => {
        resetTest(newDuration, language);
    };

    const changeLanguage = (newLanguage: Language) => {
        resetTest(duration, newLanguage);
    };
    
    const elapsedSeconds = duration - timeLeft;
    const wpm = elapsedSeconds > 0 ? (totalCorrectChars / 5) / (elapsedSeconds / 60) : 0;
    const accuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 100;

    return {
        status,
        textToType,
        userInput,
        duration,
        language,
        timeLeft,
        isComposing,
        stats: {
            wpm: Math.round(wpm) || 0,
            accuracy: Math.round(accuracy),
            keystrokes: totalKeystrokes,
            correctWords: totalCorrectWords,
            wrongWords: totalWrongWords,
        },
        finalResult: status === 'finished' ? history[0] : null,
        history,
        actions: {
            handleUserInputChange,
            handleKeyDown,
            resetTest,
            changeDuration,
            changeLanguage,
            setIsComposing,
            clearHistory: () => {
                setHistory([]);
                saveHistory([]);
            }
        }
    };
};

export default useTypingGame;