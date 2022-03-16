const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('localhost-key.pem');
const cert = fs.readFileSync('localhost.pem');

const express = require('express');
const app = express();
const axios = require('axios')

const cors = require('cors');

const port = 5000

const server = https.createServer({key: key, cert: cert }, app);

app.get('/', (req, res) => { 
  console.log('You are on root url')
});

app.use(cors({
  origin: '*'
}));

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.post('/getToken',(req, res) => {

  const code = req.query.code
  const client_secret = req.body.data.client_secret
  const client_id = req.body.data.client_id

  axios.post('https://cambrianhelp.zendesk.com/oauth/tokens',
  {headers:{
    'Content-Type': 'application/json',
  }},
  {params:{
    'redirect_uri':'https://localhost:3000/oauth2/callback',
    'scope': 'read write',
    'client_secret':client_secret,
    'client_id':client_id,
    "code":code,
    'grant_type':'authorization_code'
  }})
  .then(zenDeskResponse => {
    console.log('token: ', zenDeskResponse.data)
    res.send(zenDeskResponse.data)
  })
})


app.post('/listTickets',(req, res) => {

  const token = req.body.data.token

  axios.get('https://cambrianhelp.zendesk.com/api/v2/tickets',{headers:{
    "Authorization":`Bearer ${token}`
  }})
  .then(ticketList => {
    res.send(ticketList.data)
  })
})

server.listen(port, () => {console.log(`listening on secure port: ${port}`)});