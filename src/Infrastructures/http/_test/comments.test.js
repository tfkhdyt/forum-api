const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { accessToken, userId } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        owner: userId,
      });
      const server = await createServer(container);

      const requestPayload = {
        content: 'ini konten',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { accessToken, userId } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        owner: userId,
      });
      const server = await createServer(container);

      const requestPayload = {};

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { accessToken, userId } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        owner: userId,
      });
      const server = await createServer(container);

      const requestPayload = {
        content: ['ini konten'],
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should 200 response and deleted correctly', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { accessToken, userId } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({ owner: userId });
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when deleting not found thread', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { userId, accessToken } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({ owner: userId });
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when deleting not found comment', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { userId, accessToken } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({ owner: userId });
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
