import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const Groups = sequelize.define('Groups', {
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    groupType: {
        type: Sequelize.STRING,
        defaultValue: 'public'
    },
    userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
            model: 'Users',
            key: 'id',
            as: 'userId'
        }
    }
});

Groups.associate = (models) => {
    Groups.hasMany(models.UsersGroups, {
        foreignKey: 'groupId',
        as: 'groupId'
    });
    Groups.hasMany(models.Messages, {
        foreignKey: 'groupId',
        as: 'groupId'
    });
    Groups.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
};

export default Groups;