'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('knowledgeDone', {  
      knowledgeDoneId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    quizDone: {
      type: Sequelize.BOOLEAN,
      allowNull: false 
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false 
    },
    time: {
      type: Sequelize.TIME,
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
    knowledgeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'knowledge',  // Nama tabel yang akan dijadikan referensi
        key: 'knowledgeId',       // Nama kolom pada tabel referensi
    },
    },


  });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('knowledgeDone');
  }
};
