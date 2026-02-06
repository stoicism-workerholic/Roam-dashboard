import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkCollection(name) {
    try {
        const colRef = collection(db, name);
        const snapshot = await getDocs(colRef);
        console.log(`Collection '${name}': ${snapshot.size} documents found.`);
        if (snapshot.size > 0) {
            console.log("Sample ID:", snapshot.docs[0].id);
            console.log("Sample Data:", JSON.stringify(snapshot.docs[0].data(), null, 2));
        }
    } catch (error) {
        console.error(`Error reading '${name}':`, error.message);
    }
}

async function main() {
    console.log("Checking Firestore Data...");
    await checkCollection("users");
    await checkCollection("ride_requests");
    await checkCollection("drivers");
    await checkCollection("driverTokens");
    console.log("Done.");
    process.exit(0);
}

main();
