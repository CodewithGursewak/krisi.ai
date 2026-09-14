# Smart Krishi Voice & Vision

Enhance the "Smart Krishi AI Assistant" web app with advanced interaction features.

🎯 Core Upgrade:

The chat assistant must support:

1. Multilingual communication (Hindi + English)

2. Voice input and voice output

3. Camera/image input for crop disease detection

---

🌐 1. Multilingual AI (Hindi + English)

- Detect user language automatically (Hindi or English)

- Respond in the same language as the user

- Allow manual language toggle (Hindi / English button)

- Use simple, farmer-friendly language (no technical jargon)

Example:

User: "गेहूं के लिए खाद क्या डालें?"

AI: Respond in Hindi

User: "Best fertilizer for wheat?"

AI: Respond in English

---

🎤 2. Voice Input & Output

Voice Input:

- Add mic button inside chat input

- Use Web Speech API (SpeechRecognition)

- Convert speech → text automatically

- Support Hindi + English speech

Voice Output:

- Add speaker button on each AI message

- Use SpeechSynthesis API

- AI response should be read aloud

- Language should match response language

---

📷 3. Camera & Image Upload (Disease Detection)

- Add camera icon in input box

- Options:

   - Upload image

   - Capture from camera

- After image upload:

   - Show preview

   - Send to backend API (/disease-detect)

Backend:

- Return:

   - Disease name

   - Confidence %

   - Treatment suggestions

Frontend:

- Display result in chat bubble format

---

⚙️ Technical Requirements:

Frontend:

- React + Tailwind CSS

- Use:

  - Web Speech API (voice)

  - getUserMedia (camera)

- Clean UI with icons:

  - 🎤 Mic

  - 🔊 Speaker

  - 📷 Camera

Backend:

- Node.js + Express

- API Routes:

  - /chat (AI response)

  - /voice (optional processing)

  - /disease-detect (image processing)

---

✨ UX Enhancements:

- Show "Listening..." when mic is active

- Show "Speaking..." when AI voice is playing

- Add waveform animation while recording

- Show image preview before sending

- Add error handling:

  - "Mic not supported"

  - "Camera permission denied"

---

🎯 Output Required:

- Fully working UI with voice + camera buttons

- Functional multilingual chatbot

- Backend APIs connected

- Clean, production-ready code

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b54e93bb-840c-43a2-88ca-bde88fb86fdd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
