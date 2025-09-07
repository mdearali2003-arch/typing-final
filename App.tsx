import React, { useState } from 'react';
import useTypingGame from './hooks/useTypingGame';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TextDisplay from './components/TextDisplay';
import TypingArea from './components/TypingArea';
import Results from './components/Results';
import History from './components/History';

const App: React.FC = () => {
    const { 
        status, words, completedWords, currentWordIndex, userInput,
        duration, language, timeLeft, stats, finalResult, history,
        inputRef, actions 
    } = useTypingGame(60, 'en');
    
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-10">
            <main className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
                <Header 
                    language={language}
                    onLanguageChange={actions.changeLanguage}
                    duration={duration}
                    onDurationChange={actions.changeDuration}
                    onHistoryToggle={() => setShowHistory(prev => !prev)}
                    isTestRunning={status === 'running'}
                />

                {status === 'finished' && finalResult ? (
                    <Results result={finalResult} onRestart={() => actions.resetTest()} />
                ) : (
                     <div className="flex flex-col gap-6 md:gap-8">
                        {/* Only show stats bar when test is actually running */}
                        {(status === 'running' || completedWords.length > 0) && <StatsBar {...stats} timeLeft={timeLeft} />}
                        
                        <TextDisplay 
                            words={words}
                            completedWords={completedWords}
                            currentWordIndex={currentWordIndex}
                            userInput={userInput}
                            language={language}
                        />
                        
                        <TypingArea
                            userInput={userInput}
                            onInputChange={actions.handleUserInputChange}
                            onKeyDown={actions.handleKeyDown}
                            status={status}
                            inputRef={inputRef}
                        />
                    </div>
                )}
                
                {showHistory && (
                    <div className="mt-8">
                        <History history={history} onClear={actions.clearHistory} />
                    </div>
                )}
            </main>
            <footer className="text-center text-slate-500 mt-auto pt-8 pb-4 text-sm">
                <p>WPM is calculated based on (correct characters / 5) / minutes. Timer starts on your first keystroke.</p>
            </footer>
        </div>
    );
};

export default App;