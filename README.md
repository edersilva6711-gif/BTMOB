# BTMob Online Real - Deploy Grátis

## 1. Subir em Render.com (grátis, 2 minutos)
1. Crie conta em https://render.com
2. Clique em **New +** → **Web Service**
3. Conecte seu GitHub ou faça upload manual
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Port:** `3000` (Render detecta automaticamente via process.env.PORT)
5. Deploy → vai gerar URL tipo `https://btmob-online-xxxx.onrender.com`

## 2. Alternativa Railway.app
1. https://railway.app → New Project → Deploy from GitHub
2. Mesmo `npm install` / `npm start`

## 3. Depois do deploy, me envie a URL (ex: https://btmob-xxxx.onrender.com)
Eu patcho o BTMob para apontar `163.245.204.10` → sua URL e fica ONLINE REAL.

## 4. Teste local antes:
```
npm install
npm start
# Testar: http://localhost:3000/api/master/users
```

## 5. Arquivos:
- `server.js` - servidor Express
- `master.db.json` - será criado automaticamente com edersilva6711@gmail.com
- `package.json`

## 6. Para o BTMob funcionar online:
O HTML patchado já tem interceptor que redireciona. Basta trocar 1 linha:
`const API='http://localhost:8765'` → `const API='https://sua-url.onrender.com'`
