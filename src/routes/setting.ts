import express, { Request, Response, Router } from "express";
import * as setting from '../services/setting';
import { DBInfo } from "../@types/db.interface";

const router: Router = express.Router();

//Get Setting Infos
router.get("/", async (req: Request, res: Response) => {

    try {
        const ownerId:string = req.params.owner_id;
        const repoName:string = req.params.repo_name;
    
        const settingInfo = await setting.getInfo(ownerId, repoName);
    
        if (settingInfo) {
            return res.status(200).json({
                info_list: settingInfo
            });        
        }
        else {
            throw new Error("존재하지 않는 정보입니다.");    
        }

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to get setting info"
        });
    }
    
});

//Add New Setting
router.post("/", async (req: Request, res: Response) => {

    try {
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
        
        const settingInfo = await setting.saveInfo(dbInfo);

        if (settingInfo) {
            return res.status(200).json({
                message: "Setting added successfully"
            });     
        }
        else {
            throw new Error("정보 저장에 실패했습니다.");    
        }

        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to save setting Info",
            error: error
        })
    }

    
});

//Modify Setting
router.put("/", async (req: Request, res: Response) => {
    try {
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
        
        const settingInfo = await setting.saveInfo(dbInfo);

        if (settingInfo) {
            return res.status(200).json({
                message: "Success to Setting Update"
            });
        }
        else {
            throw new Error("정보 수정에 실패했습니다.");    
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to Setting Update",
            error: error
        });
    }
});
  

//Delete Setting
router.delete("/", async (req: Request, res: Response) => {
    try {


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

        const settingInfo = await setting.deleteInfo(dbInfo);

        if (settingInfo) {
            return res.status(200).json({
                message: "Success to Setting deleted",
            });
        }
        else {
            throw new Error("정보 삭제에 실패했습니다.");    
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to Setting deleted",
            error: error
        });
    }

  });

export = router;
