const API_URL = '/api/registros';

const form = document.getElementById('form-registro');
const tabela = document.getElementById('tabela-registros');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value.trim();
  const modelo = document.getElementById('modelo').value.trim();

  if (!placa) {
    alert('A placa é obrigatória');
    return;
  }

  console.log('Tentando registrar entrada:', { placa, modelo });

  try {
    const response = await fetch('/api/entrada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa,
        modelo
      })
    });

    console.log('Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro no servidor');
    }

    const data = await response.json();
    console.log('Registro criado:', data);

    form.reset();
    carregarRegistros();
  } catch (error) {
    console.error('Erro detalhado:', error);
    alert('Erro ao registrar entrada: ' + error.message);
  }
});

async function carregarRegistros() {
  try {
    const response = await fetch('/api/registros');
    const registros = await response.json();

    tabela.innerHTML = '';

    registros.forEach(reg => {
      const entrada = new Date(reg.data_hora_entrada).toLocaleString('pt-BR');
      const saida = reg.data_hora_saida ? new Date(reg.data_hora_saida).toLocaleString('pt-BR') : '—';
      const valor = reg.valor_pago ? `R$ ${parseFloat(reg.valor_pago).toFixed(2)}` : '—';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${reg.placa}</td>
        <td>${reg.modelo || ''}</td>
        <td>${entrada}</td>
        <td>${saida}</td>
        <td>${valor}</td>
        <td>
          ${!reg.data_hora_saida ? `<button class="action-btn exit-btn" onclick="registrarSaida(${reg.id}, '${reg.data_hora_entrada}')">Registrar Saída</button>` : ''}
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
  }
}

async function registrarSaida(id, entradaStr) {
  const entrada = new Date(entradaStr);
  const saida = new Date();

  const diffMs = saida - entrada;
  const horas = Math.ceil(diffMs / (1000 * 60 * 60));
  const valor = horas * 5;

  try {
    // Primeiro registrar o pagamento
    await fetch(`/api/pagamento/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valor_pago: valor
      })
    });

    // Depois registrar a saída
    await fetch(`/api/saida/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    carregarRegistros();
  } catch (error) {
    alert('Erro ao registrar saída: ' + error.message);
  }
}

async function deletarRegistro(id) {
  if (!confirm('Tem certeza que deseja excluir este registro?')) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  carregarRegistros();
}

carregarRegistros();
