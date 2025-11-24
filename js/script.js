// Função para cadastrar um novo ingrediente
async function cadastrarIngrediente() {
  // Pega os valores dos inputs do formulário
  const nome = document.getElementById('nome').value;
  const peso = parseFloat(document.getElementById('peso').value);
  const valor = parseFloat(document.getElementById('valor').value);
  const unidade = document.getElementById('unidade').value;

  // Validação para evitar cadastro de campos vazios ou inválidos
  if (!nome.trim() || isNaN(peso) || peso <= 0 || isNaN(valor) || valor < 0 || !unidade) {
    alert("Informe todos os campos corretamente!");
    return;
  }

  // Envia requisição POST para o backend salvar o ingrediente
  await fetch('/ingrediente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, peso_total: peso, valor_total: valor, unidade })
  });
  // Atualiza a lista de ingredientes na tela (tabela)
  atualizarLista();
  // Atualiza o select de ingredientes no formulário de uso
  atualizarSelectIngredientes();

  // Limpa os campos para o próximo cadastro
  document.getElementById('nome').value = '';
  document.getElementById('peso').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('unidade').value = 'g';
}

// Função para registrar o uso de um ingrediente (baixa no estoque)
async function registrarUso() {
  // Pega o ID do ingrediente selecionado e o valor usado informado
  const ingrediente_id = document.getElementById('ingrediente').value;
  const peso_usado = parseFloat(document.getElementById('pesoUso').value);

  // Envia requisição POST para registrar o uso no banco
  await fetch('/uso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingrediente_id, peso_usado })
  });
  // Atualiza a tabela após registrar uso
  atualizarLista();
}

// Função para preencher/atualizar a tabela de ingredientes (listagem na tela)
async function atualizarLista() {
  // Busca todas as informações do backend
  const res = await fetch('/relatorio');
  const dados = await res.json();
  const tabela = document.getElementById('tabelaIngredientes');
  tabela.innerHTML = ''; // Limpa a tabela antes

  // Percorre cada ingrediente retornado e monta as linhas da tabela
  dados.forEach(linha => {
    const unidade = linha.unidade || 'g';
    tabela.innerHTML += `
      <tr>
        <td>${linha.nome}</td>
        <td>${Number(linha.peso_total)} ${unidade}</td>
        <td>R$ ${Number(linha.valor_total).toFixed(2)}</td>
        <td>${Number(linha.usado)} ${unidade}</td>
        <td>R$ ${Number(linha.gasto).toFixed(2)}</td>
        <td><button onclick="excluirIngrediente(${linha.id})">Excluir</button></td>
      </tr>`;
  });
}

// Função para atualizar o select (lista) dos ingredientes disponíveis no registro de uso
async function atualizarSelectIngredientes() {
  const res = await fetch('/relatorio');
  const dados = await res.json();
  const select = document.getElementById('ingrediente');
  select.innerHTML = ''; // Limpa antes de preencher

  // Adiciona cada ingrediente como opção no select
  dados.forEach(ingrediente => {
    select.innerHTML += `<option value="${ingrediente.id}">${ingrediente.nome}</option>`;
  });
}

// Ao carregar a página, já exibe a lista/tabela e preenche o select de ingredientes
document.addEventListener('DOMContentLoaded', () => {
  atualizarLista();
  atualizarSelectIngredientes();
});

// Função para excluir um ingrediente pelo ID (acionada no botão "Excluir")
async function excluirIngrediente(id) {
  await fetch(`/ingrediente/${id}`, {
    method: 'DELETE'
  });
  // Atualiza lista e select depois de deletar
  atualizarLista();
  atualizarSelectIngredientes();
}

// Evento: toda vez que mudar o select de ingrediente, atualiza o placeholder do input de uso
document.getElementById('ingrediente').addEventListener('change', atualizarPlaceholderUnidade);

// Função para atualizar o placeholder do campo de uso conforme unidade do ingrediente selecionado
async function atualizarPlaceholderUnidade() {
  const select = document.getElementById('ingrediente');
  const ingredienteId = select.value;
  if (!ingredienteId) return;

  const res = await fetch('/relatorio');
  const dados = await res.json();
  const ingrediente = dados.find(item => item.id == ingredienteId);
  const unidade = ingrediente ? (ingrediente.unidade || 'g') : 'g';
  // Altera o placeholder para informar se é grama ou ml
  document.getElementById('pesoUso').placeholder = unidade === 'g' ? "Peso usado (g)" : "Quantidade usada (mL)";
  // Se existir um span (não mostrado no HTML), poderia atualizar aqui também
  // document.getElementById('unidadeUso').innerText = unidade;
}
