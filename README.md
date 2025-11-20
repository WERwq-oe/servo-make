# Servo Make - Survey Creation Platform

A modern, feature-rich survey creation platform built with React and Vite. Create beautiful surveys with rich text formatting, preview them before publishing, and collect responses with Firebase.

## ✨ Features

- **Rich Text Formatting** - Bold, italic, and underline text in question titles
- **Live Preview** - See exactly how your survey will look before publishing
- **Multiple Question Types**
  - Multiple Choice
  - Text Input
  - True/False
  - Fill in the Blank
  - Table/Matrix
- **Real-time Publishing** - Surveys are instantly shareable via unique URLs
- **Response Collection** - Powered by Firebase Firestore
- **Beautiful UI** - Modern design with smooth animations
- **GitHub Pages Ready** - Automated deployment workflow included

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Firebase account (for data storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/WERwq-oe/servo-make.git
cd servo-make

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running.

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase config to `src/firebase.js`
4. Update Firestore security rules to allow read/write access

## 📦 Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### GitHub Pages (Recommended)

This project includes automated GitHub Pages deployment:

1. Go to your repository Settings → Pages
2. Under "Source", select **GitHub Actions**
3. Push to the `main3` branch
4. Your site will be live at `https://WERwq-oe.github.io/servo-make/`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Alternative Hosting

- **Netlify**: Connect your repo and deploy automatically
- **Vercel**: Import project and deploy with one click
- **Firebase Hosting**: Use `firebase deploy`

## 🎨 Usage

### Creating a Survey

1. Click the **Create** button
2. Add questions using the floating toolbar
3. Format question titles with bold, italic, or underline
4. Click **Preview** to see how it looks
5. Click **Publish** to generate a shareable link

### Sharing Surveys

After publishing, you'll get a unique URL like:
```
https://WERwq-oe.github.io/servo-make/#/survey/abc123
```

Share this link with respondents to collect responses.

### Viewing Results

Navigate to the Results page to see all responses for your surveys.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Routing**: React Router DOM (Hash Router)
- **Backend**: Firebase Firestore
- **Icons**: Lucide React
- **Deployment**: GitHub Actions + GitHub Pages

## 📁 Project Structure

```
servo-make/
├── src/
│   ├── components/
│   │   ├── editor/          # Survey editor components
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   └── Toolbar.jsx
│   │   └── PreviewModal.jsx
│   ├── pages/
│   │   ├── Create.jsx       # Survey creation page
│   │   ├── Survey.jsx       # Live survey page
│   │   └── Results.jsx      # Results viewing page
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Firebase services
│   └── firebase.js          # Firebase configuration
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
└── DEPLOYMENT.md            # Deployment guide
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by modern design principles
- Icons from [Lucide](https://lucide.dev/)

---

**Live Demo**: https://WERwq-oe.github.io/servo-make/

**Repository**: https://github.com/WERwq-oe/servo-make
