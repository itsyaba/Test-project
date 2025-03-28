import mongoose, { Schema, Document } from 'mongoose';

interface ICollection extends Document {
  name: string;
  account: mongoose.Types.ObjectId; // Reference to the user (Account)
  isFavorite?: boolean;
  tasks: mongoose.Types.ObjectId[];
  dueDate?: Date;
  icon?: string; // Add icon field to interface
}

const CollectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Ensure this is present
  isFavorite: { type: Boolean, default: false },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  dueDate: { type: Date },
  icon: { type: String, default: 'person' } // Add icon field with default emoji
});

export default mongoose.model<ICollection>('Collection', CollectionSchema);
