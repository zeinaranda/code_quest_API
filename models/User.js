const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          nim: {
            type: DataTypes.STRING,
            allowNull: false
          },
          nama: {
            type: DataTypes.STRING,
            allowNull: false
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          koin: {
            type: DataTypes.INTEGER
          },
          point: {
            type: DataTypes.INTEGER
          },
          profileAvatar: {
            type: DataTypes.STRING
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
          },

    }, {

        tableName: 'user'
    });

    return User;
}