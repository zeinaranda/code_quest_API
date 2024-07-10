'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('friend', {  
      friendId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model : {
          tableName: "user"
        },
        
         // Nama tabel yang akan dijadikan referensi
        key: 'userId',       // Nama kolom pada tabel referensi
    },
  },
  friendUserId: {
    type: Sequelize.INTEGER,
    references: {
    model : {
      tableName: "user"
    },
    
     // Nama tabel yang akan dijadikan referensi
    key: 'userId',       // Nama kolom pada tabel referensi
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
    await queryInterface.dropTable('friend');
  }
};
