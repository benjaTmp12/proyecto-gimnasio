const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });



module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};