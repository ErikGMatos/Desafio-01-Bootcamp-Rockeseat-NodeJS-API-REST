const express = require("express");

const server = express();
server.use(express.json());
server.use(logRequests);
// Query params = ?teste=1
// route params = /users/1
// request body = { "name": "Diego", email:"diego@rocketseat.com.br" }

// CRUD - Create, Read, Update, Delete

let numberOfrequests = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const exists = projects.find(p => p.id == id);
  if (!exists) {
    return res.status(400).send({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfrequests++;
  console.log(`Número de requisições foi de : ${numberOfrequests}`);
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.send(projects);
});

server.get("/projects", (req, res) => {
  return res.send(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.send(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => p.id == id);
  projects.splice(project, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
