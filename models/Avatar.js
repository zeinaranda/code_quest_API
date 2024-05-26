

module.exports = (sequelize, DataTypes) => {
    const Avatar = sequelize.define('Avatar', {
        avatarId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          namaAvatar: {
            type: DataTypes.STRING,
            allowNull: false
          },
          priceAvatar: {
            type: DataTypes.INTEGER,
          },
          imageAvatar: {
            type: DataTypes.STRING,
            allowNull: false
          },
          obtainMethod: {
            type: DataTypes.STRING,
            allowNull: false
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          stageId: {
            type: DataTypes.INTEGER,
          },
    }, {
        tableName: 'avatar'
    });

    return Avatar;
}