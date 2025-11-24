// Importa o driver principal do SQLite para Node.js (permite manipular o arquivo do banco)
import sqlite3 from 'sqlite3';
// Importa a função 'open' do pacote 'sqlite' para abrir/criar o banco de dados usando Promises/async
import { open } from 'sqlite';

// Função assíncrona que inicializa o banco e garante as tabelas necessárias
async function initDB() {
  // Abre (ou cria) o arquivo do banco na pasta db/ingredientes.db e usa sqlite3 como driver
  const db = await open({
    filename: './db/ingredientes.db', // Caminho do arquivo do banco de dados
    driver: sqlite3.Database          // Driver utilizado para conexão SQLite
  });

  // Cria a tabela de ingredientes, caso ainda não exista
  // - id: identificador único, autoincrementa
  // - nome: nome do ingrediente
  // - peso_total: peso comprado total (g ou mL)
  // - valor_total: preço pago pelo ingrediente no peso total
  // - unidade: unidade de medida ("g" ou "mL")
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ingredientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      peso_total REAL,
      valor_total REAL,
      unidade TEXT
    );
  `);

  // Cria a tabela de usos, caso ainda não exista
  // - id: identificador único do uso
  // - ingrediente_id: referencia o ingrediente utilizado
  // - peso_usado: quantidade usada na receita/lote
  // - data: data/hora do registro do uso
  // - FOREIGN KEY: garante que só ingredientes existentes podem ser usados
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ingrediente_id INTEGER,
      peso_usado REAL,
      data TEXT,
      FOREIGN KEY(ingrediente_id) REFERENCES ingredientes(id)
    );
  `);

  // Retorna o objeto de conexão para uso em outras partes do sistema (consultas, inserções, exclusões etc)
  return db;
}

// Exporta a função initDB para ser usada em outros arquivos (ex: server.js)
export default initDB;