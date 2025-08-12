const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProjectSchema = new Schema({
  title: String,
  description: String,
  link: String
}, { _id: false });

const UserProfileSchema = new Schema({
  name: String,
  email: String,
  skills: [String],
  projects: [ProjectSchema],
  github: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
