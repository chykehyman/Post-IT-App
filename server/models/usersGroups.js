import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const UsersGroups = sequelize.define('UsersGroups', {
    admin: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'no'
    },
    userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
            model: 'Users',
            key: 'id',
            as: 'userId'
        }
    },
    groupId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
            model: 'Groups',
            key: 'id',
            as: 'groupId'
        }
    }
}, {
    timestamps: false
});

UsersGroups.associate = (models) => {
    UsersGroups.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });
    UsersGroups.belongsTo(models.Groups, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
    });
};

export default UsersGroups;