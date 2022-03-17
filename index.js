const https = require('https');
const http = require('http');
const fs = require('fs');
const key = fs.readFileSync('localhost-key.pem');
const cert = fs.readFileSync('localhost.pem');

const express = require('express');
const app = express();
const axios = require('axios')

const cors = require('cors');

const port = 5000

const server = https.createServer({
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
},app);

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
  const CLIENT_SECRET = req.body.data.client_secret
  const CLIENT_ID = req.body.data.client_id

  console.log('code: ', code);
  const preEncodeString = CLIENT_ID + ':' + CLIENT_SECRET
  const authString = new Buffer.from(preEncodeString).toString('base64');
  console.log('authString: ', authString)

  axios.post(`https://api.getbase.com/oauth2/token?redirect_uri=https://localhost:3000/oauth2/callback&grant_type=authorization_code&code=${code}`,{},
  {
    headers:{
    "Authorization": `Basic ${authString}`,
  }})
  .then(zenDeskResponse => {
    console.log('token: ', zenDeskResponse)
    res.send(zenDeskResponse.data)
  })
  .catch(err => {
    console.log('err: ', err)
  })
})


app.post('/getContacts',(req, res) => {

  const token = req.body.data.token
  console.log('token: ', token)

  axios.get('https://api.getbase.com/v2/contacts?sort_by=created_at',{
    headers:{
    "Authorization":`Bearer ${token}`
  }})
  .then(contactList => {
    res.send(contactList.data)
  })
  .catch(err => {
    console.log('error: ', err.data)
  })
})

app.post('/getContactsPAT',(req, res) => {

  const token = req.body.data.token
  console.log('token: ', token)

  axios.get('https://api.getbase.com/v2/contacts?sort_by=created_at',{
    headers:{
    "Authorization":`Bearer ${token}`
  }})
  .then(contactList => {
    res.send(contactList.data)
  })
  .catch(err => {
    console.log('error: ', err.data)
  })
})

server.listen(port, () => {console.log(`listening on secure port: ${port}`)});