const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  featuredImage: {
    type: Object,
  },
});

module.exports = mongoose.model("post", PostSchema);
