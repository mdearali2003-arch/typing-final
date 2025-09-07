
import type { Language } from '../types';

const ENGLISH_SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump.",
    "The five boxing wizards jump quickly.",
    "Bright vixens jump; dozy fowl quack.",
    "A wizard's job is to vex chumps quickly in fog.",
    "The journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "The only thing we have to fear is fear itself."
];

const BANGLA_SENTENCES = [
    "দ্রুত বাদামী শেয়াল অলস কুকুরটিকে লাফিয়ে পার হয়।",
    "আমার বাক্সে পাঁচ ডজন মদের জগ প্যাক করুন।",
    "কি বিরক্তিকরভাবে দ্রুত নির্বোধ জেব্রা লাফ দেয়।",
    "পাঁচজন বক্সিং জাদুকর দ্রুত লাফ দেয়।",
    "উজ্জ্বল শেয়াল লাফ দেয়; অলস পাখি কোয়াক করে।",
    "একজন জাদুকরের কাজ হল কুয়াশার মধ্যে দ্রুত বোকাদের বিরক্ত করা।",
    "হাজার মাইলের যাত্রা একটি মাত্র পদক্ষেপ দিয়ে শুরু হয়।",
    "থাকা বা না থাকা, এটাই প্রশ্ন।",
    "চকচক করলেই সোনা হয় না।",
    "আমাদের ভয় পাওয়ার একমাত্র জিনিস ভয় নিজেই।"
];

const SENTENCES: Record<Language, string[]> = {
    en: ENGLISH_SENTENCES,
    bn: BANGLA_SENTENCES,
};

export const getSentence = (language: Language, currentSentence: string = ''): string => {
    const sentencePool = SENTENCES[language];
    let newSentence = '';

    if (sentencePool.length === 1) {
        return sentencePool[0];
    }

    do {
        const randomIndex = Math.floor(Math.random() * sentencePool.length);
        newSentence = sentencePool[randomIndex];
    } while (newSentence === currentSentence);

    return newSentence;
};
