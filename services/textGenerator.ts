import type { Language } from '../types';

// A list of common English words, shuffled for randomness.
const ENGLISH_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "person", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
    "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
    "most", "us", "people", "money", "service", "find", "is", "man", "thing", "friend", "father", "power", "hour", "game", "line", "end", "member", "law",

    "car", "city", "community", "name", "president", "team", "minute", "idea", "kid", "body", "information", "parent", "face", "others", "level", "office", "door",
    "health", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force",
    "education", "foot", "boy", "age", "policy", "process", "music", "market", "sense", "nation", "plan", "college", "interest", "death", "experience", "effect",
    "use", "class", "control", "care", "field", "development", "role", "effort", "rate", "heart", "drug", "show", "leader", "light", "voice", "wife", "whole",
    "police", "mind", "finally", "return", "free", "military", "price", "report", "less", "according", "decision", "leave", "family", "long", "call", "water",
    "want", "develop", "government", "kill", "book", "system", "hold", "run", "move", "company", "provide", "program", "work", "form", "problem", "lead",
    "country", "begin", "help", "talk", "start", "play", "need", "stand", "include", "course", "house", "report", "group", "case", "woman", "around", "try",
    "situation", "part", "about", "word", "fact", "month", "lot", "right", "study", "business", "issue", "side", "kind", "head", "far", "black", "long", "both",
    "little", "house", "yes", "since", "provide", "service", "around", "friend", "important", "father", "sit", "away", "until", "power", "hour", "game", "often",
    "yet", "line", "political", "end", "among", "ever", "stand", "bad", "lose", "however", "member", "pay", "law", "meet", "car", "city", "almost", "include",
    "continue", "set", "later", "community", "much", "name", "five", "once", "white", "least", "president", "learn", "real", "change", "team", "minute", "best"
];

// A list of common Bangla words.
const BANGLA_WORDS = [
    "আমি", "তুমি", "সে", "আমরা", "তোমরা", "তারা", "এবং", "ও", "কিন্তু", "অথবা", "জন্য", "সাথে", "মধ্যে", "থেকে", "উপরে", "নিচে",
    "একটি", "অনেক", "কিছু", "সব", "কে", "কি", "কোথায়", "কখন", "কেন", "কিভাবে", "এই", "ওই", "যে", "তা", "এখানে", "ওখানে",
    "আজ", "কাল", "দিন", "রাত", "সকাল", "বিকাল", "সন্ধ্যা", "বছর", "মাস", "সপ্তাহ", "সময়", "মানুষ", "ছেলে", "মেয়ে", "বাবা", "মা",
    "ভাই", "বোন", "বন্ধু", "ঘর", "বাড়ি", "রাস্তা", "শহর", "গ্রাম", "দেশ", "পৃথিবী", "জল", "পানি", "বাতাস", "আগুন", "মাটি", "আকাশ",
    "সূর্য", "চাঁদ", "তারা", "ফুল", "ফল", "গাছ", "পশু", "পাখি", "মাছ", "ভাত", "ডাল", "তরকারি", "খাবার", "কাজ", "লেখা", "পড়া",
    "বলা", "শোনা", "দেখা", "চলা", "বসা", "দাঁড়ানো", "ঘুমানো", "খাওয়া", "করা", "যাওয়া", "আসা", "নেওয়া", "দেওয়া", "জানা", "বোঝা",
    "ভাল", "খারাপ", "সুন্দর", "বড়", "ছোট", "নতুন", "পুরাতন", "সাদা", "কালো", "লাল", "সবুজ", "নীল", "হলুদ", "এক", "দুই", "তিন",
    "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ", "অনেক", "কম", "বেশি", "দ্রুত", "আস্তে", "সহজ", "কঠিন", "ভাষা", "শব্দ",
    "বাক্য", "গল্প", "কবিতা", "গান", "ছবি", "আমার", "তোমার", "তার", "আমাদের", "তোমাদের", "তাদের", " স্কুল", "কলেজ", "বিশ্ববিদ্যালয়",
    "হাসপাতাল", "দোকান", "বাজার", "অফিস", "নদী", "সাগর", "পাহাড়", "বন", "বৃষ্টি", "মেঘ", "বিদ্যুৎ", "আলো", "অন্ধকার", "প্রশ্ন",
    "উত্তর", "শুরু", "শেষ", "জীবন", "মৃত্যু", "প্রেম", "ভালবাসা", "আনন্দ", "দুঃখ", "সুখ", "শান্তি", "যুদ্ধ", "ইতিহাস", "বিজ্ঞান",
    "রাজনীতি", "অর্থনীতি", "সমাজ", "সংস্কৃতি", "ধর্ম", "ঈশ্বর", "ভূত", "ভবিষ্যৎ", "বর্তমান", "সংখ্যা", "গণিত", "রং", "নাম",
    "পরিচয়", "শরীর", "মন", "আত্মা", "জ্ঞান", "শিক্ষা", "স্বাস্থ্য", "সম্পদ", "আইন", "বিচার", "স্বাধীনতা", "অধিকার", "কর্তব্য"
];

const WORDS: Record<Language, string[]> = {
    en: ENGLISH_WORDS,
    bn: BANGLA_WORDS,
};

/**
 * Shuffles an array in place.
 * @param array The array to shuffle.
 */
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Generates a list of random words for the typing test.
 * @param language The desired language ('en' or 'bn').
 * @param count The number of words to generate.
 * @returns An array of random words.
 */
export const getWords = (language: Language, count: number): string[] => {
    const wordPool = WORDS[language];
    const shuffled = shuffleArray([...wordPool]); // Shuffle a copy
    
    // If more words are requested than available, repeat words to meet the count
    let words: string[] = [];
    while (words.length < count) {
        words = words.concat(shuffled.slice(0, Math.min(shuffled.length, count - words.length)));
    }
    
    return words;
};