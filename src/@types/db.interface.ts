import { Model } from 'mongoose';

export interface DBInfo {
    repo: {
        id: string,
        name: string
    },
    owner: {
        id: string,
        name: string,
        github_access_token: string
    },
    webhook: {
        server?: string,
        discord?: string,
        slack?: string,
        mattermost?: string
    },
    schedule: {
        hour: number,
        minute: number,
        dayOfWeek: number
    }
}

export interface DBInfoModel extends Model<DBInfo> {}