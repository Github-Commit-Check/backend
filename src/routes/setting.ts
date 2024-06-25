import express, { Request, Response, Router } from "express";
import * as setting from '../services/setting';
import { DBInfo } from "../@types/db.interface";


const router: Router = express.Router();

//Get Setting Infos
router.get("/", async (req: Request, res: Response) => {

    const infoList = setting.getInfoList();

    return res.status(200).json({
        info_list: infoList
    });
});

//Get Setting Info
router.get("/:id", async (req: Request, res: Response) => {

    const info = setting.getInfo(req.params.id);

    return res.status(200).json({
        info: info
    });
});

//Add New Setting
router.post("/", async (req: Request, res: Response) => {

    const dbInfo: DBInfo = {
        repo: {
            id: req.body.repo.id,
            name: req.body.repo.name
        },
        owner: {
            id: req.body.owner.id,
            name: req.body.owner.name,
            github_access_token: req.body.owner.github_access_token
        },
        webhook: {
            server: "",
            discord: req.body.webhook.discord,
            slack: req.body.owner.slack,
            mattermost: req.body.owner.mattermost
        },
        schedule: [
            req.body.schedule
        ]
    }
    
    return res.status(200).json({

    });
});

//Modify Setting
router.put("/", async (req: Request, res: Response) => {
    return res.status(200).json({
    });
});
  

//Delete Setting
router.delete("/", async (req: Request, res: Response) => {
    return res.status(200).json({
    });
  });

export = router;
