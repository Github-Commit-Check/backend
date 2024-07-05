import axios from "axios";
import dotenv from "dotenv";
import { listCommits } from "../services/connectRepository";
import { format, startOfWeek, parse } from "date-fns";
import { DBInfo } from "../@types/db.interface";
import { DiscordEmbed, DiscordEmbedField } from "../@types/discord.interface";
import { Commit } from "../@types/commit.interface";

dotenv.config();

interface TimeIntervalData {
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  committed: string[];
  uncommitted: string[];
}

const Mattermost = require("node-mattermost");

async function sendCommitToDiscord(content: Commit, discordWebhookUrl: string) {
  const output: { embeds: DiscordEmbed[] } = {
    embeds: [
      {
        title: "🌱 " + content.repository.name,
        description: "커밋 내용을 알려드립니다!\n",
        url: "https://github.com/" + content.repository.name,
        color: 0x00ff00, // Embed의 색상 (16진수 색상 코드),
        timestamp: new Date().toISOString(),
        fields: [],
      },
    ],
  };

  for (const data of content.commits) {
    const field: DiscordEmbedField = {
      name: data.author.name,
      value: "✅ 커밋 : " + data.message,
    };
    output.embeds[0].fields.push(field);
  }

  return await axios.post(discordWebhookUrl, output);
}

async function sendCommitsToDiscord(output: TimeIntervalData[], discordWebhookUrl: string) {
  return await axios.post(discordWebhookUrl, output);
}

async function sendCommitToSlack(content: Commit, slackWebhookUrl: string) {
  // 메시지 생성
  let messageText = "### :white_check_mark: 커밋 알림\n";
  messageText += "|:smile: 이름|:git: 커밋 메세지|:gunpang_timer: 타임스탬프|\n";
  messageText += "|:------:|:------------------------:|:-----------:|\n";

  for (const data of content.commits) {
    messageText += `|${data.author.name}|${data.message}|${data.timestamp}|\n`;
  }

  return await axios.post(slackWebhookUrl, {
    text: messageText,
  });
}

async function sendCommitToMattermost(content: Commit, mattermostWebhookUrl: string) {
  // 메시지 생성
  let messageText = "### :white_check_mark: 커밋 알림\n";
  messageText += "|:smile: 이름|:git: 커밋 메세지|:gunpang_timer: 타임스탬프|\n";
  messageText += "|:------:|:------------------------:|:-----------:|\n";

  for (const data of content.commits) {
    messageText += `|${data.author.name}|${data.message}|${data.timestamp}|\n`;
  }

  return await axios.post(mattermostWebhookUrl, {
    text: messageText,
  });
}

async function sendCommitsToMattermost(
    ownerName:string, repoName: string, branchName: string,
  mattermostWebhookUrl: string
): Promise<void> {
  try {
    // const mattermost = Mattermost(mattermostWebhookUrl);

    const commits: any[] = await listCommits(ownerName, repoName);
      
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

      return await axios.post(mattermostWebhookUrl, {
        text: messageText,
      });
    // await mattermost.send({
    //   text: messageText,
    // //   channel_id: "kym6455m6iywmd9js7jbkyskya",
    // });

    // console.log("커밋 내역을 Mattermost에 성공적으로 전송했습니다.");
  } catch (error) {
    console.error("커밋 내역 전송 중 오류 발생:", error);
  }
}

async function sendMessage(message: Commit, kind: DBInfo["webhook"]) {
  //hasOwnPropery 나중에 문제 생길 수 있어서 수정해야 함
  //시간 + 런타임 에러 문제
  if (kind.hasOwnProperty("discord")) {
    return sendCommitToDiscord(message, kind.discord as string);
  } else if (kind.hasOwnProperty("slack")) {
    return sendCommitToSlack(message, kind.slack as string);
  } else if (kind.hasOwnProperty("mattermost")) {
    return sendCommitToMattermost(message, kind.mattermost as string);
  } else {
    return Promise.reject(new Error("잘못된 알람 종류입니다."));
  }
}

export { sendCommitsToDiscord, sendCommitsToMattermost, sendMessage };
