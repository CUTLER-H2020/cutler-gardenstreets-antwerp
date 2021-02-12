import firebase from 'firebase/app';
import 'firebase/auth';

import { getEnv } from './env';

const firebaseConfig = {
  apiKey: getEnv('REACT_APP_FIREBASE_API_KEY'),
  authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getEnv('REACT_APP_FIREBASE_DATABASE_URL'),
  projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('REACT_APP_FIREBASE_APP_ID'),
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.EmailAuthProvider();
