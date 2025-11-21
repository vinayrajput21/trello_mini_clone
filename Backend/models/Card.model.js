import mongoose from "mongoose";
const { Schema } = mongoose;

const CardSchema = new Schema({
  title: String,
});

export default mongoose.model('Card', CardSchema);
