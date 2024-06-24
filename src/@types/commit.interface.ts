import { Model } from 'mongoose';

export interface Commit{
    repository: {
        id: string,
        name: string,
        owner: {
            name: string,
            id: string
        }
    },
    commits: [
        {
            message: string,
            timestamp: string,
            author: {
                name: string,
                username: string
            }
        }
    ],
    head_commit: {
        id: string
    }
}

export interface CommitModel extends Model<Commit> { }

