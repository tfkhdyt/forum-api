const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      username: 'tfkhdyt',
      date: 'ini date',
    };

    // action and assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arrange
    const payload = {
      id: true,
      username: 12,
      date: 20.5,
      content: ['ini konten'],
    };

    // action and assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailReply object correctly', () => {
    // arrange
    const payload = {
      id: 'reply-123',
      username: 'tfkhdyt',
      date: 'ini date',
      content: 'ini konten',
    };

    // action
    const { id, username, date, content } = new DetailReply(payload);

    // assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
