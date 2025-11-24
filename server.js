// Importa a biblioteca Express para criar o servidor HTTP/API
import express from 'express';
// Importa a função que inicializa o banco de dados (SQLite), definida em outro arquivo
import initDB from './database.js';

// Instancia o aplicativo Express
const app = express();

// Middleware para permitir que a API aceite JSON no corpo das requisições (req.body)
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta atual (HTML, CSS, JS do frontend)
app.use(express.static('.'));

// Inicializa (abre/cria) o banco de dados antes de rodar qualquer rota
const db = await initDB();

/*
// Função utilitária (desativada) que adiciona a coluna 'unidade' se precisar atualizar a estrutura
// Pode ser usada para migrar banco antigo sem essa coluna
// async function atualizarBanco() {
//   const db = await initDB();
//   await db.run("ALTER TABLE ingredientes ADD COLUMN unidade TEXT DEFAULT 'g';");
//   console.log("A coluna 'unidade' foi adicionada");
// }
// Descomente e execute uma vez se precisar!
*/

// Rota POST para cadastro de novo ingrediente
app.post('/ingrediente', async (req, res) => {
  // Extrai os campos enviados pelo frontend no corpo (JSON)
  const { nome, peso_total, valor_total, unidade } = req.body;
  // Insere novo ingrediente no banco
  await db.run(
    'INSERT INTO ingredientes (nome, peso_total, valor_total, unidade) VALUES (?, ?, ?, ?)',
    [nome, peso_total, valor_total, unidade]
  );
  // Retorna status 201 (Created), indicando sucesso
  res.sendStatus(201);
});

// Rota POST para registrar o uso do ingrediente em uma receita/produção
app.post('/uso', async (req, res) => {
  // Extrai id do ingrediente e quantidade usada
  const { ingrediente_id, peso_usado } = req.body;
  // Insere registro na tabela de usos, com data/hora do evento automaticamente (datetime("now"))
  await db.run(
    'INSERT INTO usos (ingrediente_id, peso_usado, data) VALUES (?, ?, datetime("now"))',
    [ingrediente_id, peso_usado]
  );
  // Retorna status 201 para indicar sucesso
  res.sendStatus(201);
});

// Rota GET para listar todos os ingredientes, seus dados e o consumo/gasto calculado
app.get('/relatorio', async (_, res) => {
  // Faz consulta SQL que retorna cada ingrediente com os totais já calculados (sub-consultas e LEFT JOIN)
  const ingredientes = await db.all(`
    SELECT i.id, i.nome, i.peso_total, i.valor_total, i.unidade,
      IFNULL(SUM(u.peso_usado), 0) AS usado,
      (i.valor_total * IFNULL(SUM(u.peso_usado),0)/i.peso_total) AS gasto
    FROM ingredientes i
    LEFT JOIN usos u ON u.ingrediente_id = i.id
    GROUP BY i.id
    ORDER BY i.nome COLLATE NOCASE;
  `);
  // Retorna o resultado como JSON (array de ingredientes)
  res.json(ingredientes);
});

// Rota DELETE para remover um ingrediente e todos os usos ligados a ele
app.delete('/ingrediente/:id', async (req, res) => {
  const id = req.params.id;
  // Exclui o ingrediente pelo ID
  await db.run('DELETE FROM ingredientes WHERE id = ?', [id]);
  // Limpa também todos os registros de uso daquele ingrediente (boas práticas de integridade)
  await db.run('DELETE FROM usos WHERE ingrediente_id = ?', [id]);
  // Status 204 indica sucesso sem resposta de corpo
  res.sendStatus(204);
});

// Inicia o servidor na porta 3000 e mostra mensagem no terminal
app.listen(3000, () => console.log('Servidor rodando http://localhost:3000'));
