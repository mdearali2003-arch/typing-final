import React, { useState } from 'react';
import useTypingGame from './hooks/useTypingGame';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TextDisplay from './components/TextDisplay';
import TypingArea from './components/TypingArea';
import Results from './components/Results';
import History from './components/History';

const App: React.FC = () => {
    const { status, textToType, userInput, duration, language, timeLeft, stats, finalResult, history, actions } = useTypingGame(60, 'en');
    const [showHistory, setShowHistory] = useState(false);

    const isTestActive = status === 'running' || status === 'waiting';

    return (
        <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
            <main className="w-full max-w-4xl mx-auto flex flex-col gap-4">
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
                     <>
                        {/* Only show stats bar when test is actually running */}
                        {status === 'running' && <StatsBar {...stats} timeLeft={timeLeft} />}
                        
                        <TextDisplay 
                            textToType={textToType} 
                            userInput={userInput} 
                            language={language}
                        />
                        
                        <TypingArea
                            userInput={userInput}
                            onInputChange={actions.handleUserInputChange}
                            onKeyDown={actions.handleKeyDown}
                            onCompositionChange={actions.setIsComposing}
                            status={status}
                            textToType={textToType}
                        />

                        {status === 'waiting' && (
                             <p className="text-center text-slate-400 mt-4">
                                Press Enter after each sentence to get the next one.
                            </p>
                        )}
                    </>
                )}
                
                {showHistory && (
                    <div className="mt-8">
                        <History history={history} onClear={actions.clearHistory} />
                    </div>
                )}
            </main>
            <footer className="text-center text-slate-500 mt-8 text-sm">
                <p>A "word" is 5 characters. The timer will start on your first keystroke. Test ends when the timer runs out.</p>
            </footer>
        </div>
    );
};

export default App;
