const NewLike = require('../NewLike');

describe('a NewLike entities', () => {
  it('should throw error when payload didnt contain needed property', () => {
    // arrange
    const payload = { konten: 'abc' };

    // action and assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      owner: 123,
      threadId: ['abc'],
      commentId: ['abc'],
    };

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newLike object correctly', () => {
    // arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // action
    const { owner, threadId, commentId } = new NewLike(payload);

    // assert
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
