const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, h) {
    const { threadId, commentId } = req.params;

    req.payload.owner = req.auth.credentials.id;
    req.payload.threadId = threadId;
    req.payload.commentId = commentId;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(req.payload);

    const response = h
      .response({
        status: 'success',
        data: {
          addedReply: {
            id: addedReply.id,
            content: addedReply.content,
            owner: addedReply.owner,
          },
        },
      })
      .code(201);

    return response;
  }

  async deleteReplyHandler(req, h) {
    const { threadId, commentId, replyId } = req.params;

    const payload = {
      replyId,
      owner: req.auth.credentials.id,
      threadId,
      commentId,
    };

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    await deleteReplyUseCase.execute(payload);

    const response = h
      .response({
        status: 'success',
      })
      .code(200);

    return response;
  }
}

module.exports = RepliesHandler;
