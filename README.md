# My Notes

A personal notes app built with Expo, Expo Router, Firebase Authentication and Cloud Firestore.

## Screenshots

<p>
  <img src="./screenshots/IMG_1283.PNG" alt="Sign-in screen" width="200" />
  <img src="./screenshots/IMG_1284.PNG" alt="Notes list" width="200" />
  <img src="./screenshots/IMG_1285.PNG" alt="Note actions" width="200" />
  <img src="./screenshots/IMG_1286.PNG" alt="New note form" width="200" />
</p>

## Features

- Email/password sign up, login and logout
- Notes (title, content, type, creation date) stored in Firestore, visible only to their owner
- Categorize notes as School, Work, Personal, or a custom type
- Create, edit and move notes to trash (delete asks for confirmation)
- Filter between All / Delete / Favorites; swipe left in Delete to restore or permanently delete a note
- Mark notes as favorites; deleted notes stay out of All, Favorites and the header counts
- Total active note count in the header

## Setup

1. Install dependencies: `npm install`
2. In the Firebase console, enable **Authentication → Email/Password** and create a **Firestore** database.
3. Copy `.env.example` to `.env.local` and fill in your Firebase web app config (never commit `.env.local`).
4. Paste these rules into **Firestore → Rules**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /notes/{noteId} {
         allow create: if request.auth != null
                       && request.resource.data.userId == request.auth.uid;
         allow read, update, delete: if request.auth != null
                       && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

5. Start the app: `npx expo start`

## Data model (`notes` collection)

| Field       | Type      |
| ----------- | --------- |
| `title`     | string    |
| `content`   | string    |
| `type`      | string    |
| `favorite`  | boolean   |
| `deleted`   | boolean (missing on older notes means not deleted) |
| `createdAt` | timestamp |
| `userId`    | string    |
