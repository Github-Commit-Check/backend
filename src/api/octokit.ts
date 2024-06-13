import { Octokit } from "@octokit/rest";

const OCTOKIT_TOKEN = process.env.OCTOKIT_TOKEN;

if (!OCTOKIT_TOKEN) {
    throw new Error('.env 파일의 git hub token이 잘못되었습니다.');
}

export const octokit = new Octokit({
    auth: OCTOKIT_TOKEN,
});