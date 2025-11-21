import express from "express";
import auth from "../Middleware/auth.js";

import {
  createBoard,
  getBoards,
  getBoard,
  inviteUser,
  addList,
  addCard,
  getRecommendations,
  moveCard
} from "../Controller/Board.controller.js";

const router = express.Router();
router.post("/create", auth, createBoard);
router.get("/all", auth, getBoards);
router.get("/get", auth, getBoard);
router.post("/invite", auth, inviteUser);
router.post("/add-list", auth, addList);
router.post("/add-card", auth, addCard); 
router.get("/recommendations", auth, getRecommendations); 
router.post("/move-card", auth, moveCard);  

export default router;
