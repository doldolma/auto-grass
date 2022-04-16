'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        this.hasMany(models.CommitLog, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    }
  }
  User.init(
    {
      login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      avatar_url: {
          type: DataTypes.STRING
      },
      active: {
        type: sequelize.Sequelize.BOOLEAN,
        defaultValue: true,
          allowNull: false
      },
      minCommits: {
          type: sequelize.Sequelize.INTEGER,
          defaultValue: 1,
          allowNull: false
      },
      maxCommits: {
          type: sequelize.Sequelize.INTEGER,
          defaultValue: 5,
          allowNull: false
      }
    },
      {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
