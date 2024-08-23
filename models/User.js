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
          ownedAvatars: {
            type: DataTypes.JSON,  // Gunakan tipe data JSON
            defaultValue: [],
          },
          firstLogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
          kategori: {
            type: DataTypes.STRING
          },
          rank: { // Tambahkan kolom untuk menyimpan poin sebelumnya
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          previousRank: { // Track previous rank
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
          rankArrow: { // Tambahkan kolom untuk status panah
            type: DataTypes.STRING,
            defaultValue: 'none'
          },
          rankChange: { // Menyimpan perubahan peringkat sebagai string seperti "+3" atau "-2"
            type: DataTypes.STRING,
            defaultValue: ''
        }

    }, {

        tableName: 'user'
    });

    User.associate = function(models) {
      User.belongsToMany(models.Stage, { through: models.UserStage, foreignKey: 'userId' });
  };
 
 
    return User;
}