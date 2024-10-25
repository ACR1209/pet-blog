import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import userRouter from "./routes/users";
import { User } from "@prisma/client";
import { authenticateJWT } from "./utils/jwt-middleware";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import microPostRouter from "./routes/microPosts";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));


app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(authenticateJWT);

app.get("/", (req: Request, res: Response) => {
  res.render("index",  { currentUser: req.user, title: "Hey", message: `Hello ${req.user?.email}` });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", microPostRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
