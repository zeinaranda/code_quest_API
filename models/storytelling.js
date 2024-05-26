module.exports = (sequelize, DataTypes) => {
    const storytelling = sequelize.define('storytelling', {
        storyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          text: {
            type: DataTypes.TEXT,
            allowNull: false 
          },
          stageId: {
            type: DataTypes.STRING,
          },
          avatarId: {
            type: DataTypes.STRING,
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
        tableName: 'storytelling'
    });

    // storytelling.belongsTo(sequelize.models.stage, {
    //     foreignKey: 'stageId', // Nama kolom foreign key pada tabel "statusorder"
    //     targetKey: 'stageId', // Nama kolom pada tabel "order" yang dijadikan referensi
    //   });

    //   storytelling.belongsTo(sequelize.models.avatar, {
    //     foreignKey: 'avatarId', // Nama kolom foreign key pada tabel "statusorder"
    //     targetKey: 'avatarId', // Nama kolom pada tabel "order" yang dijadikan referensi
    //   });

    return storytelling;
}