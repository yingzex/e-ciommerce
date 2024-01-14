// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose, { Collection } from 'mongoose';
// import { app } from '../app';

// let mongo: any;

// // hook function. the function will run before all tests start to be executed
// beforeAll(async () => {
//   mongo = await MongoMemoryServer.create();
//   const mongoUri = mongo.getUri();
//   await mongoose.connect(mongoUri, {});
// });

// // run before each test starts
// // reach into mongodb and reset data inside it
// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//   for (let colletion of collections) {
//     await Collection.deleteMany({});
//   }
// });

// afterAll(async () => {
//   if (mongo) {
//     await mongo.stop();
//   }
//   await mongoose.connection.close();
// });

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
