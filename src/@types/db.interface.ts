import { Model } from 'mongoose';

export interface DBInfo {
    repo: {
        id: String,
        name: String
    },
    owner: {
        id: String,
        name: String,
        github_access_token: String
    },
    webhook: {
        server?: String,
        discord?: String,
        slack?: String,
        mattermost?: String
    },
    schedule: {
        hour: Number,
        minute: Number,
        dayOfWeek: Number
    }
}

export interface DBInfoModel extends Model<DBInfo> {}