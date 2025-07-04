// script.js

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const closingMessage = document.getElementById('closing-message');

// Obtiene ID de equipo desde la URL: ?id=equipo1
const params = new URLSearchParams(window.location.search);
const equipoID = params.get('id') || 'equipo1';

// Carga el manual correspondiente
let manualContent = '';

fetch(`manuales/${equipoID}.txt`)
  .then(response => response.text())
  .then(data => {
    manualContent = data;
  });

sendBtn.addEventListener('click', async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage('Tú', userMessage);
  userInput.value = '';

  const fullPrompt = `
Eres un asistente de soporte técnico biomédico.
Usa el siguiente manual como referencia:
${manualContent}

Pregunta del usuario: ${userMessage}

Responde claro, breve y técnico.
Al final de cada conversación, añade:
"Si tiene más dudas, póngase en contacto con el departamento de Ingeniería Biomédica."
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${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}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: fullPrompt }]
    })
  });

  const data = await response.json();
  const botReply = data.choices[0].message.content.trim();
  appendMessage('Asistente', botReply);
});

function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(msgDiv);
}
