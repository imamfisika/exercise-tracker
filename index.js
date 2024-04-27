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

app.post('/api/users/:_id/exercises', (req, res) => {
  console.log(users)
  console.log(req.params._id)
  const user = users.find(o => o._id === req.params._id)
  console.log(user)
  let exercise = {
    _id : req.params._id,
    username: user.username,
    description : req.body.description,
    duration: req.body.duration,
    date : req.body.date
  }

  exercises.push(exercise)
  res.json(exercise)
})

app.get('/api/users/:_id/logs', (req, res) => {
  let filter = exercises.filter(x => x._id == req.params._id);

  res.json({
    username: filter[0].username,
    count : filter.length,
    _id: filter[0]._id,
    log: filter.map(x => {
      return {
        description : x.description,
        duration : x.duration,
        date: new Date(x.date).toDateString()
      }
    })
  })
 // console.log(filter)
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
