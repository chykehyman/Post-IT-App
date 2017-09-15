module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable('UsersGroups', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
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
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface) => {
        queryInterface.dropTable('UsersGroups');
    }
};