// Importando os módulos necessários
const http = require('http');
const express = require('express');
const fetch = require('isomorphic-fetch');


const OPENAI_API_KEY = "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";

// Definindo variáveis e constantes
const app = express();
const port = process.env.PORT || 3000;

// Definindo rotas do aplicativo
app.get('/', async (req, res) => {
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
        prompt: "hello Gpt",
        max_tokens: 2048, // tamanho da resposta
        temperature: 0.5, // criatividade na resposta
      }),
    });

    const data = await response.json();
    console.log(data.choice)

    res.send(data.choice);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter resposta da API.');
  }
});

// Iniciando o servidor
http.createServer(app).listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
