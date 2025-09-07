import { useState, useEffect, useRef, useCallback } from 'react';
import type { TestStatus, Language, TestResult } from '../types';
import { getWords } from '../services/textGenerator';
import { loadHistory, saveHistory, clearHistoryStorage } from '../services/localStorage';
import { splitGraphemes } from '../utils/text';

const WORDS_TO_GENERATE = 50;

const useTypingGame = (initialDuration: number, initialLanguage: Language) => {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [duration, setDuration] = useState<number>(initialDuration);
    const [status, setStatus] = useState<TestStatus>('waiting');
    
    // Word-based state
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState<string>('');
    const [completedWords, setCompletedWords] = useState<{ word: string, status: 'correct' | 'incorrect'}[]>([]);

    const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
    const [finalResult, setFinalResult] = useState<TestResult | null>(null);
    const [history, setHistory] = useState<TestResult[]>(() => loadHistory());
    const [stats, setStats] = useState({
        wpm: 0,
        accuracy: 100,
        keystrokes: 0,
        correctWords: 0,
        wrongWords: 0,
        correctChars: 0,
    });

    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const resetTest = useCallback((lang: Language, dur: number) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setLanguage(lang);
        setDuration(dur);
        setStatus('waiting');
        setWords(getWords(lang, WORDS_TO_GENERATE));
        setCurrentWordIndex(0);
        setCompletedWords([]);
        setUserInput('');
        setTimeLeft(dur);
        setFinalResult(null);
        setStats({ wpm: 0, accuracy: 100, keystrokes: 0, correctWords: 0, wrongWords: 0, correctChars: 0 });
        startTimeRef.current = null;
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        resetTest(initialLanguage, initialDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLanguage, initialDuration]);

    useEffect(() => {
        if (status === 'running' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setStatus('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (status === 'finished') {
             if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, timeLeft]);

    // Infinite scroll words
    useEffect(() => {
        if (currentWordIndex > 0 && currentWordIndex >= words.length - 15) {
            setWords(prev => [...prev, ...getWords(language, WORDS_TO_GENERATE)]);
        }
    }, [currentWordIndex, words.length, language]);
    
    // Calculate stats after each word is completed
    useEffect(() => {
        if (status !== 'running' || completedWords.length === 0) {
            // Reset stats if test is not running
            if (status !== 'running') {
                 setStats(prev => ({ ...prev, wpm: 0, accuracy: 100, correctWords: 0, wrongWords: 0, correctChars: 0}));
            }
            return;
        }

        const timeElapsed = (Date.now() - (startTimeRef.current ?? Date.now())) / 60000; // minutes
        
        const correctWords = completedWords.filter(w => w.status === 'correct').length;
        const wrongWords = completedWords.length - correctWords;

        // A "word" for WPM is 5 chars. We count characters of correct words + 1 for the space.
        const correctChars = completedWords
            .filter(w => w.status === 'correct')
            .reduce((acc, typedWord) => acc + splitGraphemes(typedWord.word, language).length + 1, 0);

        const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
        const accuracy = Math.round((correctWords / completedWords.length) * 100);

        setStats(prev => ({ ...prev, wpm, accuracy, correctWords, wrongWords, correctChars }));

    }, [completedWords, language, status]);

    // Handle test finish
    useEffect(() => {
        if (status === 'finished' && finalResult === null) {
            const timeElapsedInSeconds = duration - timeLeft;
            const totalWords = stats.correctWords + stats.wrongWords;
            const totalChars = completedWords.reduce((acc, cw) => acc + splitGraphemes(cw.word, language).length, 0);

            const result: TestResult = {
                id: Date.now().toString(),
                wpm: stats.wpm,
                accuracy: stats.accuracy,
                correctWords: stats.correctWords,
                wrongWords: stats.wrongWords,
                keystrokes: stats.keystrokes,
                correctChars: stats.correctChars,
                totalChars: totalChars,
                duration: timeElapsedInSeconds,
                date: Date.now(),
                language,
            };
            setFinalResult(result);
            setHistory(prev => {
                const newHistory = [result, ...prev];
                saveHistory(newHistory);
                return newHistory;
            });
        }
    }, [status, duration, timeLeft, language, stats, finalResult, completedWords]);

    const submitWord = () => {
        const typedWord = userInput.trim();
        if (!typedWord) return; // Ignore empty submissions

        const targetWord = words[currentWordIndex];
        const isCorrect = normalizeText(targetWord) === normalizeText(typedWord);

        setCompletedWords(prev => [...prev, { word: typedWord, status: isCorrect ? 'correct' : 'incorrect'}]);
        setCurrentWordIndex(prev => prev + 1);
        setUserInput('');
    };

    const handleUserInputChange = (value: string) => {
        if (status === 'finished') return;

        // Disallow spaces in the input field
        if (value.includes(' ')) {
            return;
        }

        if (status === 'waiting' && value.length > 0) {
            setStatus('running');
            startTimeRef.current = Date.now();
        }
        setUserInput(value);
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (status === 'finished') return;
        
        if (event.key === ' ') {
            event.preventDefault();
            submitWord();
        } else {
            setStats(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
        }
    };
    
    const normalizeText = (text: string): string => {
      return text.normalize('NFC');
    };

    const changeLanguage = (lang: Language) => {
        if (status === 'running') return;
        resetTest(lang, duration);
    };

    const changeDuration = (newDuration: number) => {
        if (status === 'running') return;
        resetTest(language, newDuration);
    };
    
    const clearHistory = () => {
        setHistory([]);
        clearHistoryStorage();
    };

    return {
        status,
        words,
        completedWords,
        currentWordIndex,
        userInput,
        duration, language, timeLeft, stats, finalResult, history,
        inputRef,
        actions: {
            handleUserInputChange,
            handleKeyDown,
            resetTest: () => resetTest(language, duration),
            changeLanguage,
            changeDuration,
            clearHistory,
        },
    };
};

export default useTypingGame;