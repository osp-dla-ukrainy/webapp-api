#!/usr/bin/env zx

const {dockerLogin} = require("./docker-login.js");

await dockerLogin();

const service = process.env.SERVICE;

await $`docker-compose build ${service}`;

await $`docker-compose push ${service}`;
