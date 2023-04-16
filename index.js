// Importando os módulos necessários
const http = require('http');
const express = require('express');
const fetch = require('isomorphic-fetch');

const OPENAI_API_KEY = "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";

// Definindo variáveis e constantes
const app = express();
const port = process.env.PORT || 3000;

// Definindo rotas do aplicativo
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>OpenAI API Demo</title>
      </head>
      <body>
        <form action="/" method="POST">
          <label for="message">Digite uma mensagem:</label>
          <input type="text" id="message" name="message" />
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
    console.log(textFormat)
    
    res.send(`
      <html>
        <head>
          <title>OpenAI API Demo</title>
        </head>
        <body>
          <form action="/" method="POST">
            <label for="message">Escreva o texto que você quer formatar:</label>
            <input type="text" id="message" name="message" value="${message}" />
            <button type="submit">Enviar</button>
          </form>
          ${textFormat}
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