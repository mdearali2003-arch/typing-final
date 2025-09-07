
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
        <header className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                 <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 tracking-wider">
                    SwiftType
                </h1>
                <button
                    onClick={onHistoryToggle}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                    aria-label="Toggle session history"
                >
                    <Icon name="history" className="w-6 h-6 text-slate-400" />
                </button>
            </div>
           
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 p-1 bg-slate-700 rounded-md">
                    {langOptions.map(lang => (
                         <button
                            key={lang.id}
                            onClick={() => onLanguageChange(lang.id)}
                            disabled={isTestRunning}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                language === lang.id
                                    ? 'bg-yellow-500 text-slate-900'
                                    : 'hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
                 <div className="flex items-center gap-2 p-1 bg-slate-700 rounded-md">
                    {timeOptions.map(time => (
                        <button
                            key={time}
                            onClick={() => onDurationChange(time)}
                            disabled={isTestRunning}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                duration === time
                                    ? 'bg-yellow-500 text-slate-900'
                                    : 'hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
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
