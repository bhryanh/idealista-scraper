# Guia de Deploy no Render - Idealista Scraper

Este guia explica como fazer deploy da aplicação no Render.

## Configuração no Render

### 1. Criar Web Service

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub/GitLab
4. Configure:
   - **Name**: idealista-scraper
   - **Environment**: Node
   - **Build Command**: `bash render-build.sh`
   - **Start Command**: `npm run server`

### 2. Configurar Variáveis de Ambiente

**⚠️ IMPORTANTE**: Adicione esta variável de ambiente no Render:

```
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
```

Esta variável é **ESSENCIAL** para que o Chrome instalado durante o build seja encontrado durante o runtime.

#### Como adicionar:
1. No seu Web Service, vá em **"Environment"**
2. Adicione as seguintes variáveis:

**Variáveis Essenciais:**
```
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
NODE_ENV=production
PORT=3000
```

**Configuração do MongoDB:**
```
MONGODB_URI=sua-conexão-mongodb-aqui
```

**Configuração do Twilio (WhatsApp):**
```
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+55SEU_NUMERO
```

**Configuração de Busca:**
```
CITY=valencia
PROVINCE=valencia
MAX_PRICE=1800
BEDROOMS=tres
BATHROOMS=dos
AIR_CONDITIONING=true
ALLOW_PETS=false
PUBLISHED_FILTER=hace-48-horas
```

**Configuração do Monitor:**
```
MONITOR_SCHEDULE=0 */4 * * *
MAX_PAGES=3
REQUEST_DELAY_MIN=3000
REQUEST_DELAY_MAX=5000
```

### 3. Deploy

Após configurar as variáveis de ambiente:

1. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
2. Aguarde o build completar (~3-5 minutos no primeiro deploy)
3. Nos próximos deploys será mais rápido (~30s) pois o Chrome fica em cache

## Como Funciona o Cache do Chrome

O script `render-build.sh` está configurado para:

1. **Instalar Chrome uma única vez** no primeiro build
2. **Armazenar em cache** no diretório `/opt/render/.cache/puppeteer`
3. **Reutilizar nos próximos builds** (muito mais rápido!)

O arquivo `.puppeteerrc.cjs` garante que o Puppeteer sempre encontre o Chrome no local correto.

## Verificar se está Funcionando

Após o deploy, acesse os endpoints:

```bash
# Health check
curl https://seu-app.onrender.com/health

# Status detalhado
curl https://seu-app.onrender.com/status

# Trigger manual
curl -X POST https://seu-app.onrender.com/check
```

## Troubleshooting

### Erro: "Could not find Chrome"

**Causa**: A variável `PUPPETEER_CACHE_DIR` não está configurada nas variáveis de ambiente.

**Solução**:
1. Vá em **Environment** no Render
2. Adicione: `PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer`
3. Faça redeploy

### Build muito lento

**Primeira vez**: É normal (~3-5 min) porque precisa baixar o Chrome

**Sempre lento**: Verifique se o cache está funcionando nos logs:
```
✓ Chrome installed at: /opt/render/.cache/puppeteer
```

### Aplicação não responde

Verifique os logs no Render:
1. Vá na aba **"Logs"**
2. Procure por erros de conexão com MongoDB ou Twilio

## Limites do Plano Free

- **750 horas/mês** (suficiente para rodar 24/7)
- **Dorme após 15 min inativo** (primeiro request pode ser lento)
- **Build time limitado**
- **Memória limitada** (~512MB)

Se precisar manter sempre ativo, considere:
- Fazer upgrade para plano pago ($7/mês)
- Ou fazer um cron job externo que pinga a aplicação a cada 10 minutos

## Monitoramento

### Logs em Tempo Real

No Render Dashboard, vá em **"Logs"** para ver:
- Execução do monitor
- Notificações enviadas
- Erros e warnings

### Métricas

Em **"Metrics"** você pode ver:
- CPU usage
- Memory usage
- Request count
- Response times

## Atualizações

Para atualizar a aplicação:

1. Faça commit das mudanças no GitHub
2. O Render fará auto-deploy (se configurado)
3. Ou clique em **"Manual Deploy"**

O cache do Chrome será preservado entre deploys! 🚀

## Custos Estimados

- **Plano Free**: $0/mês (com limitações)
- **Plano Starter**: $7/mês (sem sleep, mais recursos)
- **MongoDB Atlas Free**: $0/mês (512MB)
- **Twilio**: ~$0.005/mensagem WhatsApp

## Suporte

Se tiver problemas:
1. Verifique os logs no Render
2. Teste os endpoints de health
3. Verifique se todas as variáveis de ambiente estão configuradas
