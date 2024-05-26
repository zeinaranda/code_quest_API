module.exports = (sequelize, DataTypes) => {
    const question = sequelize.define('question', {
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          content: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          choicesOne: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          choicesTwo: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          choicesThree: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          choicesFour: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          correctAnswer: {
            type: DataTypes.STRING,
            allowNull: false 
          },
          bossId: {
            type: DataTypes.STRING,
          },
          knowledgeId: {
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
        tableName: 'question'
    });

    // question.belongsTo(sequelize.models.boss, {
    //     foreignKey: 'bossId', // Nama kolom foreign key pada tabel "statusorder"
    //     targetKey: 'bossId', // Nama kolom pada tabel "order" yang dijadikan referensi
    //   });

    //   question.belongsTo(sequelize.models.knowledge, {
    //     foreignKey: 'knowledgeId', // Nama kolom foreign key pada tabel "statusorder"
    //     targetKey: 'knowledgeId', // Nama kolom pada tabel "order" yang dijadikan referensi
    //   });

    return question;
}