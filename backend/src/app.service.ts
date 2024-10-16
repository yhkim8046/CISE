import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class AppService {
  private client: MongoClient;
  private dbName: string = 'your_db_name'; // Replace with your MongoDB database name

  constructor() {
    this.client = new MongoClient('your_mongo_uri'); // Replace with your MongoDB URI
  }

  async getCollections(): Promise<string[]> {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collections = await db.listCollections().toArray();
    await this.client.close();
    return collections.map((collection) => collection.name);
  }
}
