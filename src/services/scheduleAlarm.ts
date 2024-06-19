import { pool } from "../utils/db";
import schedule from "node-schedule";
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
  const { hour, minute, dayOfWeek } = { hour: 14, minute: 30, dayOfWeek: 7 };
  const job = schedule.scheduleJob({ hour, minute, dayOfWeek }, () => {
    const datas = getCommits();
    sendMessage();
  });
  saveDB();
};

const processData = (datas: {
  contributors: string[];
  data: CommitData[];
}): { data: TimeIntervalData[] } | undefined => {
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
    if (pop === undefined) return;
    checkDayOfWeek.unshift(pop - 7);
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
  const output: { data: TimeIntervalData[] } = {
    data: Array.from({ length: checkDayOfWeek.length }),
  };

  // 6. 배열에 들어가는 객체엔 커밋 기간, 요일, 커밋한 사람에 대한 정보가 들어감
  const { contributors, data } = datas;
  const now = dayjs();
  for (let i = 0; i < dateDiffArray.length; i++) {
    output.data[i] = {
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
    for (let i = 0; i < output.data.length; i++) {
      const info = output.data[i];
      if (dayjs(commitInfo.date).isBetween(info.startDate, info.endDate, "day", "[]")) {
        idx = i;
        break;
      }
    }

    // findIdx와 splice 시간복잡도 각각 n
    if (idx !== -1) {
      const committer = getCommitter(commitInfo);
      const findIdx = output.data[idx].uncommitted.indexOf(committer);
      if (findIdx !== -1) {
        output.data[idx].uncommitted.splice(findIdx, 1);
        output.data[idx].committed.push(committer);
      }
    }
  }

  return output;
};

// 커밋 메시지에서 이름 추출
const getCommitter = (commitInfo: CommitData): string => {
  const { message } = commitInfo;
  return message.split("_")[0];
};

// TODO : DB 종류 정한 후 사용자 정보 저장하기
const saveDB = (): void => {};

// TODO : connectRepository 모듈에서 GitHub 커밋 가져오는 함수 호출하기
const getCommits = (): any => {
  return dummyData;
};

// TODO : 사용자가 지정한 Community에 메시지 전송하기
const sendMessage = (): void => {};

const test = () => {
  const commitData = getCommits();
  const output = processData(commitData);
  console.log(JSON.stringify(output));
};

test();

export { setJob, processData };
