const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('it should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      title: 'abc',
    };

    // action and assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specs', () => {
    // arrange
    const payload = {
      id: 69,
      title: 123,
      owner: 'bruh',
    };

    // action and assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'inijudulinijudulinijudulinijudulinijudulinijudulinijudulinijudul',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.TITLE_LIMIT_CHAR'
    );
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'ini judul',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
