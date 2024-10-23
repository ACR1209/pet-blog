import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
