const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');

const pool = require('../../database/postgres/pool');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      const newThread = new NewThread({
        title: 'ini judul',
        body: 'ini body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // action
      await threadRepositoryPostgres.addThread(newThread);

      // assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return new thread correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      const newThread = new NewThread({
        title: 'ini judul',
        body: 'ini body',
        owner: 'user-123',
      });
      const expectedResult = new AddedThread({
        id: 'thread-123',
        title: 'ini judul',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // action
      const result = await threadRepositoryPostgres.addThread(newThread);

      // assert
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe('validate function', () => {
    it('should throw not found error when thread id is not exist', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah thread' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action and assert
      await expect(
        threadRepositoryPostgres.validate('xxx')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw not found error when thread id is not exist', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah thread' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action and assert
      await expect(
        threadRepositoryPostgres.validate('thread-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('findThreadById function', () => {
    it('should return correct thread', async () => {
      // arrange
      const expectedThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        username: 'tfkhdyt',
        date: '2023-01-24T08:41:00.000Z',
      };
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action
      const thread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );

      // assert
      expect(thread.id).toEqual(expectedThread.id);
      expect(thread.title).toEqual(expectedThread.title);
      expect(thread.body).toEqual(expectedThread.body);
      expect(thread.username).toEqual(expectedThread.username);
      expect(thread.date).toEqual(expectedThread.date);
    });

    it('should return correct thread, with deleted comment', async () => {
      // arrange
      const expectedThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        username: 'tfkhdyt',
        date: '2023-01-24T08:41:00.000Z',
      };
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action
      const thread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );

      // assert
      expect(thread.id).toEqual(expectedThread.id);
      expect(thread.title).toEqual(expectedThread.title);
      expect(thread.body).toEqual(expectedThread.body);
      expect(thread.username).toEqual(expectedThread.username);
      expect(thread.date).toEqual(expectedThread.date);
    });

    it('should throw not found error', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'tfkhdyt' });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action and assert
      await expect(
        threadRepositoryPostgres.findThreadById('thread-xxx')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
