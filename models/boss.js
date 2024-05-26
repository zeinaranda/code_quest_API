module.exports = (sequelize, DataTypes) => {
    const boss = sequelize.define('boss', {
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

    return boss;
}