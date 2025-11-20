# Quick Start Guide - Servo Make

## 🚀 Getting Started

### Prerequisites Checklist
- [ ] Node.js installed
- [ ] Firebase project created
- [ ] Firebase Authentication enabled (Email & Google)
- [ ] Firestore database created

---

## ⚡ 5-Minute Setup

### Step 1: Configure Firebase (CRITICAL)

Open `src/firebase.js` and update with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Where to find these:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon → Project settings
4. Scroll to "Your apps" → Select your web app
5. Copy the config object

### Step 2: Enable Authentication Providers

1. Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google**
4. Add your domain to Authorized domains (for deployment)

### Step 3: Set Up Firestore Rules

1. Firebase Console → Firestore Database
2. Go to "Rules" tab
3. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Surveys: Anyone can read, only owner can modify
    match /surveys/{surveyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                                request.auth.uid == resource.data.userId;
    }
    
    // Responses: Anyone can submit, authenticated users can read
    match /responses/{responseId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

---

## 💻 Running Locally

```bash
# Already installed packages, so just run:
npm run dev
```

Visit `http://localhost:5173`

---

## 🧪 Testing the Features

### 1. Test Authentication System

**Sign Up Test:**
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: (min 6 characters)
   - Phone: (optional)
   - Organization: (optional)
4. Click "Create Account"
5. You should see the Dashboard!

**Google Login Test:**
1. Click "Sign in with Google"
2. Choose your Google account
3. Should redirect to Dashboard

### 2. Test Survey Creation

1. Click "Create" or "Create New Survey"
2. Click a question type button (e.g., "Multiple Choice")
3. Type a question title
4. Select some text and click **Bold** button
5. Add options
6. Click "Preview" to see formatted text
7. Click "Publish"
8. Copy the survey link

### 3. Test Survey Submission

1. Open the survey link in a new tab
2. Fill out the survey
3. Click "Submit Survey"
4. You should see "Thank You!" message

### 4. Test Analytics

1. Go back to Dashboard
2. Click "Analytics" on a survey
3. You should see:
   - Response count
   - Bar charts
   - Pie charts
4. Click "Download PDF"
5. PDF should download with charts!

---

## 🎯 User Workflow Example

### Creating & Sharing a Survey:

```
1. Sign Up/Login
   ↓
2. Click "Create"
   ↓
3. Add Questions (with formatting!)
   ↓
4. Click "Preview" (check formatting)
   ↓
5. Click "Publish"
   ↓
6. Copy & Share Link
   ↓
7. Recipients fill survey
   ↓
8. View Analytics & Charts
   ↓
9. Download PDF Report
```

---

## 🔒 Security Features

✅ **Protected Routes** - Can't create surveys without login
✅ **Owner-Only Analytics** - Only creators see their results
✅ **Firebase Security Rules** - Database-level protection
✅ **Input Validation** - Form validation on signup/login

---

## 📊 Dashboard Features

When you log in, you'll see:

- **Statistics Cards:**
  - Total Surveys
  - Total Responses
  - Active Surveys

- **Survey List** showing:
  - Survey title
  - Number of questions
  - Response count
  - Creation date
  - Quick actions (Analytics, View Survey)

---

## 🎨 Rich Text Formatting

In question titles, you can:
1. Type your text
2. Select text YOU want to format
3. Click formatting buttons:
   - **B** = Bold
   - *I* = Italic
   - <u>U</u> = Underline

The formatting will appear in:
- Preview modal
- Live survey
- Analytics page

---

## 📥 PDF Export

The generated PDF includes:
- Survey title
- Generation date
- Statistics summary
- All response charts (bar & pie)
- Proper pagination
- High-quality images

---

## 🐛 Troubleshooting

### "Failed to login"
- Check Firebase config in `firebase.js`
- Verify Email/Password provider is enabled
- Check console for detailed error

### "Survey not found"
- Make sure Firestore rules are published
- Check if survey ID is correct
- Verify Firestore database exists

### Charts not showing
- Check if there are responses (charts only show with data)
- Verify recharts is installed: `npm list recharts`

### PDF download fails
- Check browser console for errors
- Verify jspdf and html2canvas are installed
- Try on different browser

### "You do not have permission"
- Only survey creator can view analytics
- Make sure you're logged in with the account that created the survey

---

## 🌐 Deployment

### To GitHub Pages:

```bash
git push origin main3
```

Then:
1. Go to repository Settings → Pages
2. Source → "GitHub Actions"
3. Wait for workflow to complete
4. Visit: `https://YOUR_USERNAME.github.io/servo-make/`

**Important:** After deploying, add your GitHub Pages URL to Firebase Authorized Domains:
- Firebase Console → Authentication → Settings
- Authorized domains → Add : `YOUR_USERNAME.github.io`

---

## ✅ Feature Checklist

Before sharing with users:

- [ ] Firebase config updated
- [ ] Authentication providers enabled
- [ ] Firestore rules published
- [ ] App runs locally without errors
- [ ] Can sign up new user
- [ ] Can login with email
- [ ] Can login with Google
- [ ] Can create survey
- [ ] Can view survey
- [ ] Can submit response
- [ ] Can view analytics
- [ ] Can download PDF
- [ ] Deployed to GitHub Pages (if applicable)

---

## 🆘 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| White screen | Check browser console, likely Firebase config issue |
| Can't login | Enable Email provider in Firebase |
| No Google button | Enable Google provider in Firebase |
| Analytics empty | Need responses first, try submitting a test response |
| PDF not generating | Check if surveys have responses with data |

---

## 🎉 You're All Set!

Your survey platform is ready with:
- ✨ Modern authentication
- 📊 Beautiful analytics
- 📄 Professional PDF reports
- 🎨 Rich text formatting
- 🔒 Secure user management

Start creating amazing surveys! 🚀
