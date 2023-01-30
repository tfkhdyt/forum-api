const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      username: 'tfkhdyt',
      date: 'ini date',
    };

    // action and assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: true,
      username: 12,
      date: 20.5,
      content: ['ini konten'],
      replies: 'reply',
    };

    // action and assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailComment object correctly', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      username: 'tfkhdyt',
      date: 'ini date',
      content: 'ini konten',
      replies: [],
    };

    // action
    const { id, username, date, content } = new DetailComment(payload);

    // assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
