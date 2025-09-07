/**
 * Unicode-safe text processing utilities.
 */

// Fix: Add type declarations for Intl.Segmenter to fix TypeScript errors in environments
// where these types are not included in the default TS lib configuration.
declare namespace Intl {
    interface SegmenterOptions {
        granularity?: 'grapheme' | 'word' | 'sentence';
        localeMatcher?: 'lookup' | 'best fit';
    }

    interface Segment {
        segment: string;
        index: number;
        isWordLike?: boolean;
    }
    
    interface Segments extends Iterable<Segment> {
        containing(codeUnitIndex?: number): Segment | undefined;
    }

    class Segmenter {
        constructor(locales?: string | string[], options?: SegmenterOptions);
        segment(input: string): Segments;
    }
}

// Cache for language-specific segmenters.
const segmenters: { [key in 'en' | 'bn']?: Intl.Segmenter } = {};

function getSegmenter(lang: 'en' | 'bn'): Intl.Segmenter | null {
    if (typeof Intl?.Segmenter !== 'function') {
        return null;
    }
    if (!segmenters[lang]) {
        try {
            // While 'locale' is not strictly used for grapheme segmentation, we respect
            // the language parameter for correctness and future-proofing.
            segmenters[lang] = new Intl.Segmenter(lang, { granularity: 'grapheme' });
        } catch (e) {
            console.error(`Failed to create Intl.Segmenter for locale: ${lang}`, e);
            return null;
        }
    }
    return segmenters[lang] ?? null;
}

/**
 * Splits a string into an array of its grapheme clusters, providing a Unicode-safe
 * way to iterate over user-perceived "characters". It uses a language-specific
 * Intl.Segmenter and falls back to Array.from if the API is not available.
 * @param text The string to split.
 * @param lang The language of the text.
 * @returns An array of graphemes.
 */
export const splitGraphemes = (text: string, lang: 'en' | 'bn' = 'en'): string[] => {
    const segmenter = getSegmenter(lang);
    if (segmenter) {
        return Array.from(segmenter.segment(text)).map(s => s.segment);
    }
    // Fallback for environments without Intl.Segmenter
    return Array.from(text);
};

/**
 * Normalizes a string to its NFC form and trims leading/trailing whitespace.
 * This is crucial for ensuring that characters that can be represented in multiple
 * ways are treated as equivalent during comparisons.
 * @param text The string to normalize.
 * @returns The trimmed and normalized string.
 */
export const normalizeText = (text: string): string => {
    return text.trim().normalize('NFC');
};
