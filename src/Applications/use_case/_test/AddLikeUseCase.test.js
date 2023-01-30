const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectedResult = {
      status: 'success',
    };
    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockLikeRepository.likeComment = jest.fn(() =>
      Promise.resolve({
        status: 'success',
      })
    );
    mockLikeRepository.isAlreadyLiked = jest.fn(() => Promise.resolve(false));
    mockThreadRepository.validate = jest.fn(() => Promise.resolve());
    mockCommentRepository.validate = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedLike = await getLikeUseCase.execute(useCasePayload);

    // assert
    expect(addedLike).toStrictEqual(expectedResult);
  });

  it('should orchestrating the unlike action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectedResult = {
      status: 'success',
    };
    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockLikeRepository.likeComment = jest.fn(() =>
      Promise.resolve({
        status: 'success',
      })
    );
    mockLikeRepository.unlikeComment = jest.fn(() =>
      Promise.resolve({
        status: 'success',
      })
    );
    mockLikeRepository.isAlreadyLiked = jest.fn(() => Promise.resolve(true));
    mockThreadRepository.validate = jest.fn(() => Promise.resolve());
    mockCommentRepository.validate = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedLike = await getLikeUseCase.execute(useCasePayload);

    // assert
    expect(addedLike).toStrictEqual(expectedResult);
  });
});
