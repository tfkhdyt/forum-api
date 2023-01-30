const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, h) {
    const { threadId } = req.params;

    req.payload.owner = req.auth.credentials.id;
    req.payload.threadId = threadId;

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(req.payload);

    const response = h
      .response({
        status: 'success',
        data: {
          addedComment: {
            id: addedComment.id,
            content: addedComment.content,
            owner: addedComment.owner,
          },
        },
      })
      .code(201);

    return response;
  }

  async deleteCommentHandler(req, h) {
    const { threadId, commentId } = req.params;

    const payload = {
      owner: req.auth.credentials.id,
      threadId,
      commentId,
    };

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute(payload);

    const response = h
      .response({
        status: 'success',
      })
      .code(200);

    return response;
  }
}

module.exports = CommentsHandler;
