import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import dummyData from "../assets/dummyCommitData.json";

dayjs.extend(isBetween);

interface CommitData {
  message: string;
  date: string;
}

interface TimeIntervalData {
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  committed: string[];
  uncommitted: string[];
}

interface DiscordEmbed {
  title: string;
  description: string;
  url: string;
  color: number; // Embed의 색상 (16진수 색상 코드)
  timestamp: string;
  fields: DiscordEmbedField[];
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 커밋 메시지에서 이름 추출
const getCommitter = (commitInfo: CommitData): string => {
  const { message } = commitInfo;
  return message.split("_")[0];
};

// TODO : connectRepository 모듈에서 GitHub 커밋 가져오는 함수 호출하기
const getCommits = (): any => {
  return dummyData;
};

const processData = (datas: { contributors: string[]; data: CommitData[] }): TimeIntervalData[] => {
  // day of week (0 - 7) (0 or 7 is Sun)

  // 1. 사용자가 어떤 요일에 체크를 하는지 받아오기
  let checkDayOfWeek: number[] = [1, 3, 5, 7];
  checkDayOfWeek.sort((n1: number, n2: number) => {
    return n1 - n2;
  });

  // 2. 사용자가 어떤 요일에 발송을 원하는지 받아오기
  const alarmDayOfWeek: number = 1;

  // 3. 해당 요일이 마지막 날이 되도록 배열을 재구성
  const check: number = checkDayOfWeek.length - 1;
  while (checkDayOfWeek[check] !== alarmDayOfWeek) {
    const pop: undefined | number = checkDayOfWeek.pop();
    if (pop !== undefined) checkDayOfWeek.unshift(pop - 7);
  }
  checkDayOfWeek = checkDayOfWeek.map((element) => element - alarmDayOfWeek);

  // 4. 현재와의 날짜 차이 계산하기
  let dateDiffArray: number[][] = Array.from({ length: checkDayOfWeek.length }, () => []);
  let lastDate = -7;
  for (let i = 0; i < checkDayOfWeek.length; i++) {
    dateDiffArray[i][0] = lastDate + 1;
    dateDiffArray[i][1] = checkDayOfWeek[i];
    lastDate = checkDayOfWeek[i];
  }

  // 5. 정보를 담을 배열 선언
  const output: TimeIntervalData[] = Array.from({ length: checkDayOfWeek.length });
  // 6. 배열에 들어가는 객체엔 커밋 기간, 요일, 커밋한 사람에 대한 정보가 들어감
  const { contributors, data } = datas;
  const now = dayjs();
  for (let i = 0; i < dateDiffArray.length; i++) {
    output[i] = {
      startDate: now.add(dateDiffArray[i][0], "day").format("YYMMDD"),
      endDate: now.add(dateDiffArray[i][1], "day").format("YYMMDD"),
      dayOfWeek: now.add(dateDiffArray[i][1], "day").day(),
      committed: [],
      uncommitted: [...contributors],
    };
  }

  // 7. 반복문을 통해 누가 해당 기간에 커밋했는지 체크
  for (const commitInfo of data) {
    let idx = -1;
    for (let i = 0; i < output.length; i++) {
      const info = output[i];
      if (dayjs(commitInfo.date).isBetween(info.startDate, info.endDate, "day", "[]")) {
        idx = i;
        break;
      }
    }

    // findIdx와 splice 시간복잡도 각각 n
    if (idx !== -1) {
      const committer = getCommitter(commitInfo);
      const findIdx = output[idx].uncommitted.indexOf(committer);
      if (findIdx !== -1) {
        output[idx].uncommitted.splice(findIdx, 1);
        output[idx].committed.push(committer);
      }
    }
  }

  return output;
};

const makeDiscordMessage = (datas: TimeIntervalData[]): { embeds: DiscordEmbed[] } => {
  const output: { embeds: DiscordEmbed[] } = {
    embeds: [
      {
        title: "🌱 Github Commit Check",
        description: "커밋 체크 내용을 알려드립니다!\n",
        url: "https://github.com/Github-Commit-Check",
        color: 0x00ff00, // Embed의 색상 (16진수 색상 코드),
        timestamp: new Date().toISOString(),
        fields: [],
      },
    ],
  };

  for (const data of datas) {
    const field: DiscordEmbedField = {
      name: `📅 ${data.startDate} ~ ${data.endDate} ${weeks[data.dayOfWeek]}`,
      value: `✅ 커밋 완료:  ${data.committed.join(" ")}\n
      ❌ 커밋 미완료: ${data.uncommitted.join(" ")}\n`,
    };
    output.embeds[0].fields.push(field);
  }

  return output;
};

const getMessage = (userInfo: string, kind: string) => {
  const commits = getCommits(); // 유저 정보로 커밋 내역 불러오기
  const processedData = processData(commits);

  if (kind === "discord") {
    return makeDiscordMessage(processedData);
  } else if (kind === "slack") {
  } else if (kind === "mattermost") {
  } else {
    return new Error("잘못된 알람 종류입니다.");
  }
};

export { getMessage };
