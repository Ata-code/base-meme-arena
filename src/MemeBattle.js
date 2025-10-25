import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, updateDoc, increment, doc, getDoc } from "firebase/firestore";

function MemeBattle({ user }) {
  const [memes, setMemes] = useState([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "memes"), (snapshot) => {
      setMemes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const submitMeme = async () => {
    if (!user) return alert("Login first!");
    if (!title || !imageUrl) return alert("Provide title and image URL");
    await addDoc(collection(db, "memes"), {
      userId: user.id,
      title,
      imageUrl,
      votes: 0,
      timestamp: new Date()
    });
    setTitle(""); setImageUrl("");
  };

  const hasVoted = async (memeId) => {
    const voteDoc = doc(db, "users", user.id, "votes", memeId);
    const voteSnap = await getDoc(voteDoc);
    return voteSnap.exists();
  };

  const voteMeme = async (memeId) => {
    if (!user) return alert("Login first!");
    if (await hasVoted(memeId)) return alert("You already voted!");
    await doc(db, "users", user.id, "votes", memeId).set({ timestamp: new Date() });
    await updateDoc(doc(db, "memes", memeId), { votes: increment(1) });
  };

  const topMemes = [...memes].sort((a,b) => b.votes - a.votes);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Weekly Meme Battle</h2>
      <div style={{ marginBottom: "20px" }}>
        <input placeholder="Meme title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <button onClick={submitMeme}>Submit Meme</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {topMemes.map(meme => (
          <div key={meme.id} style={{ border: "1px solid #FFD700", padding: "10px", borderRadius: "8px", width: "200px" }}>
            <img src={meme.imageUrl} alt={meme.title} style={{ width: "100%", borderRadius: "6px" }} />
            <h4>{meme.title}</h4>
            <p>{meme.votes} votes</p>
            <button onClick={() => voteMeme(meme.id)}>Vote</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemeBattle;
