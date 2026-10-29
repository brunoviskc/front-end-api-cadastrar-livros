# Sistema de cadastro de livros

Aplicação web simples para cadastrar, listar, alterar e remover livros de uma
biblioteca. O projeto é dividido em:

- **Frontend:** React 19 criado com Create React App, localizado neste
  diretório (`front-end`).
- **Backend:** API REST em Spring Boot, localizada no diretório irmão
  `../biblioteca`.
- **Banco de dados:** PostgreSQL, acessado pelo backend através do banco
  `bibliotecaapi`.

> O frontend e o backend são projetos separados. Para usar a aplicação
> completa, os dois processos precisam estar executando ao mesmo tempo.

## Funcionalidades

### Listagem

Ao abrir a aplicação, o componente `App` faz uma requisição `GET /listar`.
Os livros retornados são armazenados no estado `biblioteca` e exibidos em uma
tabela com:

- título;
- ISBN;
- autor;
- gênero;
- data de publicação;
- botão para selecionar um registro.

### Cadastro

O formulário possui os campos `titulo`, `isbn`, `autor`, `genero` e
`data_publicacao`. Ao clicar em **Cadastrar**, o frontend envia o objeto
preenchido para `POST /cadastrar`.

Quando a API retorna um livro, ele é adicionado à lista local e o formulário é
limpo. Quando a API retorna um objeto com `mensagem`, essa mensagem é exibida
ao usuário.

### Alteração

O botão **Selecionar** preenche o formulário com o livro escolhido e troca o
modo do formulário para edição. O botão **Alterar** envia o registro completo
para `PUT /alterar`. Após o sucesso, o item correspondente é substituído na
lista local.

### Remoção

O botão **Remover** envia `DELETE /remover/{id}`. Após a resposta, o item cujo
`id` corresponde ao registro selecionado é removido da lista local.

### Cancelamento

O botão **Cancelar** restaura o objeto inicial vazio e retorna o formulário ao
modo de cadastro.

## Arquitetura e fluxo de dados

```text
Navegador
   |
   | React (App, Formulario, Tabela)
   |
   | HTTP JSON em http://localhost:8080
   v
Spring Boot
   |
   | Controller -> Service -> Repository
   v
PostgreSQL (bibliotecaapi.tb_biblioteca)
```

### Frontend

- [`src/index.js`](./src/index.js) cria a raiz React, ativa `StrictMode` e
  renderiza `App`.
- [`src/App.js`](./src/App.js) concentra o estado, as chamadas HTTP e as
  operações CRUD.
- [`src/Formulario.js`](./src/Formulario.js) renderiza os campos e os botões
  de cadastro/edição.
- [`src/Tabela.js`](./src/Tabela.js) renderiza a coleção de livros e permite
  selecionar um registro.
- [`src/App.css`](./src/App.css) define a largura e o espaçamento do
  formulário.
- [`src/index.css`](./src/index.css) define estilos globais e fontes.
- [`public/index.html`](./public/index.html) carrega Bootstrap 5.3.3 via CDN e
  fornece o elemento `root`.

O estado principal de `App` é:

| Estado | Finalidade |
|---|---|
| `btnCadastrar` | Indica se o formulário está em modo de cadastro (`true`) ou edição (`false`). |
| `biblioteca` | Lista de livros exibida na tabela. |
| `objBiblioteca` | Livro atualmente preenchido no formulário. |

### Backend

O backend usa Spring Boot, Spring Web MVC, Spring Data JPA, Lombok e o driver
do PostgreSQL.

- [`BibliotecaApplication.java`](../biblioteca/src/main/java/com/example/biblioteca/BibliotecaApplication.java)
  inicializa o Spring Boot.
- [`BibliotecaController.java`](../biblioteca/src/main/java/com/example/biblioteca/controller/BibliotecaController.java)
  expõe os endpoints HTTP e permite requisições originadas de
  `http://localhost:3000`.
- [`BibliotecaService.java`](../biblioteca/src/main/java/com/example/biblioteca/service/BibliotecaService.java)
  valida campos obrigatórios e decide entre cadastro, alteração e exclusão.
- [`BibliotecaRepository.java`](../biblioteca/src/main/java/com/example/biblioteca/repository/BibliotecaRepository.java)
  estende `CrudRepository<BibliotecaModel, Long>`.
- [`BibliotecaModel.java`](../biblioteca/src/main/java/com/example/biblioteca/model/BibliotecaModel.java)
  representa a entidade persistida na tabela `tb_biblioteca`.
- [`RespostaModel.java`](../biblioteca/src/main/java/com/example/biblioteca/model/RespostaModel.java)
  representa respostas simples contendo a propriedade `mensagem`.

## Contrato da API

A URL base usada atualmente pelo frontend é:

```text
http://localhost:8080
```

### `GET /`

Verifica se a API está disponível.

Resposta:

```text
API está funcionando
```

### `GET /listar`

Retorna todos os livros encontrados pelo repositório.

Exemplo:

```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "isbn": "9780000000000",
    "autor": "Machado de Assis",
    "genero": "Romance",
    "data_publicacao": "1899-01-01"
  }
]
```

### `POST /cadastrar`

Recebe um livro em JSON. `titulo`, `isbn`, `autor` e `genero` são validados
como obrigatórios pelo serviço. `data_publicacao` pode ser enviada como uma
data ISO (`YYYY-MM-DD`).

Exemplo de requisição:

```json
{
  "titulo": "Dom Casmurro",
  "isbn": "9780000000000",
  "autor": "Machado de Assis",
  "genero": "Romance",
  "data_publicacao": "1899-01-01"
}
```

Retornos esperados:

- `201 Created` com o livro salvo;
- `400 Bad Request` com `{ "mensagem": "..." }` quando um campo obrigatório
  está vazio.

### `PUT /alterar`

Recebe o livro completo, incluindo `id`, e salva a alteração.

Retorno esperado: `200 OK` com o livro salvo. A mesma validação de campos
obrigatórios usada no cadastro também é aplicada.

### `DELETE /remover/{id}`

Remove o livro identificado pelo `id`.

Retorno esperado:

```json
{
  "mensagem": "Excluido com sucesso!"
}
```

## Modelo de dados

A entidade `BibliotecaModel` é mapeada para `tb_biblioteca`:

| Campo | Tipo Java | Persistência | Observação |
|---|---|---|---|
| `id` | `long` | `BIGINT` gerado | Chave primária e identidade. |
| `titulo` | `String` | `VARCHAR(200)` | Obrigatório na validação do serviço. |
| `isbn` | `String` | `VARCHAR(50)` | Obrigatório na validação do serviço. |
| `autor` | `String` | `VARCHAR(100)` | Obrigatório na validação do serviço. |
| `genero` | `String` | `VARCHAR(50)` | Obrigatório na validação do serviço. |
| `data_publicacao` | `LocalDate` | Data | Não é validada como obrigatória pelo serviço atual. |

O Hibernate está configurado com `ddl-auto=update`, portanto pode atualizar a
estrutura da tabela conforme o mapeamento da entidade. Essa configuração é
conveniente para desenvolvimento, mas deve ser avaliada antes de uso em
produção.

## Pré-requisitos

- Node.js e npm para o frontend;
- Java 25 para o backend, conforme `biblioteca/pom.xml`;
- PostgreSQL em execução;
- banco de dados `bibliotecaapi`;
- credenciais do PostgreSQL configuradas em
  `../biblioteca/src/main/resources/application.properties`.

## Execução local

### 1. Configurar o PostgreSQL

Crie o banco:

```sql
CREATE DATABASE bibliotecaapi;
```

Confira a URL, o usuário e a senha em
`../biblioteca/src/main/resources/application.properties`. O backend está
configurado para `localhost:5432` e usuário `postgres`.

### 2. Iniciar o backend

Em um terminal:

```powershell
cd ..\biblioteca
.\mvnw.cmd spring-boot:run
```

Por padrão, a API deve ficar disponível em `http://localhost:8080`.

### 3. Instalar dependências do frontend

Em outro terminal, neste diretório:

```powershell
npm install
```

### 4. Iniciar o frontend

```powershell
npm start
```

Abra `http://localhost:3000`.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento React. |
| `npm test` | Executa os testes pelo Jest/React Testing Library em modo interativo. |
| `npm run build` | Gera a versão otimizada em `build/`. |
| `npm run eject` | Ejecta a configuração do Create React App; operação irreversível. |

No backend, os comandos Maven Wrapper podem ser executados a partir de
`../biblioteca`, por exemplo:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

## Testes e estado atual

O frontend possui a configuração do Jest em
[`src/setupTests.js`](./src/setupTests.js) e um teste inicial em
[`src/App.test.js`](./src/App.test.js). Esse teste ainda procura o texto
`Learn React`, que não pertence à interface atual de cadastro de livros; ele
precisa ser atualizado para validar o formulário, a tabela e as interações
CRUD.

O backend possui um teste de contexto em
[`BibliotecaApplicationTests.java`](../biblioteca/src/test/java/com/example/biblioteca/BibliotecaApplicationTests.java).
Como ele sobe o contexto completo, a execução depende de uma configuração
válida do PostgreSQL.

## Limitações e pontos de atenção

1. **URL fixa:** o frontend usa diretamente
   `http://localhost:8080`; não há variável de ambiente para trocar a API
   entre desenvolvimento, homologação e produção.
2. **Tratamento de falhas:** as chamadas `fetch` não possuem `catch` nem
   estados visuais de carregamento/erro. Falhas de rede podem não gerar uma
   mensagem clara para o usuário.
3. **Confirmação de exclusão:** a remoção ocorre imediatamente após o clique,
   sem confirmação.
4. **Validação no cliente:** os campos não usam validação HTML obrigatória nem
   validação de formato; a validação principal está no backend.
5. **Status HTTP:** o frontend interpreta o corpo da resposta, mas não
   verifica explicitamente `response.ok`.
6. **Cabeçalho de exclusão:** a requisição DELETE informa
   `Content-type: application.json`, enquanto o tipo MIME correto seria
   `application/json`. Como a requisição não possui corpo, isso pode não
   impedir a exclusão, mas deve ser corrigido se o endpoint passar a depender
   do cabeçalho.
7. **Escopo de CORS:** o backend autoriza somente `http://localhost:3000`.
   A origem deverá ser ajustada para outro host ou porta.
8. **Mensagens compartilhadas:** `RespostaModel` é um bean mutável injetado no
   serviço. Em um cenário concorrente, é mais seguro criar uma resposta nova
   por requisição.
9. **Configuração sensível:** a senha do banco deve permanecer fora do
   controle de versão e ser fornecida por configuração segura no ambiente de
   execução.
10. **Bootstrap e identidade visual:** o HTML ainda usa metadados e título
    padrão do Create React App, embora o produto seja um cadastro de livros.

## Organização dos diretórios

```text
back-end/
├── biblioteca/                 # API Spring Boot
│   ├── src/main/java/
│   │   └── com/example/biblioteca/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       └── service/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── front-end/                  # Aplicação React documentada aqui
    ├── public/
    ├── src/
    ├── package.json
    └── README.md
```

## Fluxo resumido de uma operação

1. O usuário interage com `Formulario` ou `Tabela`.
2. `App` atualiza `objBiblioteca` ou escolhe a operação CRUD.
3. O navegador envia JSON para a API Spring Boot.
4. `BibliotecaController` encaminha a chamada para `BibliotecaService`.
5. O serviço valida os campos e usa `BibliotecaRepository`.
6. O JPA persiste ou consulta `tb_biblioteca` no PostgreSQL.
7. A resposta HTTP volta para `App`, que atualiza a lista exibida.
