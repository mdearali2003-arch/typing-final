import React from 'react';
import type { Language } from '../types';
import Icon from './Icon';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
    duration: number;
    onDurationChange: (duration: number) => void;
    onHistoryToggle: () => void;
    isTestRunning: boolean;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, duration, onDurationChange, onHistoryToggle, isTestRunning }) => {
    const timeOptions = [60, 180, 300]; // 1, 3, 5 minutes
    const langOptions: { id: Language, label: string }[] = [{id: 'en', label: 'English'}, {id: 'bn', label: 'Bangla'}];

    return (
        <header className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
                 <h1 className="text-4xl font-bold text-white tracking-wide">
                    SwiftType
                </h1>
                <button
                    onClick={onHistoryToggle}
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Toggle session history"
                >
                    <Icon name="history" className="w-6 h-6" />
                </button>
            </div>
           
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
                    {langOptions.map(lang => (
                         <button
                            key={lang.id}
                            onClick={() => onLanguageChange(lang.id)}
                            disabled={isTestRunning}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                                language === lang.id
                                    ? 'bg-yellow-400 text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
                 <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
                    {timeOptions.map(time => (
                        <button
                            key={time}
                            onClick={() => onDurationChange(time)}
                            disabled={isTestRunning}
                            className={`w-12 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                                duration === time
                                    ? 'bg-yellow-400 text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {time / 60}m
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;