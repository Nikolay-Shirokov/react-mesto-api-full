const { NODE_ENV, SALT_ROUNDS, JWT_SECRET } = process.env;

let secrets;

if (NODE_ENV === 'production') {
  secrets = {
    SALT_ROUNDS,
    JWT_SECRET,
  };
} else {
  secrets = {
    SALT_ROUNDS: 10,
    JWT_SECRET: 'dev-secret',
  };
}

module.exports = secrets;
