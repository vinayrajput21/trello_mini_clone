import React, { useEffect, useState } from "react";
import API from "../api";
import Board from "../Components/Board.jsx";
import InviteBox from "../Components/InviteBox.jsx";

export default function BoardView({ board: initialBoard, goBack }) {
  const [board, setBoard] = useState(initialBoard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard();
  }, []);

  async function fetchBoard() {
    try {
      const res = await API.get("/boards/get", {
        params: { boardId: initialBoard._id },
      });
      setBoard(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function moveCard(data) {
    await API.post("/boards/move-card", {
      boardId: board._id,
      ...data,
    });

    fetchBoard();
  }

  async function addList(title) {
    if (!title.trim()) return;
    await API.post("/boards/add-list", {
      boardId: board._id,
      title,
    });

    fetchBoard();
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-20 text-gray-600 text-xl">
        Loading board...
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-5">
        <InviteBox
          boardId={board._id}
          onInvited={(updatedBoard) => setBoard(updatedBoard)}
        />
      </div>

      <div className="flex justify-between items-center mb-5">
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800">{board.name}</h2>

        <div></div>
      </div>

      <Board
        board={board}
        refresh={fetchBoard}
        addList={addList}
        moveCard={moveCard}
      />
    </div>
  );
}
