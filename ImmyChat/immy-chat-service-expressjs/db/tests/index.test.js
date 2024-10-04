const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { deleteLessonData, connectMongoDB, getDb, closeMongoDB, insertLessonData, getLessonData } = require('../index');

let mongoServer;
let mongoClient;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoClient = new MongoClient(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await connectMongoDB(mongoClient);
    db = getDb();
    await db.collection('immy').deleteMany({});
});

afterAll(async () => {
    closeMongoDB();
    await mongoServer.stop();
});

afterEach(async () => {
    await db.collection('immy').deleteMany({});
});

describe('deleteLessonData', () => {

    test('deletes document when it exists', async () => {
        const socketId = 'socket123';
        const db = getDb();
        await db.collection('immy').insertOne({ _id: socketId });
        await deleteLessonData(socketId);
        const result = await db.collection('immy').findOne({ _id: socketId });
        expect(result).toBeNull();
    });

    test('handles deletion of non-existent document', async () => {
        const socketId = 'nonExistentSocketId';
        const db = getDb();
        await deleteLessonData(socketId);
        const result = await db.collection('immy').findOne({ _id: socketId });
        expect(result).toBeNull();
    });

    test('handles error during deletion', async () => {
        const socketId = 'socketWithError';
        const db = getDb();
        await db.collection('immy').insertOne({ _id: socketId });
        const originalCollection = getDb().collection;
        getDb().collection = null;
        await expect(deleteLessonData(socketId)).rejects.toThrow();
        getDb().collection = originalCollection;
        const result = await db.collection('immy').findOne({ _id: socketId });
        expect(result).not.toBeNull();
    });
});

describe('insertLessonData', () => {
    test('inserts a new document', async () => {
        const socketId = 'socket123';
        const vocabulary = ['word1', 'word2'];
        const phrases = ['phrase1', 'phrase2'];
        const context = 'sample context';
        const dialog_lines = ['line1', 'line2'];

        await insertLessonData(socketId, vocabulary, phrases, context, dialog_lines);

        const result = await db.collection('immy').findOne({ _id: socketId });
        expect(result).toMatchObject({
            _id: socketId,
            vocabulary,
            phrases,
            context,
            dialog_lines
        });
    });

    test('updates an existing document', async () => {
        const socketId = 'socket123';
        const initialData = {
            _id: socketId,
            vocabulary: ['word1'],
            phrases: ['phrase1'],
            context: 'initial context',
            dialog_lines: ['initial line']
        };
        const updatedData = {
            _id: socketId,
            vocabulary: ['word2'],
            phrases: ['phrase2'],
            context: 'updated context',
            dialog_lines: ['updated line']
        };

        await db.collection('immy').insertOne(initialData);
        await insertLessonData(socketId, updatedData.vocabulary, updatedData.phrases, updatedData.context, updatedData.dialog_lines);
        const result = await db.collection('immy').findOne({ _id: socketId });
        expect(result).toEqual(updatedData);
    });

    test('handles errors during insertion', async () => {
        const socketId = 'socketWithError';
        const vocabulary = ['word1', 'word2'];
        const phrases = ['phrase1', 'phrase2'];
        const context = 'sample context';
        const dialog_lines = ['line1', 'line2'];
        const originalCollection = getDb().collection;
        getDb().collection = null;
        await expect(insertLessonData(socketId, vocabulary, phrases, context, dialog_lines)).rejects.toThrow();
        getDb().collection = originalCollection;
    });
});


describe('getLessonData', () => {
    test('retrieves document when it exists', async () => {
        const socketId = 'socket123';
        const expectedDocument = {
            _id: socketId,
            vocabulary: ['word1', 'word2'],
            phrases: ['phrase1', 'phrase2'],
            context: 'sample context',
            dialog_lines: ['line1', 'line2']
        };
        await db.collection('immy').insertOne(expectedDocument);

        const result = await getLessonData(socketId);
        expect(result).toEqual(expectedDocument);
    });

    test('returns null when document not found', async () => {
        const socketId = 'nonExistentSocketId';
        const result = await getLessonData(socketId);
        expect(result).toBeNull();
    });

    test('handles errors during retrieval', async () => {
        const socketId = 'socketWithError';
        const originalCollection = getDb().collection;
        getDb().collection = null;
        await expect(getLessonData(socketId)).rejects.toThrow();
        getDb().collection = originalCollection;
    });
});