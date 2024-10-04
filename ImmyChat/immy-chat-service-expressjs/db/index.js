const { MongoClient } = require('mongodb');
const dbName = 'immy';

let db;
let client;

const connectMongoDB = async (clientArg) => {
  try {
    const url = process.env.MONGO_URL
    client = clientArg ? clientArg : await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectMongoDB first.');
  }
  return db;
};

const closeMongoDB = async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

const deleteLessonData = async (socketId) => {
  const immyCollection = getDb().collection('immy');

  try {
    const result = await immyCollection.deleteOne({ _id: socketId });
    if (result.deletedCount === 1) {
      console.log('Document deleted successfully:', result);
    } else {
      console.log('Document with socketId not found.');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

const insertLessonData = async (socketId, vocabulary, phrases, context, dialog_lines) => {
  const immyCollection = getDb().collection('immy');
  const lessonObject = {
    _id: socketId,
    vocabulary: vocabulary,
    phrases: phrases,
    context: context,
    dialog_lines: dialog_lines
  };
  try {
    const result = await immyCollection.updateOne({ _id: socketId }, { $set: lessonObject }, { upsert: true });
    console.log('Document updated or inserted successfully:', result);
  } catch (error) {
    console.error('Error updating or inserting document:', error);
  }
};

const getLessonData = async (socketId) => {
  const immyCollection = getDb().collection('immy');
  try {
    const document = await immyCollection.findOne({ _id: socketId });

    if (document) {
      console.log('Document found:', document);
      return document;
    } else {
      console.log('Document not found for socketId:', socketId);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving document:', error);
    throw error;
  }
};

module.exports = { connectMongoDB, getDb, deleteLessonData, insertLessonData, getLessonData, closeMongoDB };