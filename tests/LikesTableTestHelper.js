const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const LikesTableTestHelper = {
  async likeComment({
    id = 'like-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, owner],
    };

    await pool.query(query);
  },

  async unlikeComment(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };
    pool.query(query);
  },


  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE likes CASCADE');
  },
};

module.exports = LikesTableTestHelper;
