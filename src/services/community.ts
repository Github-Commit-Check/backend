import axios, { AxiosResponse } from 'axios';

import dotenv from 'dotenv';
dotenv.config();

async function discord(content: string) {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (typeof discordWebhookUrl === "undefined") {
        throw new Error("Env const `discordWebhookUrl` is not defined");
    }

    console.log(content);

    return await axios.post(discordWebhookUrl, {
        content: content,
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

async function mattermost(message: string) {

    const mattermostWebhookUrl = process.env.MATTERMOST_WEBHOOK_URL;

    if (typeof mattermostWebhookUrl === "undefined") {
        throw new Error("Env const `mattermostWebhookUrl` is not defined");
    }

    return await axios.post(mattermostWebhookUrl, {
        text: message,
    });
}

async function sendMessage(message: string, kind: string) {
    if (kind === 'discord') {
        return discord(message);
    }
    else if (kind === 'slack') {
        return slack(message);
    }
    else if (kind === 'mattermost') {
        return mattermost(message);
    }
    else {
        return Promise.reject(new Error('잘못된 알람 종류입니다.'));
    }
}

export { discord, slack, mattermost, sendMessage};