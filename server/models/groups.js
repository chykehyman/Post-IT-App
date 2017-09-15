import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const Groups = sequelize.define('Groups', {
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
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
}, {
    timestamps: true,
    updatedAt: false
});

Groups.associate = (models) => {
    Groups.hasMany(models.UsersGroups, {
        foreignKey: 'groupId',
        as: 'groupmembers'
    });
    Groups.hasMany(models.Messages, {
        foreignKey: 'groupId',
        as: 'groupmembers'
    });
    Groups.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
};

export default Groups;