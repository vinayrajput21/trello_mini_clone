import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import API from "../api";
import CardItem from "./Card";
import RecommendationsPanel from "../Components/RecommandationPanel";

export default function List({ list, boardId, listIndex, refresh }) {
  const [openRec, setOpenRec] = useState(null);
  const [cardTitle, setCardTitle] = useState("");

  function toggleRec(cardId) {
    setOpenRec(prev => (prev === cardId ? null : cardId));
  }

  async function addCard() {
    if (!cardTitle.trim()) return;

   await API.post("/boards/add-card", {
  boardId,
  listIndex,
  title: cardTitle
});


    setCardTitle("");
    refresh();
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow min-h-[200px] w-[260px] border">
      <h3 className="font-semibold text-gray-800 mb-3">{list.title}</h3>

      {list.cards.map((card, index) => (
        <Draggable key={card._id} draggableId={card._id} index={index}>
          {(provided) => (
            <div>
              <div
                className="cursor-grab"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <CardItem card={card} />

                <button
                  onClick={() => toggleRec(card._id)}
                  className="text-blue-600 text-xs mt-1 underline"
                >
                  {openRec === card._id
                    ? "Hide Recommendations"
                    : "Show Recommendations"}
                </button>
              </div>

              {openRec === card._id && (
                <RecommendationsPanel
                  boardId={boardId}
                  listIndex={listIndex}
                  cardIndex={index}
                />
              )}
            </div>
          )}
        </Draggable>
      ))}
      <div className="mt-3">
        <input
          className="w-full border rounded p-2 mb-2"
          placeholder="Add a card"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
        />

        <button
          onClick={addCard}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Card
        </button>
      </div>
    </div>
  );
}
