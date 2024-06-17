// src/models/User.ts
import { Schema, model } from 'mongoose';

import { DBInfo, DBUInfoModel } from '../@types/db.interface';

const infoSchema = new Schema<DBInfo, DBUInfoModel>({
  owner: { type: String, require: true },
  repo: { type: String, require: true },
  date: { type:String, require: true },
  since: { type: String, required: true },
  until: { type: String, required: true, unique: true },
});

const Info = model('Info', infoSchema);

export default Info;