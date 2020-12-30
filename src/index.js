const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();


app.use(express.json());
/*
* Métodos HTTP
* GET: Buscar informações do back-end
* POST: Criar uma informação no back-end
* PUT/PACTH: Alterar uma informação no back-end
* DELETE: Deletar uma informação no back
*/ 

/**
 * Tipos de parâmetros:
 * ** ** ** ** ** ** **
 *  Query Params: Filtros & Paginação
 *  Route Params: Identificar recursos (Atualizar/Deletar)
 *  Request Body: Conteúdo na hora criar ou editar um recurso (JSON)
 * 
 *******/ 


/*
*  Middleware
* 
*  Interceptador de requisições que interromper totalmente a requisição ou alterar dados da requisição.
* 
*/  
 const projects = [];

 function logRequests(request, response, next) {
     const { method, url } = request;

     const logLabel = `[${method.toUpperCase()}] ${url}`;
    
     console.time(logLabel);

     next(); // Próximo middleware

     console.timeEnd(logLabel);
 }
 

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if(!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' });
    }

    return next();
}
 
 app.use(logRequests);
 app.use('/projects/:id', validateProjectId);

// Buscar informação do recurso 
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;
    
    return response.json(results);
});

// Criar um recurso (projects)
app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);
    
    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;
    
    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    projects.splice(projectIndex, 1);
    
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('Back-end started!')
});