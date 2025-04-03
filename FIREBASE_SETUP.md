# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the eMate application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" 
3. Enter a name for your project (e.g., "eMate")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web Application

1. From the Firebase project dashboard, click the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "eMate Web")
3. Check the box "Also set up Firebase Hosting" if you plan to deploy the app with Firebase Hosting (optional)
4. Click "Register app"
5. Firebase will display your configuration. Keep this page open as you'll need these values

## Step 3: Enable Authentication Methods

1. In the Firebase console, click "Authentication" in the left sidebar
2. Click "Get started" if this is your first time setting up Authentication
3. Select the "Sign-in method" tab
4. Enable the authentication methods you want to use:
   - Email/Password: Click on it, enable it, and save
   - Google: Click on it, enable it, add a support email, and save
   - Any other providers you need

## Step 4: Add Firebase Configuration to Your Application

1. Open the `.env.local` file in your project
2. Update the Firebase configuration variables with the values from your Firebase project:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBSGfwPVqQiJg-yT-J9PZhVc9Lc_32SGFM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mieng-31e8f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mieng-31e8f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mieng-31e8f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1087582020279
NEXT_PUBLIC_FIREBASE_APP_ID=1:1087582020279:web:1123c9bac5ec993f6de332
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-12S0EJDBEZ
```

3. Set `NEXT_PUBLIC_ENABLE_LOCAL_AUTH=false` to use Firebase authentication (or `true` to use local development mode)

## Step 5: Generate and Add Admin SDK Configuration (for server-side operations)

1. In the Firebase console, go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Update the server-side Firebase admin config in `.env.local`:

```
FIREBASE_PROJECT_ID=mieng-31e8f
FIREBASE_CLIENT_EMAIL=<client_email from the JSON file>
FIREBASE_PRIVATE_KEY="<private_key from the JSON file>"
```

Note: Make sure to include the quotes around the private key value, as it contains newlines.

## Step 6: Restart Your Development Server

1. Kill any running instances of your application
2. Run `npm run dev` to start the development server with the new configuration

## Troubleshooting

### Invalid API Key Error

If you see an error like `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`, check that:

1. You've correctly copied the API key from Firebase
2. There are no extra spaces or characters in your `.env.local` file
3. Your Firebase project is properly set up and the API key has the necessary permissions

### Web API Key Not Working

Make sure you're using the Web API key from your Firebase project, not the Server key or another type of key.

### Development Mode

If you can't get Firebase authentication working, you can enable local development mode by setting:

```
NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true
```

This will allow you to use a simulated authentication system for development purposes.

## Security Notes

- Never commit your `.env.local` file or Firebase service account key to version control
- Apply appropriate restrictions to your Firebase API keys in the Google Cloud Console
- For production environments, consider using environment variables in your hosting platform rather than files 