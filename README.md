# certificados-voluntarios-oficina2

Sistema para cadastro e geração de termos de adesão de alunos voluntários do projeto de extensão ELLP – Ensino Lúdico de Lógica e Programação, desenvolvido na disciplina Oficina de Integração 2 com foco em atividades extensionistas.

## Ferramentas e Tecnologias

### Frontend

- React
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Puppeteer

### Testes

- Vitest

### Versionamento de Código

- Git
- GitHub

### Gerenciamento de Projeto

- Trello

## Atributos

**Alunos**
- Id
- Nome
- CPF
- Data de nascimento
- Estudante da UTFPR (SIM OU NÃO)
- Curso
- Período
- RA
- Endereço
- Cidade
- Estado
- Telefone
- Email

**Termos de adesão**

- Id
- Instituição
- Câmpus
- Título da ação
- Modalidade
- Data de Início
- Data de Término
- Nome Coordenação
- CPF Coordenação
- Departamento
- Telefone Coordenação
- Email Coordenação
- Atividades a serem desenvolvidas
- Condições Gerais

## Requisitos Funcionais

**CRUD de Alunos**

- O sistema deve permitir o cadastro de alunos com os seguintes dados: nome, CPF, data de nascimento, estudante da UTFPR (sim ou não), curso, período, RA, endereço, cidade, estado, telefone e e-mail.
- O sistema deve permitir listar todos os alunos cadastrados.
- O sistema deve permitir a edição dos dados de um aluno.
- O sistema deve permitir a exclusão de alunos.

**CRUD de Termos de Adesão**

- O sistema deve permitir o cadastro de termos de adesão com os seguintes dados: instituição, câmpus, título da ação, modalidade, data de início, data de término, nome da coordenação, CPF da coordenação, departamento, telefone da coordenação, e-mail da coordenação, atividades a serem desenvolvidas e condições gerais.
- O sistema deve permitir listar todos os termos de adesão cadastrados.
- O sistema deve permitir a edição dos dados de um termo de adesão.
- O sistema deve permitir a exclusão de termos de adesão.

**Associação de Termos de Adesão a Alunos**

- O sistema deve permitir selecionar um termo de adesão existente.
- O sistema deve permitir selecionar um ou mais alunos para associar ao termo de adesão.
- O sistema deve permitir gerar termos de adesão personalizados (individualmente ou em lote) para os alunos selecionados.

**Geração e Download de Termos de Adesão**

O sistema deve gerar termos de adesão em formato PDF com texto padronizado contendo os dados do aluno e da ação, incluindo:

- Nome
- CPF
- Curso e RA
- Título da ação
- Modalidade
- Período da atividade
- Informações da coordenação

**Atividades e condições gerais**

O sistema deve permitir o download dos termos de adesão gerados, individualmente ou em lote (formato ZIP).

## Interface do Usuário

A aplicação deve fornecer uma interface intuitiva para:
Gerenciar alunos e termos de adesão (CRUD)
Selecionar alunos e termos de adesão
Gerar e baixar os termos de adesão

**_Arquitetura Geral da Aplicação_**\
Estrutura de Pastas

![](https://i.ibb.co/JR9tNhqN/Estrutura-Pastas.png)

**_Diagrama de Arquitetura (Camadas)_**

![](https://i.ibb.co/Y7zKgcGV/Diagrama-de-Arquitetura-Camadas.png)

## Como instalar e executar o projeto

### Clonar repositório:

git clone https://github.com/Cintrex01/certificados-voluntarios-oficina2.git

### Instalar dependências:

**_/frontend:_**

- cd certificados-voluntarios-oficina2/frontend
- npm install

**_/backend:_**

- cd ../backend
- npm install

### Configurar variáveis de ambiente:

- Na pasta backend, crie um arquivo .env com o seguinte conteúdo:
- DATABASE_URL=coloque_aqui_sua_url_do_mongodb

### Executar testes no /backend:

- cd backend
- npx vitest run

### Iniciar os servidores:

**_/frontend:_**

- cd frontend
- npm run dev

**_/backend:_**

- cd backend
- node --watch src/server.js
