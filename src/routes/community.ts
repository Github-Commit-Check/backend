import express, { Request, Response, Router } from "express";
import * as community from "../services/community";
import { Commit } from "../@types/commit.interface";
import * as setting from "../services/setting";
import { DBInfo } from "../@types/db.interface";

const router: Router = express.Router();

router.post("/message", async (req: Request, res: Response) => {
  try {
    // TODO commits 배열로 들어오는 거 처리
    const {
      repository: {
        id: repoId,
        name: repoName,
        owner: { name: ownerName, id: ownerId },
      },
      commits: [
        {
          message: message,
          timestamp: timeStamp,
          author: { name: userName, username: userNickname },
        },
      ],
      head_commit: { id: headCommitId },
    }: Commit = req.body;

    const settingInfo = await setting.getInfo(ownerName, repoName);

    const kind: DBInfo["webhook"] = (settingInfo as DBInfo).webhook;

    const content: Commit = {
      repository: {
        id: repoId,
        name: repoName,
        owner: {
          name: ownerName,
          id: ownerId,
        },
      },
      commits: [
        {
          message: message,
          timestamp: timeStamp,
          author: {
            name: userName,
            username: userNickname,
          },
        },
      ],
      head_commit: {
        id: headCommitId,
      },
    };

    if (!content) {
      return res.status(400).send("Message is required");
    }

    const response = await community.sendMessage(content, kind);

    if (response.status === 200) {
      res.status(200).send("Message sent successfully");
    } else {
      res.status(response.status).send("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal Server Error");
  }
});

export = router;
