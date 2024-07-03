module.exports = (sequelize, DataTypes) => {
    const Boss = sequelize.define('boss', {
        bossId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
    }, {
        tableName: 'boss'
    });

    return Boss;
}