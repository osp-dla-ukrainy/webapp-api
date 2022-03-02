#!/usr/bin/env zx

const sshKey = process.env.SSH_KEY;
const serverConnectionString = process.env.SERVER_CONNECTION_STRING;
const service = process.env.SERVICE;

await `eval $(ssh-agent -s)`
await $`ssh-add - <<< ${sshKey}`
await $`ssh -A ${serverConnectionString} cd osp/webapp-api && git pull && docker-compose pull ${service} && docker-compose up -d ${service}`
