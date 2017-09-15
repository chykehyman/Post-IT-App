import Sequelize from 'sequelize';
import configurations from './config/db_url.json';

const env = process.env.NODE_ENV || 'development';
const config = configurations[env];

let sequelizeConnect;
if (config.use_env_variable) {
    sequelizeConnect = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelizeConnect = new Sequelize(
        config.database, config.username, config.password, config
    );
}
const sequelize = sequelizeConnect;

// const sequelize = new Sequelize(config.url);
// sequelize
//     .authenticate()
//     .then(() => console.log('Database connected successfully.'))
//     .catch(err => console.error(`Database connection error: ${err.message}`));

export default sequelize;