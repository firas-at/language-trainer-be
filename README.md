## Description

A backend that aims to store German vovabularies based on their type (noun, verb, adjective, other) and gets related information for these words using different AI services, currently supporting chatGPT and Gemini

It's built using NestJS and TypeORM for MySQL database.

## Project setup

1. Make sure to compy `.env.sample` file into `.env` file and set the environment variables values

2. Execute the following:

```make
$ make build
$ make start
```
Using docker compose, this will build the app and the database docker images.