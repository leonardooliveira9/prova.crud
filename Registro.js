const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registro = sequelize.define('Registro', {
  placa: { type: DataTypes.STRING, allowNull: false },
  modelo: { type: DataTypes.STRING },
  data_hora_entrada: { type: DataTypes.DATE, allowNull: false },
  data_hora_pagamento: { type: DataTypes.DATE },
  valor_pago: { type: DataTypes.DECIMAL(10, 2) },
  data_hora_saida: { type: DataTypes.DATE }
}, {
  tableName: 'registros',
  timestamps: false
});

module.exports = Registro;
