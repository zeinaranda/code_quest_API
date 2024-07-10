module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
      friendId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false, // Pastikan userId tidak boleh null
          references: {
              model: 'User', // Sesuaikan dengan nama model User Anda jika berbeda
              key: 'userId'
          }
      },
      friendUserId: {
          type: DataTypes.INTEGER,
          allowNull: false, // ID dari user yang di-add sebagai teman
          references: {
              model: 'User', // Sesuaikan dengan nama model User Anda jika berbeda
              key: 'userId'
          }
      },
      createdAt: {
          type: DataTypes.DATE,
          allowNull: false
      },
      updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
      }
  }, {
      tableName: 'friend'
  });

  Friend.associate = function(models) {
    Friend.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Friend.belongsTo(models.User, { as: 'friendUser', foreignKey: 'friendUserId' });
};


  return Friend;
};
