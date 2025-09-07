
# SwiftType - Bilingual Typing Practice

SwiftType is a clean, minimal, and responsive web application designed to help you test and improve your typing speed and accuracy in both **English** and **Bangla**.

This project is built with React, TypeScript, and Tailwind CSS, focusing on a smooth user experience and detailed performance feedback.

## Features

- **Bilingual Support**: Easily switch between English and Bangla typing tests.
- **Automatic Timer**: The timer starts automatically on your first keystroke—no "Start" button needed.
- **Customizable Duration**: Choose from 1, 3, or 5-minute test sessions.
- **Real-time Feedback**: Get instant metrics on your performance as you type.
- **Detailed Results**: After each test, view a comprehensive summary of your performance.
- **Session History**: Your last 10 results are automatically saved to your browser's localStorage for review.
- **Robust Unicode Support**: Correctly handles complex scripts like Bangla for accurate character counting and rendering.
- **Responsive Design**: Practice on any device, be it desktop, tablet, or mobile.
- **No Repetition**: The app ensures you get a new, random sentence for every test, without immediate repeats.

## How Statistics Are Calculated

The application provides several metrics to track your typing performance. Here’s how each is calculated:

### 1. WPM (Words Per Minute)

WPM is a measure of your typing speed. In this application, a "word" is standardized to be **5 characters long** (including spaces and punctuation). This is a common convention in typing tests to ensure fairness regardless of the actual words typed. The calculation is based on correctly typed characters to better reflect effective speed.

- **Formula**: `(Total Correct Characters / 5) / (Elapsed Time in Minutes)`
- **Example**: If you type 250 characters correctly in 1 minute, your WPM is (250 / 5) / 1 = 50 WPM.

### 2. Accuracy

Accuracy measures how many characters you typed correctly compared to the total number of characters you typed.

- **Formula**: `(Correct Characters / Total Characters Typed) * 100`
- **Example**: If you typed 100 characters and 95 of them were correct, your accuracy is (95 / 100) * 100 = 95%.

### 3. Keystrokes

This is a simple count of every key you press while the test is active. It includes all character keys, as well as keys like Backspace and Spacebar, but excludes modifier-only keys like Shift, Ctrl, and Alt.

- **Calculation**: A counter increments for every `keydown` event on the typing input area, excluding specific modifier keys.

### 4. Correct Words

This metric counts the number of words you typed that perfectly match the words in the source text. A word is evaluated when you press the spacebar or Enter key.

- **Calculation**: When a word is submitted, it is compared to the corresponding word in the source text. If it's an exact match (after Unicode normalization), the "Correct Words" count increases.

### 5. Wrong Words

This is the count of words that do not match the source text. Like correct words, this is evaluated upon submission.

- **Calculation**: If the typed word does not match the source word, the "Wrong Words" count increases.

---

## Handling Complex Scripts (like Bangla)

Supporting languages with complex scripts like Bangla requires more than simple string manipulation. This application implements several modern web standards to ensure correctness.

### 1. Grapheme Splitting with `Intl.Segmenter`

A simple `string.split('')` is unreliable for many languages. For example, in Bangla, the character "ক্ষ" is composed of multiple Unicode code points but is a single visual unit (a grapheme). `split('')` would incorrectly break it into its constituent parts.

To solve this, we use the `Intl.Segmenter` API with `{ granularity: 'grapheme' }`. This correctly splits strings into user-perceived characters, ensuring that our character counting, highlighting, and accuracy calculations are correct. A fallback to `Array.from(text)` is used for older browsers that may not support `Intl.Segmenter`.

### 2. Unicode Normalization (`NFC`)

Some characters can be represented by different sequences of Unicode code points. For example, `é` can be a single code point or a combination of `e` and `´`. To ensure that user input is compared accurately against the target text, both strings are first normalized to their Canonical Composition form (`'NFC'`) using `string.normalize('NFC')`. This makes comparisons reliable.

### 3. IME Composition Events

When users type with an Input Method Editor (IME) like Avro Keyboard for Bangla, characters are "composed" before being committed to the input field. We use the `onCompositionStart` and `onCompositionEnd` events to track this state. This prevents the app from marking characters as incorrect while they are still being composed, providing a much smoother and more accurate typing experience.

This project was built to be a simple, yet effective tool for improving typing skills. Happy typing!
