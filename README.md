# SwiftType - Bilingual Typing Practice

SwiftType is a clean, minimal, and responsive web application designed to help you test and improve your typing speed and accuracy in both **English** and **Bangla** through a continuous, word-based challenge.

This project is built with React, TypeScript, and Tailwind CSS, focusing on a smooth user experience and detailed performance feedback.

## Features

- **Endless Word Mode**: Instead of sentences, you are presented with an infinite stream of random words.
- **Bilingual Support**: Easily switch between English and Bangla typing tests.
- **Automatic Timer**: The timer starts automatically on your first keystroke.
- **Customizable Duration**: Choose from 1, 3, or 5-minute test sessions.
- **Real-time Feedback**: Get instant metrics on your performance as you type. Each word is evaluated the moment you press the spacebar.
- **Detailed Results**: After each test, view a comprehensive summary of your performance.
- **Session History**: Your results are automatically saved to your browser's localStorage for review.
- **Smart Scrolling**: The display automatically scrolls to keep the current word in focus.
- **Responsive Design**: Practice on any device, be it desktop, tablet, or mobile.


## How Statistics Are Calculated

The application provides several metrics to track your typing performance in the endless word mode.

### 1. WPM (Words Per Minute)

WPM is a measure of your typing speed. It is calculated based on the industry standard where one "word" is equivalent to 5 characters (including the space that follows a word). This calculation only considers words you have typed correctly.

- **Formula**: `(Total Characters in Correctly Typed Words / 5) / (Elapsed Time in Minutes)`
- **Example**: If you correctly type "hello" and "world" (11 characters including spaces) in 12 seconds (0.2 minutes), your WPM would be (11 / 5) / 0.2 = 11 WPM.

### 2. Accuracy

Accuracy measures how many words you typed correctly out of the total number of words you attempted.

- **Formula**: `(Correct Words / Total Words Typed) * 100`
- **Example**: If you typed 20 words and 18 of them were correct, your accuracy is (18 / 20) * 100 = 90%.

### 3. Keystrokes

This is a simple count of every key you press while the test is active. It includes all character keys as well as Backspace and Spacebar.

- **Calculation**: A counter increments for every `keydown` event on the typing input area.

### 4. Correct / Wrong Words

These metrics are a direct count of how many words you typed correctly or incorrectly. A word is evaluated as soon as you press the spacebar.

- **Calculation**: When you press space, your typed word is compared to the target word. The respective counter is incremented based on the result.

---

## Handling Complex Scripts (like Bangla)

Supporting languages with complex scripts like Bangla requires more than simple string manipulation. This application implements several modern web standards to ensure correctness.

### 1. Grapheme Splitting with `Intl.Segmenter`

A simple `string.split('')` is unreliable for many languages. For example, in Bangla, the character "ক্ষ" is composed of multiple Unicode code points but is a single visual unit (a grapheme). `split('')` would incorrectly break it into its constituent parts.

To solve this, we use the `Intl.Segmenter` API with `{ granularity: 'grapheme' }`. This correctly splits strings into user-perceived characters, ensuring that our character counting and highlighting are correct.

### 2. Unicode Normalization (`NFC`)

Some characters can be represented by different sequences of Unicode code points. To ensure that user input is compared accurately against the target text, both strings are first normalized to their Canonical Composition form (`'NFC'`) using `string.normalize('NFC')`. This makes comparisons reliable.

This project was built to be a simple, yet effective tool for improving typing skills. Happy typing!