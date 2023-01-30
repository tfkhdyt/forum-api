class FindThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.findThreadById(threadId);

    let comments = await this._commentRepository.findCommentsByThreadId(
      threadId
    );

    comments = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await this._likeRepository.getLikeCount(comment.id);
        const result = {
          ...comment,
          likeCount,
          content: comment.is_deleted
            ? '**komentar telah dihapus**'
            : comment.content,
        };
        delete result.is_deleted;

        return result;
      })
    );

    comments = await Promise.all(
      comments.map(async (comment) => {
        let replies = await this._replyRepository.findRepliesByCommentId(
          comment.id
        );
        replies = replies.map((reply) => {
          const result = {
            ...reply,
            content: reply.is_deleted
              ? '**balasan telah dihapus**'
              : reply.content,
          };
          delete result.is_deleted;

          return result;
        });

        return {
          ...comment,
          replies,
        };
      })
    );

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = FindThreadUseCase;
