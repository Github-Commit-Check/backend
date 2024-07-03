import { Schema, model } from "mongoose";

import { DBInfo, DBInfoModel } from "../@types/db.interface";

const infoSchema = new Schema<DBInfo, DBInfoModel>({
  repo: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  owner: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    github_access_token: { type: String, required: false },
  },
  webhook: {
    server: { type: String, required: true },
    discord: { type: String, required: false },
    slack: { type: String, required: false },
    mattermost: { type: String, required: false },
  },
  schedule: {
    hour: { type:Number, require: false},
    minute: { type:Number, require: false },
    dayOfWeek: { type:Number, require: false },
  },
});

const Info = model("Info", infoSchema);

export default Info;
