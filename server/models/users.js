import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const Users = sequelize.define('Users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 100]
        }
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