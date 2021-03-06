const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()




app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('person', function getPerson (res) {
    return JSON.stringify(res.body)
  })
app.use(morgan('tiny',{
    skip: function(req, res){return req.method === "POST"}
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person', {
    skip: function (req, res) { return req.method !== "POST" }
  }))




let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/notes', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people </br>
                   ${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        console.log(person.id, typeof person.id, id, typeof id, person.id === id)
        return person.id === id
      })

    if (person) {
    response.json(person)
    } else {
    response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }
    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

    persons.map(person=>{
        if (person.name === body.name){
            return response.status(400).json({ 
                error: 'name must be unique' 
            })}
    })

  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })




const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})