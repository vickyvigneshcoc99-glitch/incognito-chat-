import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAHPrNMjX8Samw3PWH31qXkvnbMrB11ofg",
    authDomain: "ipchat-7d73a.firebaseapp.com",
    databaseURL: "https://ipchat-7d73a-default-rtdb.firebaseio.com",
    projectId: "ipchat-7d73a",
    storageBucket: "ipchat-7d73a.firebasestorage.app",
    messagingSenderId: "1085449747676",
    appId: "1:1085449747676:web:370aff1ec2f2eab142c819",
    measurementId: "G-72CZQ3DGBT",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
