#!/usr/bin/env zx

const sshKey = process.env.SSH_KEY;
const serverConnectionString = process.env.SERVER_CONNECTION_STRING;

await $`ssh-add - <<< ${sshKey}`
await $`ssh -A ${serverConnectionString} git pull && docker-compose pull api && docker-compose up -d api`
