import { useState } from "react";
import List from "./List";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

export default function Board({ board, refresh, addList, moveCard }) {
  const [newListTitle, setNewListTitle] = useState("");

  function handleDragEnd(result) {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCard({
      cardId: draggableId,
      fromList: source.droppableId,
      toList: destination.droppableId,
      fromIndex: source.index,
      toIndex: destination.index,
    });
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pt-5 pb-5">
        {board.lists.map((list, idx) => (
          <Droppable key={list._id} droppableId={list._id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-[260px]"
              >
                <List
                  list={list}
                  boardId={board._id}
                  listIndex={idx}
                  refresh={refresh}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
        <div className="min-w-[260px] bg-gray-100 border border-gray-300 rounded-xl p-4">
          <h4 className="font-semibold mb-3 text-gray-700">New List</h4>

          <input
            className="w-full border p-2 rounded-lg mb-3"
            placeholder="List title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />

          <button
            onClick={() => {
              addList(newListTitle);
              setNewListTitle("");
            }}
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
