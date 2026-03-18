const express = require('express')
const app = express()
app.use(express.json())

const { routeMessage } = require('./agents/router')
const { sendMessage } = require('./whatsapp/zapi')

// ─── Webhook Z-API ─────────────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  res.sendStatus(200) // responde imediatamente para a Z-API não reenviar

  try {
    const payload = req.body

    // Z-API envia diferentes tipos de evento — só processa mensagens de texto
    if (!payload.text || payload.fromMe) return

    const phone   = payload.phone        // ex: "5511999999999"
    const message = payload.text.message // texto da mensagem

    console.log(`[ENTRADA] ${phone}: ${message}`)

    const resposta = await routeMessage(phone, message)

    if (resposta) {
      await sendMessage(phone, resposta)
      console.log(`[SAÍDA]   ${phone}: ${resposta.substring(0, 80)}...`)
    }
  } catch (err) {
    console.error('[ERRO webhook]', err.message)
  }
})

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', bot: 'Prosperidad Digital' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
