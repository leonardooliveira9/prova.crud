const Registro = require('../models/Registro');
const { Op } = require('sequelize');

// GET /registros
exports.listarRegistros = async (req, res) => {
  try {
    const registros = await Registro.findAll({
      order: [['data_hora_entrada', 'DESC']]
    });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar registros' });
  }
};

// POST /entrada
exports.registrarEntrada = async (req, res) => {
  try {
    const { placa, modelo } = req.body;
    const novo = await Registro.create({
      placa,
      modelo,
      data_hora_entrada: new Date()
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar entrada' });
  }
};

// PUT /pagamento/:id
exports.registrarPagamento = async (req, res) => {
  try {
    const { valor_pago } = req.body;
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ erro: 'Registro não encontrado' });

    registro.data_hora_pagamento = new Date();
    registro.valor_pago = valor_pago;
    await registro.save();

    res.json(registro);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar pagamento' });
  }
};

// PUT /saida/:id
exports.registrarSaida = async (req, res) => {
  try {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ erro: 'Registro não encontrado' });

    registro.data_hora_saida = new Date();
    await registro.save();

    res.json(registro);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar saída' });
  }
};

// GET /relatorio/ativos
exports.veiculosAtivos = async (req, res) => {
  try {
    const ativos = await Registro.findAll({ where: { data_hora_saida: null } });
    res.json(ativos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar veículos ativos' });
  }
};

// GET /relatorio/movimento?data=2025-06-23
exports.movimentoDoDia = async (req, res) => {
  try {
    const { data } = req.query;
    const inicio = new Date(`${data}T00:00:00`);
    const fim = new Date(`${data}T23:59:59`);

    const entradas = await Registro.count({
      where: {
        data_hora_entrada: { [Op.between]: [inicio, fim] }
      }
    });

    const saidas = await Registro.count({
      where: {
        data_hora_saida: { [Op.between]: [inicio, fim] }
      }
    });

    res.json({ data, entradas, saidas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar movimento do dia' });
  }
};

// GET /relatorio/faturamento?inicio=2025-06-01&fim=2025-06-23
exports.faturamento = async (req, res) => {
  try {
    const { inicio, fim } = req.query;
    const resultado = await Registro.findAll({
      where: {
        data_hora_pagamento: {
          [Op.between]: [new Date(inicio), new Date(fim)]
        }
      }
    });

    const total = resultado.reduce((soma, r) => soma + parseFloat(r.valor_pago || 0), 0);
    res.json({ total_faturado: total.toFixed(2), registros: resultado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao calcular faturamento' });
  }
};
