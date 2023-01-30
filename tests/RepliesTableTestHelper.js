const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'ini balasan',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
    date = '2023-01-24T15:41:00',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, commentId, owner, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };
    pool.query(query);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies CASCADE');
  },
};

module.exports = RepliesTableTestHelper;
