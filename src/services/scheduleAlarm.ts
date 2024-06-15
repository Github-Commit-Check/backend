import { pool } from "../utils/db";
import schedule from "node-schedule";

// TODO : 사용자가 입력한 정보를 받아서 스케줄러에 등록하기
function setJob(): void {
  const job = schedule.scheduleJob("42 * * * * *", function () {
    console.log("The answer to life, the universe, and everything!");
    getCommits();
  });
  saveDB();
}

// TODO : DB 종류 정한 후 사용자 정보 저장하기
function saveDB(): void {}

// TODO : connectRepository 모듈에서 GitHub 커밋 가져오는 함수 호출하기
function getCommits(): void {}

// TODO : 사용자가 지정한 Community에 메시지 전송하기
function sendMessage(): void {}

function test() {
  const str: string = "scheduleAlarm";

  return str;
}

async function dbTest() {
  const [rows, fields] = await pool.query("SELECT 1");
  return rows;
}

export { setJob };
