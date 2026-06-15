'use strict';

   module.exports = {
     up: async (queryInterface, Sequelize) => {
       await queryInterface.addColumn('Socios', 'plan_nombre', {
         type: Sequelize.STRING,
         allowNull: true
       });
       await queryInterface.addColumn('Socios', 'plan_precio', {
         type: Sequelize.INTEGER,
         allowNull: true
       });
     },

     down: async (queryInterface, Sequelize) => {
       await queryInterface.removeColumn('Socios', 'plan_nombre');
       await queryInterface.removeColumn('Socios', 'plan_precio');
     }
   };
