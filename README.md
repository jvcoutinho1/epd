# 🤖 Prosperidad Digital — WhatsApp Bot

Agentes SDR Closer + Suporte rodando 24/7 no WhatsApp via Z-API + Claude API.

---

## ⚡ Deploy em 5 passos (Railway)

### Passo 1 — Suba o projeto no GitHub
```bash
git init
git add .
git commit -m "primeiro deploy"
git remote add origin https://github.com/SEU_USUARIO/prosperidad-bot.git
git push -u origin main
```

### Passo 2 — Crie o projeto no Railway
1. Acesse https://railway.app e faça login
2. Clique em **New Project → Deploy from GitHub repo**
3. Selecione seu repositório
4. Railway detecta automaticamente que é Node.js e faz o deploy

### Passo 3 — Configure as variáveis de ambiente no Railway
No painel do Railway → **Variables**, adicione:

| Variável | Valor |
|----------|-------|
| `ANTHROPIC_API_KEY` | Sua chave da Anthropic |
| `ZAPI_INSTANCE` | ID da instância Z-API |
| `ZAPI_TOKEN` | Token da instância Z-API |
| `DONO_PHONE` | Seu número (ex: 5511999999999) |

### Passo 4 — Copie a URL do Railway
No painel Railway → **Settings → Domains**, copie a URL gerada.
Exemplo: `https://prosperidad-bot-production.up.railway.app`

### Passo 5 — Configure o Webhook na Z-API
1. Acesse https://app.z-api.io
2. Selecione sua instância
3. Vá em **Webhooks**
4. Cole a URL: `https://SUA-URL.up.railway.app/webhook`
5. Ative o webhook para **Mensagens recebidas**
6. Salve

✅ **Pronto! O bot está no ar.**

---

## 🧪 Teste local (desenvolvimento)

```bash
# Clone o projeto
git clone https://github.com/SEU_USUARIO/prosperidad-bot.git
cd prosperidad-bot

# Instale as dependências
npm install

# Copie o arquivo de variáveis
cp .env.example .env
# Edite o .env com suas chaves reais

# Rode em modo desenvolvimento
npm run dev
```

Para testar o webhook localmente, use o [ngrok](https://ngrok.com):
```bash
ngrok http 3000
# Copie a URL https:// gerada e cole no Z-API como webhook
```

---

## 🗂️ Estrutura do projeto

```
prosperidad-bot/
├── server.js              ← servidor principal (webhook Z-API)
├── agents/
│   ├── router.js          ← decide qual agente responde + chama Claude
│   ├── sdr.js             ← prompt completo do SDR Closer
│   └── suporte.js         ← prompt completo do Agente de Suporte
├── db/
│   ├── conversations.js   ← histórico de conversas (JSON local)
│   └── conversations.json ← gerado automaticamente
├── whatsapp/
│   └── zapi.js            ← integração Z-API
├── .env.example           ← modelo das variáveis de ambiente
├── package.json
└── README.md
```

---

## 🔄 Lógica de roteamento

```
Mensagem chega
    │
    ├── Contato novo ou type='lead' → Agente SDR Closer
    ├── Contato marcado como 'aluno' → Agente Suporte
    │
    └── Durante a conversa:
        ├── SDR detecta problema técnico → [TRANSFER:suporte]
        ├── Suporte detecta interesse em comprar → [TRANSFER:sdr]
        └── Qualquer agente detecta situação crítica → [ESCALAR:humano]
                                                        └── Notifica seu WhatsApp
```

---

## ✏️ Como marcar um contato como aluno

Edite o arquivo `db/conversations.json` e adicione/altere o campo `type`:

```json
{
  "5511999999999": {
    "agent": "suporte",
    "type": "aluno",
    "country": "BR",
    "messages": []
  }
}
```

> **Futuro:** integre com a API do Hotmart para importar automaticamente a lista de alunos.

---

## 💰 Custo estimado (mensagem)

| Volume | Custo Claude (Sonnet) |
|--------|-----------------------|
| 1.000 mensagens/mês | ~R$ 15-30 |
| 5.000 mensagens/mês | ~R$ 75-150 |
| 10.000 mensagens/mês | ~R$ 150-300 |

Z-API: ~R$ 100-150/mês fixo
Railway: ~R$ 25-50/mês fixo

---

## 🚀 Próximos passos sugeridos

- [ ] Integrar com API do Hotmart para sincronizar alunos automaticamente
- [ ] Adicionar agendamento automático de follow-ups (D+1, D+3, D+7)
- [ ] Dashboard simples para visualizar conversas e métricas
- [ ] Agente Gerente que consolida relatórios diários
