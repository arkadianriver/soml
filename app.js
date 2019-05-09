
const express = require('express')
const mysql = require('mysql')
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
const client = path.join(__dirname, 'client')

const app = express()
const port = 3000

const pool = mysql.createPool(config.get('dbconnect'))

app.use(express.static('assets'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.sendFile(path.join(client, 'index.html')))

app.post('/search', (req, res) => {
  console.log('request received')
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) throw err;
    var query = 
      'select m.memorystart,m.memoryend,d.title as headline,m.memorydescr as text'
    + ' from diary_memories m'
    + ' left join diary_media d on (m.memoryID=d.memoryID)'
    + ' where d.title is not null'
    connection.query(query, (err, rows, fields) => {
      res.send({ entries: rows });
      connection.release()
      if (err) throw err
    })
  })
})

app.listen(port, () => console.log("server listening on port "+port))
