const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, h) {
    const { threadId, commentId } = req.params;

    const payload = {
      owner: req.auth.credentials.id,
      threadId,
      commentId,
    };

    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
    await addLikeUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = LikesHandler;
