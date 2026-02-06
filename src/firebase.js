import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA791pe2PIP_wejHOeTrUnxQ3nsTohS9A8",
    authDomain: "ridebook-3a6b3.firebaseapp.com",
    databaseURL: "https://ridebook-3a6b3-default-rtdb.firebaseio.com",
    projectId: "ridebook-3a6b3",
    storageBucket: "ridebook-3a6b3.firebasestorage.app",
    messagingSenderId: "363665765741",
    appId: "1:363665765741:web:6614210161998479381664",
    measurementId: "G-QQY28T2VLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
