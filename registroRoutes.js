const express = require('express');
const router = express.Router();
const controller = require('../controllers/registroController');

router.post('/entrada', controller.registrarEntrada);
router.put('/pagamento/:id', controller.registrarPagamento);
router.put('/saida/:id', controller.registrarSaida);
router.get('/registros', controller.listarRegistros);
router.get('/relatorio/ativos', controller.veiculosAtivos);
router.get('/relatorio/movimento', controller.movimentoDoDia);
router.get('/relatorio/faturamento', controller.faturamento);

module.exports = router;
