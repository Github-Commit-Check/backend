import { getDiscordMessage } from "../utils/data";
import { sendCommitsToMattermost, sendCommitsToDiscord, sendMessage } from "./community";
import schedule from "node-schedule";
import { DBInfo } from "../@types/db.interface";
import { DiscordEmbed } from "../@types/discord.interface";
import Info from "../models/info";

// const jobList =
interface DB {
  // 레포지토리 정보
  repo: {
    id: string;
    name: string;
  };
  // 레포지토리 소유자 정보
  owner: {
    id: string;
    name: string;
    // Github OAuth
    github_access_token: string;
  };
  // Webhook 링크
  webhook: {
    // Push 이벤트 발생 시 서버로 요청할 API 주소
    // 다른 사람들이랑 겹치지 않게 고유 주소로 생성
    server: string;
    // 채널에 메세지 보낼 Webhook 주소
    discord: string;
    slack: string;
    mattermost: string;
  };
  // 스케줄링 일정
  schedule: {
    hour: number;
    minute: number;
    dayOfWeek: number;
  };
}

interface TimeIntervalData {
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  committed: string[];
  uncommitted: string[];
}

const recoveryJob = async (): Promise<void> => {
  const settingInfos = await Info.find({});

  for (const settingInfo of settingInfos) {
    const jobName = settingInfo.owner.name + "/" + settingInfo.repo.name;
    const { hour, minute, dayOfWeek } = settingInfo.schedule;

    if (settingInfo.webhook.discord !== undefined) {
      schedule.scheduleJob(jobName, { hour, minute, dayOfWeek }, async () => {
        const output: { embeds: DiscordEmbed[] } = (await getDiscordMessage(
          settingInfo.owner.name,
          settingInfo.repo.name
        )) as { embeds: DiscordEmbed[] };
        sendCommitsToDiscord(output, settingInfo.webhook.discord as string);
      });
    } else if (settingInfo.webhook.slack !== undefined) {
    } else if (settingInfo.webhook.mattermost !== undefined) {
      schedule.scheduleJob(jobName, { hour, minute, dayOfWeek }, () => {
        sendCommitsToMattermost(
          settingInfo.owner.name,
          settingInfo.repo.name,
          settingInfo.webhook.mattermost as string
        );
      });
    }
  }
};

const setJob = (settingInfo: DBInfo): void => {
  // every sunday 2:30pm
  const jobName = settingInfo.owner.name + "/" + settingInfo.repo.name;
  const { hour, minute, dayOfWeek } = settingInfo.schedule;

  if (settingInfo.webhook.discord !== undefined) {
    schedule.scheduleJob(jobName, { hour, minute, dayOfWeek }, async () => {
      const output: { embeds: DiscordEmbed[] } = (await getDiscordMessage(
        settingInfo.owner.name,
        settingInfo.repo.name
      )) as { embeds: DiscordEmbed[] };
      sendCommitsToDiscord(output, settingInfo.webhook.discord as string);
    });
  } else if (settingInfo.webhook.slack !== undefined) {
  } else if (settingInfo.webhook.mattermost !== undefined) {
    schedule.scheduleJob(jobName, { hour, minute, dayOfWeek }, () => {
      sendCommitsToMattermost(
        settingInfo.owner.name,
        settingInfo.repo.name,
        settingInfo.webhook.mattermost as string
      );
    });
  }
};

export { setJob, recoveryJob };
