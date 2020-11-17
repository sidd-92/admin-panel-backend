require("dotenv").config(); // Loading dotenv to have access to env variables

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Api is Working",
  });
});

app.use("/api/posts", require("./routes/api/post"));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
