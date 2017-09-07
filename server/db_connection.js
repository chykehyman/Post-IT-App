import Sequelize from 'sequelize';
import config from './config/db_url.json';


const sequelize = new Sequelize(config.url);
sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error(`Database connection error: ${err.message}`));

export default sequelize;