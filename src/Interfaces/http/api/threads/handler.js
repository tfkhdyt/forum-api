const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const FindThreadUseCase = require('../../../../Applications/use_case/FindThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(req, h) {
    req.payload.owner = req.auth.credentials.id;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(req.payload);

    const response = h
      .response({
        status: 'success',
        data: {
          addedThread: {
            id: addedThread.id,
            title: addedThread.title,
            owner: addedThread.owner,
          },
        },
      })
      .code(201);

    return response;
  }

  async getThreadByIdHandler(req, h) {
    const { threadId } = req.params;
    const findThreadUseCase = this._container.getInstance(
      FindThreadUseCase.name
    );
    const thread = await findThreadUseCase.execute(threadId);

    const response = h
      .response({
        status: 'success',
        data: { thread },
      })
      .code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
