module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        courseId: {
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
        tableName: 'course'
    });

  //   Course.belongsTo(sequelize.models.Stage, {
  //       foreignKey: 'stageId', // Nama kolom foreign key pada tabel "statusorder"
  //       targetKey: 'stageId', // Nama kolom pada tabel "order" yang dijadikan referensi
  // });

    return Course;
}