const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted like', async () => {
      // arrange
      const loginPayload = { username: 'tfkhdyt', password: 'secret' };
      const { accessToken, userId } =
        await AuthenticationsTableTestHelper.login(loginPayload);
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: userId,
      });
      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      console.log(response.payload);
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  // describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
  //   it('should 200 response and deleted correctly', async () => {
  //     // arrange
  //     const loginPayload = { username: 'tfkhdyt', password: 'secret' };
  //     const { accessToken, userId } =
  //       await AuthenticationsTableTestHelper.login(loginPayload);
  //     await ThreadsTableTestHelper.addThread({
  //       owner: userId,
  //     });
  //     await CommentsTableTestHelper.addComment({ owner: userId });
  //     await LikesTableTestHelper.addReply({ owner: userId });
  //     const server = await createServer(container);
  //
  //     // action
  //     const response = await server.inject({
  //       method: 'DELETE',
  //       url: '/threads/thread-123/comments/comment-123/replies/reply-123',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //
  //     // assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(200);
  //     expect(responseJson.status).toEqual('success');
  //   });
  //
  //   it('should response 404 when deleting not found thread', async () => {
  //     // arrange
  //     const loginPayload = { username: 'tfkhdyt', password: 'secret' };
  //     const { userId, accessToken } =
  //       await AuthenticationsTableTestHelper.login(loginPayload);
  //     await ThreadsTableTestHelper.addThread({
  //       owner: userId,
  //     });
  //     await CommentsTableTestHelper.addComment({ owner: userId });
  //     await LikesTableTestHelper.addReply({ owner: userId });
  //     const server = await createServer(container);
  //
  //     // action
  //     const response = await server.inject({
  //       method: 'DELETE',
  //       url: '/threads/thread-xxx/comments/comment-123/replies/reply-123',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //
  //     // assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(404);
  //     expect(responseJson.status).toEqual('fail');
  //   });
  //
  //   it('should response 404 when deleting not found comment', async () => {
  //     // arrange
  //     const loginPayload = { username: 'tfkhdyt', password: 'secret' };
  //     const { userId, accessToken } =
  //       await AuthenticationsTableTestHelper.login(loginPayload);
  //     await ThreadsTableTestHelper.addThread({
  //       owner: userId,
  //     });
  //     await CommentsTableTestHelper.addComment({ owner: userId });
  //     await LikesTableTestHelper.addReply({ owner: userId });
  //     const server = await createServer(container);
  //
  //     // action
  //     const response = await server.inject({
  //       method: 'DELETE',
  //       url: '/threads/thread-123/comments/comment-xxx/replies/reply-123',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //
  //     // assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(404);
  //     expect(responseJson.status).toEqual('fail');
  //   });
  //
  //   it('should response 404 when deleting not found reply', async () => {
  //     // arrange
  //     const loginPayload = { username: 'tfkhdyt', password: 'secret' };
  //     const { userId, accessToken } =
  //       await AuthenticationsTableTestHelper.login(loginPayload);
  //     await ThreadsTableTestHelper.addThread({
  //       owner: userId,
  //     });
  //     await CommentsTableTestHelper.addComment({ owner: userId });
  //     await LikesTableTestHelper.addReply({ owner: userId });
  //     const server = await createServer(container);
  //
  //     // action
  //     const response = await server.inject({
  //       method: 'DELETE',
  //       url: '/threads/thread-123/comments/comment-123/replies/reply-xxx',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //
  //     // assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(404);
  //     expect(responseJson.status).toEqual('fail');
  //   });
  // });
});
