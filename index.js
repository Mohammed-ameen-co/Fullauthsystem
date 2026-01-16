const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv")

const { connectMongoDB } = require("./connect");
const authMiddleware = require("./middleware/authMiddleware")
const userRoute = require("./routes/user")

dotenv.config();

const app = express();
const port = 3001 || process.env.PORT;


connectMongoDB("mongodb://localhost:27017/full_auth").then(() => {
  console.log("MongoDB Connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoute)

app.use(authMiddleware);

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(port, () =>
  console.log(`Express app Running http://localhost:${port}`)
);
