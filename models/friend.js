module.exports = (sequelize, DataTypes) => {
    const friend = sequelize.define('friend', {
        friendId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          userId: {
            type: DataTypes.INTEGER,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
         
    }, {
        tableName: 'friend'
    });

    // friend.hasMany(sequelize.models.User, {
    //     foreignKey: 'userId', // Nama kolom foreign key pada tabel "statusorder"
    //     targetKey: 'userId', // Nama kolom pada tabel "order" yang dijadikan referensi
    //   });

    return friend;
}