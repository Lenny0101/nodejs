import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, trim: true },
    username: { type: String, required: true },
    media: {
      contentId: { type: String, required: true },
      path: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const PostModel = mongoose.model('Post', postSchema);

const save = async model => new PostModel(model).save();

const getPostByUser = async username => PostModel.find({ username });
const getPostById = async id => PostModel.findById(id);
const getAllPosts = async () => PostModel.find({}) || [];

export { save, getAllPosts, getPostById, getPostByUser };
