const mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Electrical, Water, etc.
  imageUrl: { type: String }, // Path to the uploaded image
  status: { type: String, required: true, default: 'Open' }, // Open, In Progress, Resolved
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);