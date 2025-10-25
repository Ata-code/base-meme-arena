import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const coins = [
  { id: "base_doge", name: "BaseDoge", votes: 0 },
  { id: "base_cat", name: "BaseCat", votes: 0 },
  { id: "base_moon", name: "BaseMoon", votes: 0 },
  { id: "base_pepe", name: "BasePepe", votes: 0 },
  { id: "base_pump", name: "BasePump", votes: 0 },
];

async function seedCoins() {
  for (const coin of coins) {
    await setDoc(doc(db, "coins", coin.id), { name: coin.name, votes: coin.votes });
    console.log(`Seeded ${coin.name}`);
  }
  console.log("All coins seeded successfully!");
}

seedCoins();
