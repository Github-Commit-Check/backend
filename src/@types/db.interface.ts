import { Model } from 'mongoose';

export interface DBInfo {
    owner: String,
    repo: String,
    date: String,
    since: String,
    until: String
}

export interface DBUInfoModel extends Model<DBInfo> {}