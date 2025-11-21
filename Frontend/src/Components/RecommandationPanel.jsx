import { useState, useEffect } from "react";
import API from "../api";

export default function RecommendationsPanel({
  boardId,
  listIndex,
  cardIndex,
}) {
  const [rec, setRec] = useState(null);

  useEffect(() => {
    fetchRec();
  }, []);

  async function fetchRec() {
    try {
      const res = await API.get("/boards/recommendations", {
        params: {
          boardId,
          listIndex,
          cardIndex,
        },
      });

      setRec(res.data);
    } catch (err) {
      console.error("Recommendation Error:", err);
    }
  }

  if (!rec) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 border p-3 rounded-lg mt-2 mb-2 shadow-sm">
      <h5 className="font-semibold mb-2 text-gray-700">Recommendations</h5>
      <div className="mb-3">
        <strong>Due Date:</strong>
        <div className="text-sm text-gray-700">{rec.due.suggestion}</div>
      </div>

      <div className="mb-3">
        <strong>Movement:</strong>
        <div className="text-sm text-gray-700">{rec.listMove}</div>
      </div>
      <div>
        <strong>Related Cards:</strong>

        {rec.related.length === 0 && (
          <div className="text-sm text-gray-500">None</div>
        )}

        {rec.related.map((r) => (
          <div
            key={r.card._id}
            className="border-t mt-2 pt-2 text-sm text-gray-700"
          >
            <div className="font-medium">{r.card.title}</div>
            <div className="text-gray-500 text-xs">{r.card.description}</div>
            <div className="text-gray-400 text-xs">
              score: {r.score.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
