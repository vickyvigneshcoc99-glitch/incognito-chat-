# 🌐 Incognito Chat: The Secure Enclave

![Incognito Chat Banner](https://raw.githubusercontent.com/vickyvigneshcoc99-glitch/incognito-chat-/main/public/banner.png)

> **"Where shadows speak and logs vanish."**

**Incognito Chat** is a high-performance, real-time communication platform designed with a cyberpunk aesthetic and a focus on ephemeral, secure interactions. Built with **Next.js 15**, **Tailwind CSS 4**, and **Firebase**, it provides a seamless "enclave" for users to sync and share without persistent footprints.

---

## ✨ Key Features

- ⚡ **Real-time Synchronization**: Powered by Firebase Realtime Database for sub-millisecond message delivery.
- 🔐 **Enclave Protocol**: Room-based communication. Create or join private enclaves with unique access keys.
- 🕶️ **True Incognito**: No registration, no databases of users, no persistent logs. Just pure, sessions-based interaction.
- 🎨 **Rich Cyberpunk UI**: A premium dark-mode interface featuring Glassmorphism, smooth Framer Motion transitions, and emerald-hued accents.
- 📡 **Node Presence**: Real-time tracking of active "nodes" (users) within your enclave.
- ✍️ **Synapse Indicators**: Live typing awareness to make the digital space feel alive.
- 🎭 **Reaction Matrix**: Integrated emoji reactions for quick, expressive feedback.
- 🚀 **Invite Protocol**: Generate instant invite links to bring peers into your secure channel.
- 🧹 **Purge Command**: Reset the enclave history instantly when the mission is accomplished.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Firebase Realtime Database](https://firebase.google.com/docs/database) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vickyvigneshcoc99-glitch/incognito-chat-.git
cd incognito-chat-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Launch the Enclave
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to begin the sync process.

---

## 📂 Project Structure

```bash
src/
├── app/             # Next.js App Router & Global Styles
├── components/      # React Components (Chat, Landing, Goodbye)
│   └── ui/          # Reusable UI primitives (Buttons, Inputs, etc.)
├── lib/             # Firebase configuration & Utilities
└── public/          # Static assets & Icons
```

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ by <a href="https://github.com/vickyvigneshcoc99-glitch">Vicky Vignesh</a>
</p>
