const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const bodyParser = require('body-parser')

const config = bodyParser.urlencoded({extended:false})

let users = [];
let exercises = [];
let logs= [];

app.use(config)
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
  let id = "id" + Math.random().toString(16).slice(2)
  let user = {
    username : req.body.username,
    _id: id
  }
  users.push(user)
  res.json(user)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.post('/api/users/:_id/exercises', (req, res) => {
  console.log(req.body)
  const user = users.find(o => o._id === req.params._id)
  let exercise = {
    _id : req.params._id,
    username: user.username,
    description : req.body.description,
    duration: Math.floor(req.body.duration),
    date : req.body.date != null ? new Date(req.body.date).toDateString() : new Date().toDateString()
  }
  console.log(exercise)
  exercises.push(exercise)
  res.json(exercise)
})

app.get('/api/users/:_id/logs', (req, res) => {

  console.log(req.query)
  let filter = exercises.filter(x => x._id == req.params._id);

  if (req.query.from != null && req.query.to != null) {
    filter = filter.filter(x => new Date(x.date).getTime() >= new Date(req.query.from) && new Date(x.date).getTime() <= new Date(req.query.to).getTime());
  }

  if (req.query.limit != null) {
    filter = [filter[0]];
    console.log(filter)
  }

  res.json({
    username: filter[0].username,
    count : filter.length,
    _id: filter[0]._id,
    log: filter.map(x => {
      return {
        description : x.description,
        duration : x.duration,
        date: x.date
      }
    })
  })
 // console.log(filter)
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
