import { DBInfo } from "../@types/db.interface";
import Info from '../models/info';

import dotenv from 'dotenv';
dotenv.config();

async function saveInfo(dbInfo: DBInfo) {
    try {
        const newInfo = new Info(dbInfo);
        await newInfo.save();
        return newInfo;    
    }
    catch (error) {
        throw error;
    }
    
}

async function getInfo(ownerId: string, repoName: string) {
    try {
        const settingInfo = await Info.findOne(
            {
                owner: {
                    id: ownerId
                },
                repo: {
                    name: repoName
                }
            }
        );
        
        return settingInfo;    
    }
    catch (error) {
        throw error;
    }
}

async function modifyInfo(dbInfo: DBInfo) {
    try {
     
        const settingInfo = await Info.findOneAndUpdate({
            owenr: {
                id: dbInfo.owner.id
            }, repo: {
                name: dbInfo.repo.name
            }
        }, dbInfo, { new: true, runValidators: true });
        
        return settingInfo;   
    } catch (error) {
        throw error;
    }
}

async function deleteInfo(dbInfo: DBInfo) {
    try {
        const settingInfo = await Info.findOneAndDelete({
            owenr: {
                id: dbInfo.owner.id
            }, repo: {
                name: dbInfo.repo.name
            }
        });
    
        return settingInfo;    
    }
    catch (error) {
        throw error;
    }
}

export { saveInfo, getInfo,modifyInfo, deleteInfo};