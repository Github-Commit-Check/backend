import { DBInfo } from "../@types/db.interface";
import Info from "../models/info";

import dotenv from "dotenv";
dotenv.config();

async function saveInfo(dbInfo: DBInfo) {
  try {
    const newInfo = new Info(dbInfo);
    await newInfo.save();
    return newInfo;
  } catch (error) {
    throw error;
  }
}

async function getInfo(ownerId: string, repoName: string) {
  try {
    const fillter = {
      "owner.id": ownerId,
      "repo.name": repoName,
    };
    const settingInfo = await Info.findOne(fillter);

    return settingInfo;
  } catch (error) {
    throw error;
  }
}

async function modifyInfo(ownerId:String, repoName:String, dbInfo: DBInfo) {
  try {
    const fillter = {
      "owner.id": ownerId,
      "repo.name": repoName,
    };
    const update = {
      "owner.github_access_token": dbInfo.owner.github_access_token,
      "webhook.discord": dbInfo.webhook.discord,
      "webhook.slack": dbInfo.webhook.slack,
      "webhook.mattermost": dbInfo.webhook.mattermost,
      schedule: [dbInfo.schedule],
    };

    const settingInfo = await Info.findOneAndUpdate(fillter, update, {
      new: true,
      runValidators: true,
    });

    return settingInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteInfo(ownerId: string, repoName: string) {
  try {
    const fillter = {
      "owner.id": ownerId,
      "repo.name": repoName,
    };

    const settingInfo = await Info.findOneAndDelete(fillter);

    return settingInfo;
  } catch (error) {
    throw error;
  }
}

export { saveInfo, getInfo, modifyInfo, deleteInfo };
