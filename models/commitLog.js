'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CommitLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            })
        }
    }
    CommitLog.init(
        {
            userId: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false
            },
            result: {
                type: sequelize.Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            message: {
                type: sequelize.Sequelize.TEXT
            },
            count: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'CommitLog',
        }
    );
    return CommitLog;
};
