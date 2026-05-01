import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXf9leozMrpDPd7WmsVc5_mtIOGwCaWOI",
  authDomain: "dimsum-imono.firebaseapp.com",
  projectId: "dimsum-imono",
  storageBucket: "dimsum-imono.firebasestorage.app",
  messagingSenderId: "263685544445",
  appId: "1:263685544445:web:6d8cff2fc720381fdc2194",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);