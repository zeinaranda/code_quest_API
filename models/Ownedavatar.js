module.exports = (sequelize, DataTypes) => {
    const Ownedavatar = sequelize.define('Ownedavatar', {
        ownedId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          userId: {
            type: DataTypes.INTEGER,
          },
          avatarId: {
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
        tableName: 'ownedavatar'
    });

    return Ownedavatar;
}