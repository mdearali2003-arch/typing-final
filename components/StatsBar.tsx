import React from 'react';

interface StatsBarProps {
    wpm: number;
    accuracy: number;
    keystrokes: number;
    correctWords: number;
    wrongWords: number;
    timeLeft: number;
}

const StatItem: React.FC<{ label: string; value: string | number; colorClass?: string }> = ({ label, value, colorClass = 'text-white' }) => (
    <div className="flex flex-col items-center justify-center p-2">
        <span className="text-base font-medium text-slate-400">{label}</span>
        <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
    </div>
);

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const StatsBar: React.FC<StatsBarProps> = ({ wpm, accuracy, keystrokes, correctWords, wrongWords, timeLeft }) => {
    return (
        <div className="w-full bg-slate-800 p-2 rounded-xl shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
                <StatItem label="WPM" value={wpm} colorClass="text-yellow-400" />
                <StatItem label="Accuracy" value={`${accuracy}%`} colorClass="text-green-400" />
                <StatItem label="Keystrokes" value={keystrokes} />
                <StatItem label="Correct" value={correctWords} colorClass="text-green-400" />
                <StatItem label="Wrong" value={wrongWords} colorClass="text-red-400" />
                <StatItem label="Time" value={formatTime(timeLeft)} />
            </div>
        </div>
    );
};

export default StatsBar;