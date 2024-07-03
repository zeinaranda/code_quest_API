'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bossDone', {  
      bossDoneId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    quizDone: {
      type: Sequelize.BOOLEAN,
      allowNull: false 
    },
    point: {
      type: Sequelize.INTEGER,
      allowNull: false 
    },
    koin: {
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
    bossId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'boss',  // Nama tabel yang akan dijadikan referensi
        key: 'bossId',       // Nama kolom pada tabel referensi
    },
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
    await queryInterface.dropTable('bossDone');
  }
};
