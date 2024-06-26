import express, {Request, Response} from "express"
import bodyParser from'body-parser';
import cors from 'cors';

import * as db from './utils/db';

const app = express();

db.connect();

const port:number = 3000;

app.use(cors());
app.use(bodyParser.json());

import connectRouter, { use } from "./routes/connect";
import viewRouter from "./routes/view";
import settingRouter from "./routes/setting";
import communityRouter from "./routes/community";

app.use("/connect", connectRouter);
app.use("/view", viewRouter);
app.use("/setting", settingRouter);
app.use("/community", communityRouter);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});