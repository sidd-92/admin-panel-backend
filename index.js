require("dotenv").config(); // Loading dotenv to have access to env variables

const express = require("express");
const mailgun = require("mailgun-js");
const morgan = require("morgan");
const cors = require("cors");
const checkAuth = require("./middleware/check-auth");
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

app.post("/sendmail", checkAuth, (req, res, next) => {
  let email = req.body.email;
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API, domain: DOMAIN });
  const data = {
    from: process.env.MAILGUN_URL,
    to: "sidddude92@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomness! click on this link to Reset Password https://www.google.com",
    template: "resetpassword",
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log("ERROR", error);
      res.status(404).json({ message: body });
    } else {
      console.log(body);
      res.status(200).json({ message: `Mail Was Sent to ${email} ` });
    }
  });
});

app.use("/api/posts", require("./routes/api/post"));
app.use("/api/users", require("./routes/api/user"));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
