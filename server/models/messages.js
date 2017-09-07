import Sequelize from 'sequelize';
import sequelize from '../db_connection';

const Messages = sequelize.define('Messages', {
    message: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
    },
    priority: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [
                ['normal', 'urgent', 'critical']
            ]
        }
    }
}, {
    timestamps: true,
    updatedAt: false
});

Messages.associate = (models) => {
    Messages.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
    Messages.belongsTo(models.Groups, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
    });
};

export default Messages;