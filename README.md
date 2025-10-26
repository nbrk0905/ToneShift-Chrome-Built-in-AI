# ToneShift-Chrome-Built-in-AI
Chrome extension that rewrites text tone using Gemini Nano via Prompt API.
## Problem Statement
Online communication often fails to convey the intended tone — messages may sound too formal, robotic, or rude. Users lack a simple, privacy-preserving way to rewrite text instantly into different tones while browsing.

##  Solution

ToneShift is a Chrome Extension powered by Chrome’s built-in Gemini Nano (Prompt API) that rewrites any selected text on a webpage into your preferred tone — Formal, Friendly, or Casual — with a single click.
It runs entirely on-device, ensuring privacy, instant response, and offline functionality.

##  Features

✍️ Rewrite text in real-time into three tones (Formal, Friendly, Casual)

⚡ Works directly on any webpage (Wikipedia, email drafts, blog editors, etc.)

🔒 100% on-device AI (no cloud calls, no data leaks)

🧠 Uses Chrome’s built-in Gemini Nano (Prompt API)

📋 One-click “Copy to Clipboard” for easy reuse

🌍 Offline and privacy-first rewriting experience

##  Tech Stack

Chrome Extension (Manifest V3)

Prompt API (Gemini Nano) — for tone rewriting

Clipboard API — to copy rewritten text

HTML, CSS, JavaScript

##  How to Use

1.Enable the following Chrome flags in Chrome Canary 128+:

chrome://flags/#prompt-api-for-gemini-nano

chrome://flags/#prompt-api-for-extensions

2.Load the ToneShift folder in chrome://extensions/ → Load Unpacked.

3.Pin ToneShift to the toolbar.

4.Open any webpage and select a paragraph.

5.Choose a tone (Formal / Friendly / Casual).

Rewritten text appears instantly — copy and use anywhere!

🔍 APIs Used

🧠 Prompt API — Chrome’s built-in AI interface to Gemini Nano

📋 Clipboard API — For seamless text copy

⚙️ All inference is local (no server-side model calls)

## License

MIT License

## Watch the live demo here:
👉 YouTube Demo: https://youtu.be/dBmUFzYAkEM
