import axios, { AxiosResponse } from 'axios';

import Info from '../models/info';

import dotenv from 'dotenv';
dotenv.config();


async function getInfoList() {
    const infoList = await Info.find({});
    
    return infoList;
}

async function getInfo(id:string) {
    const info = await Info.findOne({ id: id });
    
    return info;
}



export { getInfoList,getInfo };