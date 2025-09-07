
import type { TestResult } from '../types';

const HISTORY_KEY = 'typingTestHistory';

export const loadHistory = (): TestResult[] => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
            return JSON.parse(storedHistory);
        }
    } catch (error) {
        console.error("Failed to load history from localStorage:", error);
    }
    return [];
};

export const saveHistory = (history: TestResult[]): void => {
    try {
        const historyToStore = JSON.stringify(history);
        localStorage.setItem(HISTORY_KEY, historyToStore);
    } catch (error) {
        console.error("Failed to save history to localStorage:", error);
    }
};

export const clearHistoryStorage = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage:", error);
    }
};
