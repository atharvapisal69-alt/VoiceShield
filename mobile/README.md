# VoiceShield mobile

The React Native and Expo frontend for VoiceShield, an audio authenticity checker.

## Run locally

```bash
npm install
npx expo start
```

Use Expo Go, an Android emulator, or an iOS simulator. Microphone recording requires a device or development build with microphone permission enabled.

## Backend connection

The app uses a mock `LOW RISK` response when no API URL is configured, so the full presentation flow works without the backend. To connect the analyzer, create a `.env` file in `mobile/`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
```

The API service sends `POST /analyze` as `multipart/form-data` with the selected file in the `audio` field. The expected response contains `label`, `risk_score`, `confidence`, and `explanation`.

## Frontend routes

- Welcome and home dashboard
- Record voice with `expo-audio`
- Select WAV, MP3, or M4A with `expo-document-picker`
- Analysis loading and error states
- Detection result with risk score, confidence, and explanation
- Device-local analysis history with AsyncStorage
- Profile and model information# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
