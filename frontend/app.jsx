import React, { useState, useEffect } from "react";
import { backend } from "declarations/backend";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [plantDate, setPlantDate] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const fetchedLogs = await backend.getAllLogs();
    setLogs(fetchedLogs.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)));
  };

  const handleAddOrUpdate = async () => {
    if (!plantName || !plantDate) return;

    if (editId !== null) {
      await backend.editLog(editId, plantName, plantDate, statusNote, imageUrl);
      setEditId(null);
    } else {
      await backend.addLog(plantName, plantDate, statusNote, imageUrl);
    }

    setPlantName("");
    setPlantDate("");
    setStatusNote("");
    setImageUrl("");
    fetchLogs();
  };

  const handleEdit = (log) => {
    setPlantName(log.plantName);
    setPlantDate(log.plantDate);
    setStatusNote(log.statusNote);
    setImageUrl(log.imageUrl);
    setEditId(log.id);
  };

  const handleDelete = async (id) => {
    await backend.deleteLog(id);
    fetchLogs();
  };

  return (
    <div className="container">
      <h1>🌱 GreenTrace</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Plant Name"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
        />
        <input
          type="date"
          value={plantDate}
          onChange={(e) => setPlantDate(e.target.value)}
        />
        <textarea
          placeholder="Condition Notes"
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editId !== null ? "Update Log" : "Add Log"}
        </button>
      </div>

      <div className="log-list">
        {logs.map((log) => (
          <div key={log.id} className="log-card">
            <h3>{log.plantName}</h3>
            <p><strong>📅 Planted Date:</strong> {log.plantDate}</p>
            <p>{log.statusNote}</p>
            {log.imageUrl && <img src={log.imageUrl} alt={log.plantName} />}
            <small>🕒 {new Date(Number(log.createdAt) / 1000000).toLocaleString()}</small>
            <div className="log-actions">
              <button onClick={() => handleEdit(log)} title="Edit">✏️</button>
              <button onClick={() => handleDelete(log.id)} title="Delete">❌</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
