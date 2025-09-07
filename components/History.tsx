
import React from 'react';
import type { TestResult } from '../types';

interface HistoryProps {
    history: TestResult[];
    onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onClear }) => {
    if (history.length === 0) {
        return (
            <div className="text-center p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-400">No past results yet. Complete a test to see your history!</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">Session History</h3>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-sm bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                        aria-label="Clear session history"
                    >
                        Clear History
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b-2 border-slate-600 text-slate-400">
                        <tr>
                            <th className="p-2">Date</th>
                            <th className="p-2 text-center">Lang</th>
                            <th className="p-2 text-center">WPM</th>
                            <th className="p-2 text-center">Accuracy</th>
                            <th className="p-2 text-center">Keystrokes</th>
                            <th className="p-2 text-center">Correct Words</th>
                            <th className="p-2 text-center">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((result) => (
                            <tr key={result.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-2">{new Date(result.date).toLocaleString()}</td>
                                <td className="p-2 text-center uppercase">{result.language}</td>
                                <td className="p-2 text-center font-bold text-yellow-400">{result.wpm}</td>
                                <td className="p-2 text-center font-bold text-green-400">{result.accuracy}%</td>
                                <td className="p-2 text-center">{result.keystrokes}</td>
                                <td className="p-2 text-center text-green-400">{result.correctWords}</td>
                                <td className="p-2 text-center">{result.duration}s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
