import { Model } from 'mongoose';
import { StringMappingType } from 'typescript';

export interface DBInfo {
    owner: String,
    repo: String,
    date: String,
    since: String,
    until: String,
    schedule: [
        {
            week: string,
            date: string,
            time: string,
        }
    ]
}

export interface DBUInfoModel extends Model<DBInfo> {}