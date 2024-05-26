'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('question', {  
      questionId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    choicesOne: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    choicesTwo: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    choicesThree: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    choicesFour: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    correctAnswer: {
      type: Sequelize.STRING,
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
    bossId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'boss',  // Nama tabel yang akan dijadikan referensi
        key: 'bossId',       // Nama kolom pada tabel referensi
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
    

  });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('question');
  }
};
