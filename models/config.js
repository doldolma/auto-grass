module.exports = {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT || 3306,
    dialect: process.env.DATABASE_DIALECT,
    logging: false
};
