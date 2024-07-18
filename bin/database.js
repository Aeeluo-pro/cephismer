const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'station',
    password: process.env.DB_PASSWORD || 'station',
    database: process.env.DB_NAME || 'station',
    connectionLimit: 20, // Increase as needed
    connectTimeout: 20000 // Increase as needed
});

pool.getConnection()
    .then(conn => {
        console.log('MariaDB Connected...');
        fs.readFile(path.join(__dirname, 'init.sql'), 'utf8', async (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            const commands = data.split(';').map(command => command.trim()).filter(command => command.length > 0);
            try {
                for (let command of commands) {
                    await conn.query(command);
                }
                console.log('Database initialized');
            } catch (err) {
                console.log(err);
            } finally {
                conn.end();
            }
        });
    })
    .catch(err => {
        throw err;
    });

module.exports = pool;