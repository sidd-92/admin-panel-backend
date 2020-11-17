require("dotenv").config(); // Loading dotenv to have access to env variables

const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Api is Working",
  });
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
