import mongoose from "mongoose";
const { Schema } = mongoose;

const CardSchema = new Schema({
  title: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ListSchema = new Schema({
  title: String,
  cards: [CardSchema],
  createdAt: { type: Date, default: Date.now }
});

const BoardSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lists: [ListSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Board || mongoose.model("Board", BoardSchema);
