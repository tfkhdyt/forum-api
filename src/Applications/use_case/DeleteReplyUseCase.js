class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { replyId, commentId, threadId, owner } = useCasePayload;

    await this._replyRepository.verifyReplyAvailability(
      replyId,
      commentId,
      threadId
    );
    await this._replyRepository.validateReplyOwner(
      replyId,
      commentId,
      threadId,
      owner
    );

    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
