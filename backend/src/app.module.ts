import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getMongoUri()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function getMongoUri(): string {
  const dbURI = process.env.DB_URI;
  if (!dbURI) {
    throw new Error('MongoDB connection string is not defined in the environment variables.');
  }
  return dbURI;
}
