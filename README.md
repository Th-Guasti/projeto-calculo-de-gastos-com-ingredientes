### Controle de custos
Este sistema permite controlar ingredientes, usos, estoque e calcular o custo de produção para pequenas cozinhas, negócios caseiros e confeitaria. Possui interface moderna, calculadora integrada, cadastro de ingredientes, registro de uso e tabela para visualização.

## Funcionalidades
- Cadastro de ingredientes (nome, peso, valor, unidade)
- Registro de uso de cada ingrediente
- Tabela interativa para consulta, edição e remoção

## Tecnologias utilizadas
- Node.js
- Express.js
- SQLite3 (armazenamento local)
- HTML5/CSS3/JS puro (frontend)

## Instalação (desenvolvimento local)
1. Clone o repositório:
git clone <url>
cd <nome_da_pasta>

2. Instale as dependências:
npm install

3. (Opcional) Crie o arquivo do banco de dados vazio:
mkdir db
copy nul db\ingredientes.db # Windows
ou
touch db/ingredientes.db # Linux/macOS

4. Inicie o servidor:
npm start

5. Acesse no navegador:
http://localhost:3000

## Observações
O arquivo db/ingredientes.db NÃO está versionado. Cada usuário pode criar o seu para uso próprio.

## Dependências
- express
- sqlite

Instale tudo automaticamente com npm install.

## Licença
MIT. Use e adapte livremente para fins pessoais ou comerciais.