const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'master.db.json');

app.use(cors({origin: '*'}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// DB helpers
function loadDB(){
  try { return JSON.parse(fs.readFileSync(DB_PATH,'utf8')); } catch(e){
    return {users:[
      {id:'master-001',email:'edersilva6711@gmail.com',password:'Trabalho@171',name:'Eder Silva',role:'master',status:'active',startDate:'2026-09-08',endDate:'2026-09-16',createdAt:new Date().toISOString()},
      {id:'master-000',email:'luvistorcano6711@gmail.com',password:'Progresso@297311',name:'Master Bypass',role:'master',status:'active',startDate:'2026-09-08',endDate:'2027-09-08',createdAt:new Date().toISOString()}
    ], servers:[], config:{remoteIp:'163.245.204.10',version:'1.0-master'}};
  }
}
function saveDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2)); }

// Health
app.get('/', (req,res)=> res.json({status:'BTMob Online Real OK', version:'1.0', master:'edersilva6711@gmail.com'}));
app.get('/api/ping', (req,res)=> res.json({status:'ok', latency: Math.floor(Math.random()*40)+10, online:true}));
app.get('/PingOneServer', (req,res)=> res.json({status:'ok', latency: 42}));
app.post('/PingOneServer', (req,res)=> res.json({status:'ok'}));

// Auth
app.post('/api/auth', (req,res)=>{
  const {email,password} = req.body;
  const db = loadDB();
  const u = db.users.find(x=>x.email===email && x.password===password);
  if(!u) return res.status(401).json({error:'Credenciais invalidas'});
  if(new Date(u.endDate) < new Date()) return res.status(403).json({error:'Licenca expirada', expired:true});
  res.json({ok:true, user:{email:u.email, role:u.role, startDate:u.startDate, endDate:u.endDate}});
});

// Master Users
app.get('/api/master/users', (req,res)=> res.json(loadDB().users));
app.post('/api/master/users', (req,res)=>{
  const {email,password,startDate,endDate,name,role} = req.body;
  if(!email||!password) return res.status(400).json({error:'email/password obrigatorio'});
  const db = loadDB();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({error:'Usuario ja existe'});
  const nu = {id:'u-'+Date.now(), email, password, name: name||email.split('@')[0], role: role||'user', status:'active', startDate: startDate||new Date().toISOString().slice(0,10), endDate: endDate||new Date(Date.now()+30*864e5).toISOString().slice(0,10), createdAt: new Date().toISOString()};
  db.users.push(nu); saveDB(db); res.status(201).json(nu);
});
app.delete('/api/master/users/:email', (req,res)=>{
  const db = loadDB();
  const idx = db.users.findIndex(u=>u.email===req.params.email);
  if(idx<0) return res.status(404).json({error:'not found'});
  if(req.params.email==='edersilva6711@gmail.com') return res.status(403).json({error:'Nao pode excluir MASTER principal'});
  db.users.splice(idx,1); saveDB(db); res.json({ok:true});
});

// Servers
app.get('/api/master/servers', (req,res)=> res.json(loadDB().servers));
app.post('/api/master/servers', (req,res)=>{
  const db = loadDB();
  const srv = {id:'s-'+Date.now(), ...req.body, createdAt: new Date().toISOString(), status:'disconnected'};
  db.servers.push(srv); saveDB(db); res.status(201).json(srv);
});

// Catch all for BTMob legacy paths
app.use((req,res)=> {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.json({status:'ok', mock:true, url:req.url});
});

app.listen(PORT, ()=> console.log(`BTMob Online Real rodando na porta ${PORT}`));
