const http = require('http');
const express = require('express');
const fetch = require('isomorphic-fetch');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.API_KEY;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
// Definindo rotas do aplicativo
app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
    <link href="styles.css" rel="stylesheet"/>
    <title>OpenAI API Demo</title>
  </head>
      <body>
        <form action="/" method="POST">
          <label class="Text" for="message">Digite seu texto para formatar:</label>
          <input type="text" id="message" name="message" autocomplete="off"/>
          <button type="submit">Enviar</button>
        </form>
      </body>
    </html>
  `);
});

// Adicionando middleware express.urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: "formate este texto e tire todos os elementos que nao importam no texto tipo highligth ou posiçao" + message,
        max_tokens: 2048, // tamanho da resposta
        temperature: 0.5, // criatividade na resposta
      }),
    });

    const data = await response.json();
    const textFormat = data.choices[0].text.trim().split('.').map(p => `<p>${p.trim()}</p>`).join('');
    
    res.send(`
      <html>
        <head>
          <link href="styles.css" rel="stylesheet"/>
          <title>OpenAI API Demo</title>
          <script>
          function copiarTexto() {
            const textoFormatado = document.getElementById("texto-formatado").textContent;
            navigator.clipboard.writeText(textoFormatado)
              .then(() => {
                alert("Texto copiado para a área de transferência!");
              })
              .catch((err) => {
                alert("Erro ao copiar texto: " + err);
              });
          }
          </script>
        </head>
        <body>
          <form action="/" method="POST">
            <label for="message">Escreva o texto que você quer formatar:</label>
            <input type="text" id="message" name="message" value="${message}" />
            <button type="submit">Enviar</button>
          </form>
          <div id="texto-formatado">${textFormat}</div>
          <button onclick="copiarTexto()">Copiar</button>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter resposta da API.');
  }
});

// Iniciando o servidor
http.createServer(app).listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});