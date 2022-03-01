#!/usr/bin/env zx

async function dockerLogin() {
    const dockerUsername = process.env.DOCKER_USERNAME;
    const dockerAuthToken = process.env.DOCKER_PASSWORD;

    await $`echo ${dockerAuthToken} | docker login -u ${dockerUsername} --password-stdin`
}

module.exports = {dockerLogin}
