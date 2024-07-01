import { pool } from "../utils/db";
import { processData, getCommits } from "../utils/data";
import { sendMessage } from "./community";
import schedule from "node-schedule";

interface DB {
  // 레포지토리 정보
  repo: {
    id: String;
    name: String;
  };
  // 레포지토리 소유자 정보
  owner: {
    id: String;
    name: String;
    // Github OAuth
    github_access_token: String;
  };
  // Webhook 링크
  webhook: {
    // Push 이벤트 발생 시 서버로 요청할 API 주소
    // 다른 사람들이랑 겹치지 않게 고유 주소로 생성
    server: String;
    // 채널에 메세지 보낼 Webhook 주소
    discord: String;
    slack: String;
    mattermost: String;
  };
  // 스케줄링 일정
  schedule: [
    {
      day: String;
      time: String;
    }
  ];
}

// TODO : 사용자가 입력한 정보를 받아서 스케줄러에 등록하기
const setJob = (): void => {
  // every sunday 2:30pm
  const { hour, minute, dayOfWeek } = { hour: 16, minute: 47, dayOfWeek: 2 };
  const job = schedule.scheduleJob({ hour, minute, dayOfWeek }, () => {
    const datas = getCommits();
    const processedData = processData(datas);
    sendMessage(JSON.stringify(processedData), "discord");
  });
  saveDB();
};

// TODO : DB 종류 정한 후 사용자 정보 저장하기
const saveDB = (): void => {};

const test = () => {
  const commitData = getCommits();
  const output = processData(commitData);
  console.log(JSON.stringify(output));
};

test();

export { setJob, processData };
