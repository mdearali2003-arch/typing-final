
import React from 'react';
import type { TestResult } from '../types';
import Icon from './Icon';

interface ResultsProps {
  result: TestResult;
  onRestart: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = 'text-slate-100' }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-3xl font-bold ${className}`}>{value}</p>
    </div>
);

const Results: React.FC<ResultsProps> = ({ result, onRestart }) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">Test Complete!</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="WPM" value={result.wpm} className="text-yellow-400" />
                <StatCard label="Accuracy" value={`${result.accuracy}%`} className="text-green-400" />
                <StatCard label="Keystrokes" value={result.keystrokes} />
                <StatCard label="Time" value={`${result.duration}s`} />
                <StatCard label="Correct Words" value={result.correctWords} className="text-green-400"/>
                <StatCard label="Wrong Words" value={result.wrongWords} className="text-red-400" />
                <StatCard label="Correct Chars" value={result.correctChars} />
                <StatCard label="Total Chars" value={result.totalChars} />
            </div>
            <button
                onClick={onRestart}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
                <Icon name="refresh" className="w-5 h-5" />
                <span>Try Again</span>
            </button>
        </div>
    );
};

export default Results;
