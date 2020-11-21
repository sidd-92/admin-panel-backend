const express = require("express");
const router = express.Router();

const multer = require("multer");
const AWS = require("aws-sdk");
const Post = require("../../models/Post");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const s3Client = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.BUCKET_REGION,
});

const uploadParams = {
  Bucket: process.env.BUCKET_NAME,
  Key: "", // pass key
  Body: null, // pass file body
  ACL: "public-read",
};

// @route    GET api/posts
// @desc     Get all post
// @access   Private

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post("/", upload.single("file"), async (req, res) => {
  let fileInfo = {
    name: "",
    url: "",
  };
  try {
    if (req.file) {
      let params = uploadParams;
      params.Key = req.file.originalname;
      params.Body = req.file.buffer;
      s3Client.upload(params, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "S3 Upload Error -> " + err });
        }
        fileInfo.name = req.file.originalname;
        fileInfo.url = data.Location;
        console.log("File Uploaded Successfully", data.Location);
        //res.json({ message: "File Uploaded Successfully", url: `${data.Location}` });
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body,
          featuredImage: fileInfo,
        });

        const post = await newPost.save();

        res.json(post);
      });
    } else {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        featuredImage: "",
      });

      const post = await newPost.save();

      res.json(post);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
