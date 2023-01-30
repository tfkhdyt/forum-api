const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload didnt contain needed property', () => {
    // arrange
    const payload = { konten: 'abc' };

    // action and assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      content: true,
      owner: 123,
      threadId: ['abc'],
      commentId: ['abc'],
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newReply object correctly', () => {
    // arrange
    const payload = {
      content: 'ini komentar',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // action
    const { content, owner, threadId, commentId } = new NewReply(payload);

    // assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
