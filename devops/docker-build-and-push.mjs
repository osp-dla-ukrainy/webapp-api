#!/usr/bin/env zx

const {dockerLogin} = require("./docker-login.js");

await dockerLogin();

await $`docker-compose build api`;

await $`docker-compose push api`;
