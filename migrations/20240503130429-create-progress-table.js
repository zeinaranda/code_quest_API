'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('progress', {  
      progressId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    stageOne: {
      type: Sequelize.FLOAT,
    },
    stageTwo: {
      type: Sequelize.FLOAT,
    },
    stageThree: {
      type: Sequelize.FLOAT,
    },
    stageFour: {
      type: Sequelize.FLOAT,
    },
    stageFive: {
      type: Sequelize.FLOAT,
    },
    stageSix: {
      type: Sequelize.FLOAT,
    },
    stageSeven: {
      type: Sequelize.FLOAT,
    },
    stageEIght: {
      type: Sequelize.FLOAT,
    },
    stageNine: {
      type: Sequelize.FLOAT,
    },
    ranking: {
      type: Sequelize.INTEGER,
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
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',  // Nama tabel yang akan dijadikan referensi
        key: 'userId',       // Nama kolom pada tabel referensi
    },
  },


  });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('progress');
  }
};
