import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import MemeBattle from "./MemeBattle";

function App() {
  const [coins, setCoins] = useState([]);
  const [user, setUser] = useState({ id: "guest_" + Math.random().toString(36).slice(2, 8) });
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  // Realtime coin updates
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "coins"), (snap) => {
      const coinData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCoins(coinData.sort((a, b) => b.votes - a.votes));
    });
    return () => unsub();
  }, []);

  // Vote once per coin per user
  const hasVoted = async (coinId) => {
    const voteRef = doc(db, "users", user.id, "votes", coinId);
    const snap = await getDoc(voteRef);
    return snap.exists();
  };

  const handleVote = async (coinId) => {
    if (await hasVoted(coinId)) return alert("You already voted!");
    const voteRef = doc(db, "users", user.id, "votes", coinId);
    await updateDoc(doc(db, "coins", coinId), { votes: increment(1) });
    await updateDoc(voteRef, { timestamp: new Date() }).catch(() => {});
  };

  const toggleFavorite = (coinId) => {
    setFavorites((prev) =>
      prev.includes(coinId)
        ? prev.filter((c) => c !== coinId)
        : [...prev, coinId]
    );
  };

  const filteredCoins = coins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const topThree = coins.slice(0, 3);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ color: "#00ffb3" }}>🔥 Base Meme Arena 🔥</h1>

      <input
        style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
        placeholder="Search memecoin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>🏆 Top 3 Memecoins</h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {topThree.map((coin) => (
          <div
            key={coin.id}
            style={{
              border: "1px solid #00ffb3",
              borderRadius: "12px",
              padding: "10px",
              width: "180px",
              textAlign: "center",
            }}
          >
            <h4>{coin.name}</h4>
            <p>{coin.votes} votes</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "30px" }}>All Memecoins</h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {filteredCoins.map((coin) => (
          <div
            key={coin.id}
            style={{
              border: "1px solid gray",
              borderRadius: "12px",
              padding: "10px",
              width: "180px",
              textAlign: "center",
            }}
          >
            <h4>{coin.name}</h4>
            <p>{coin.votes} votes</p>
            <button onClick={() => handleVote(coin.id)}>Vote</button>
            <button onClick={() => toggleFavorite(coin.id)}>
              {favorites.includes(coin.id) ? "★" : "☆"}
            </button>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <>
          <h2 style={{ marginTop: "30px" }}>⭐ Favorite Memecoins</h2>
          <ul>
            {favorites.map((f) => (
              <li key={f}>{coins.find((c) => c.id === f)?.name}</li>
            ))}
          </ul>
        </>
      )}

      <MemeBattle user={user} />
    </div>
  );
}

export default App;
