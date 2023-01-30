/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const pool = require('../src/Infrastructures/database/postgres/pool');
const createServer = require('../src/Infrastructures/http/createServer');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },

  async login({
    username = 'tfkhdyt',
    password = 'secret',
    fullname = 'Taufik Hidayat',
  }) {
    const server = await createServer(container);
    const response0 = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password,
        fullname,
      },
    });

    const userId = JSON.parse(response0.payload).data.addedUser.id;

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password,
      },
    });

    const responseJson = JSON.parse(response.payload);

    return { accessToken: responseJson.data.accessToken, userId };
  },
};

module.exports = AuthenticationsTableTestHelper;
