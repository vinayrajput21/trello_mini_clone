import Board from "../models/Board.model.js";
import User from "../models/User.model.js";
import rec from "../SmartRecommendation/Recommendation.js";

export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      name: req.body.name,
      owner: req.user.id,
      lists: []
    });
    res.json(board);
  } catch (err) {
    console.error("Create Board Error:", err);
    res.status(500).send("Server error");
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }]
    }).populate("owner collaborators", "name email");

    res.json(boards);
  } catch (err) {
    console.error("Fetch Boards Error:", err);
    res.status(500).send("Server error");
  }
};

export const getBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId)
      return res.status(400).json({ message: "boardId is required" });

    const board = await Board.findById(boardId).populate(
      "owner collaborators",
      "name email"
    );

    if (!board)
      return res.status(404).json({ message: "Board not found" });

    res.json(board);
  } catch (err) {
    console.error("Fetch Board Error:", err);
    res.status(500).send("Server error");
  }
};


export const inviteUser = async (req, res) => {
  try {
    const { boardId, email } = req.body;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!board.collaborators.includes(user._id)) {
      board.collaborators.push(user._id);
      await board.save();
    }

    res.json(board);
  } catch (err) {
    console.error("Invite Error:", err);
    res.status(500).send("Server error");
  }
};

export const addList = async (req, res) => {
  try {
    const { boardId, title } = req.body;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    board.lists.push({ title, cards: [] });
    await board.save();

    res.json(board);
  } catch (err) {
    console.error("Add List Error:", err);
    res.status(500).send("Server error");
  }
};


export const addCard = async (req, res) => {
  try {
    const { boardId, listIndex, title, description, assignees, dueDate } = req.body;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const list = board.lists[listIndex];
    if (!list) return res.status(404).json({ message: "List not found" });

    list.cards.push({
      title,
      description,
      assignees: assignees || [],
      dueDate: dueDate || null
    });

    await board.save();
    res.json(board);
  } catch (err) {
    console.error("Add Card Error:", err);
    res.status(500).send("Server error");
  }
};


export const getRecommendations = async (req, res) => {
  try {
    const { boardId, listIndex, cardIndex } = req.query;

    const board = await Board.findById(boardId).lean();
    if (!board) return res.status(404).json({ message: "Board not found" });

    const card = board.lists[listIndex]?.cards[cardIndex];
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json({
      due: rec.suggestDueDate(card),
      listMove: rec.suggestListMovement(card),
      related: rec.findRelatedCards(board, card)
    });
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).send("Server error");
  }
};


export const moveCard = async (req, res) => {
  try {
    const { boardId, fromList, toList, fromIndex, toIndex } = req.body;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const sourceList = board.lists.find(list => list._id.toString() === fromList);
    const destList = board.lists.find(list => list._id.toString() === toList);

    if (!sourceList || !destList)
      return res.status(404).json({ message: "List not found" });

    const [card] = sourceList.cards.splice(fromIndex, 1);
    if (!card)
      return res.status(404).json({ message: "Card not found" });

    destList.cards.splice(toIndex, 0, card);

    await board.save();
    res.json(board);

  } catch (err) {
    console.error("Move Card Error:", err);
    res.status(500).send("Server error");
  }
};
