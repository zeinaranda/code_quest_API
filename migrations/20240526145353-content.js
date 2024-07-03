'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('content', {  
      contentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    courseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'course',  // Nama tabel yang akan dijadikan referensi
        key: 'courseId',       // Nama kolom pada tabel referensi
    },
  },
    
  });

 },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('content');
  }
};