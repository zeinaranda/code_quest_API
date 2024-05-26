module.exports = (sequelize, DataTypes) => {
    const narrative = sequelize.define('narrative', {
        narrativeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          content: {
            type: DataTypes.TEXT,
            allowNull: false 
          },
          stageId: {
            type: DataTypes.TEXT,
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
        tableName: 'narrative'
    });

    return narrative;
}