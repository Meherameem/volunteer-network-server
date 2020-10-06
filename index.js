const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwtzw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port =5000;



const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

app.get('/', (req, res) => {
   res.send('hello world!');
 });

    client.connect(err => {
    const tasksCollection = client.db("VolunteerNetwork").collection('tasks');
    const usersCollection = client.db("VolunteerNetwork").collection('users');

    app.get('/tasks',(req, res) => {
        tasksCollection.find({})
        .toArray( ( err, documents) => {
          res.send(documents);
          console.log('database connected');

        })
      })

      app.get('/users',(req, res) => {
        usersCollection.find({})
        .toArray( ( err, documents) => {
          res.send(documents);
        })
      })

      app.post('/addevent', (req, res) => {
        const event = req.body;
        console.log(event);

        tasksCollection.insertOne(event)
        .then(result => {
          res.redirect('https://volunteer-network-236ea.web.app/admin');
          console.log("added event succesful");
        })
    })

    app.post("/users",(req,res) => {
      const user = req.body;
      console.log(user);
      
      usersCollection.insertOne(user)
      .then(result => {
        console.log('user added successfully');
        res.redirect('https://volunteer-network-236ea.web.app/specUser');
      })
    })

});






app.listen(process.env.PORT || port);
