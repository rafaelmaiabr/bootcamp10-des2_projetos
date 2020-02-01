const express = require('express');

const server = express();

server.use(express.json());

//Middleware Global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}; IP: ${req.ip}`);

  next();

  console.timeEnd('Request');
});
/*
Middleware Global | Fim
Middleware Local | Início
*/
function checkProjectExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({error: 'Project title is required!'});
  }

  return next();
};

function checkProjectInArray(req, res, next) {
  const Project = Projects[req.params.index];

  if (!Project) {
    return res.status(400).json({error: 'Project does not exists!'})
  }

  req.Project = Project;

  return next();
}
//Middleware Local | Fim
//id:"2",title:"Criação de site",tasks:["Criação","Aprovação","Testes finais","Publicação"]

const Projects = [
  //{id:1,title:"website x",tasks:["Aprovação Layout","Testes","Publicação"]},
  {id:2,title:"Loja virtual y",tasks:["Ĩnstalação","Gatway de pagamento"]}
];

server.get('/Projects', (req, res) => {
  return res.json(Projects);
});

server.get('/Projects/:index', checkProjectInArray, (req, res) =>{
  return res.json(req.Project);
});

server.post('/Projects', checkProjectExists, (req, res) => {
  var { id } = Projects[Projects.length-1];
  if (!req.body.id ) {
    id = 1;
  }else{
    id = id+1;
}


  const { title } = req.body;
  const { tasks } = req.body;

  Projects.push({id,title,tasks});

  return res.json(Projects)
});

server.put('/Projects/:index',checkProjectInArray, checkProjectExists, (req, res) => {
  const { index } = req.params;

  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  Projects[index] = {id,title,tasks};

  return res.json(Projects);
});

server.delete('/Projects/:index', checkProjectInArray, (req, res) => {
  const { index } = req.params;
  
  Projects.splice(index, 1);

  return res.send();
});

server.listen(3000);
