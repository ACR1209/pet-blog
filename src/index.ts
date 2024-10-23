import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import userRouter from "./routes/users";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
