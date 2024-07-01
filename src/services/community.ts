import { pool } from "../utils/db";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import * as connect from "../services/connectRepository";
import { format, startOfWeek, parse } from "date-fns";

dotenv.config();

const Mattermost = require("node-mattermost");

const hookurl = "https://meeting.ssafy.com/hooks/jokmtk4z8prazk8bjmqmy7cw5h";
const mattermost = new Mattermost(hookurl);

function test() {
  const str: string = "scheduleAlarm";

  return str;
}

async function dbTest() {
  const [rows, fields] = await pool.query("SELECT 1");
  return rows;
}

async function discord(message: string) {
  const discordWebhookUrl = process.env.MATTERMOST_WEBHOOK_URL;

  if (typeof discordWebhookUrl === "undefined") {
    throw new Error("Env const `discordWebhookUrl` is not defined");
  }

  return await axios.post(discordWebhookUrl, {
    text: message,
  });
}

async function slack(message: string) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (typeof slackWebhookUrl === "undefined") {
    throw new Error("Env const `slackWebhookUrl` is not defined");
  }

  return await axios.post(slackWebhookUrl, {
    text: message,
  });
}

// async function mattermost(message: string) {

//     const mattermostWebhookUrl = process.env.MATTERMOST_WEBHOOK_URL;

//     if (typeof mattermostWebhookUrl === "undefined") {
//         throw new Error("Env const `mattermostWebhookUrl` is not defined");
//     }

//     return await axios.post(mattermostWebhookUrl, {
//         text: message,
//     });
// }

async function sendCommitsToMattermost(connect: {
  listCommits: () => Promise<any[]>;
}): Promise<void> {
  try {
    const commits: any[] = await connect.listCommits();

    // 커밋을 주별, 사용자별로 그룹화
    const weeklyCommits: { [week: string]: { [user: string]: number } } = {};

    commits.forEach((commit: any) => {
      let commitDate = parse(commit.date, "yyMMdd", new Date());
      if (isNaN(commitDate.getTime())) {
        return;
      }
      const weekStart = startOfWeek(commitDate, { weekStartsOn: 1 }); // 월요일부터 시작

      const weekKey = format(weekStart, "yyyy-MM-dd");

      if (!weeklyCommits[weekKey]) {
        weeklyCommits[weekKey] = {};
      }

      if (!weeklyCommits[weekKey][commit.login]) {
        weeklyCommits[weekKey][commit.login] = 0;
      }

      weeklyCommits[weekKey][commit.login]++;
    });

    // 메시지 생성
    let messageText = "### 주간 GitHub 커밋 현황\n\n";

    // 테이블 헤더
    messageText += "| 주 | ";
    const users = Array.from(new Set(commits.map((commit) => commit.login))).sort();
    users.forEach((user) => {
      messageText += `${user} | `;
    });
    messageText += "\n";

    // 테이블 구분선
    messageText += "|" + "---|".repeat(users.length + 1) + "\n";

    // 테이블 내용
    Object.keys(weeklyCommits)
      .sort()
      .forEach((week) => {
        messageText += `| ${week} | `;
        users.forEach((user) => {
          messageText += `${weeklyCommits[week][user] || 0} | `;
        });
        messageText += "\n";
      });

    await mattermost.send({
      text: messageText,
      channel_id: "95h7bi71pfyntebw8pw3bid8ay",
    });

    console.log("커밋 내역을 Mattermost에 성공적으로 전송했습니다.");
  } catch (error) {
    console.error("커밋 내역 전송 중 오류 발생:", error);
  }
}

async function sendMessage(message: string, kind: string) {
  if (kind === "discord") {
    return discord(message);
  } else if (kind === "slack") {
    return slack(message);
  } else if (kind === "mattermost") {
    return mattermost(message);
  } else {
    return Promise.reject(new Error("잘못된 알람 종류입니다."));
  }
}

export { test, dbTest, discord, slack, mattermost, sendMessage };
sendCommitsToMattermost(connect);
