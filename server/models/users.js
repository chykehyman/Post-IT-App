import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const Users = sequelize.define('Users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    updatedAt: false
});

Users.associate = (models) => {
    Users.hasMany(models.Groups, {
        foreignKey: 'userId',
        as: 'groups'
    });
    Users.hasMany(models.UsersGroups, {
        foreignKey: 'userId',
        as: 'usersgroups'
    });
    Users.hasMany(models.Messages, {
        foreignKey: 'userId',
        as: 'messages'
    });
};

export default Users;