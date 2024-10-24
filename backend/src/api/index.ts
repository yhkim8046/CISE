import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from 'src/app.module';

let cachedServer;

const bootstrapServer = async () => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
};

export const handler = async (event, context) => {
  const server = await bootstrapServer();
  return server(event, context);
};