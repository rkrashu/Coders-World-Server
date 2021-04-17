const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djl2y.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 5000

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
    res.send("Welcome to coders world server")
  })
  

client.connect(err => {
  const orderCollection = client.db("CodersWorld").collection("soldCourse");
  const reviewCollection = client.db("CodersWorld").collection("review");
  const courseCollection = client.db("CodersWorld").collection("course");
  const adminCollection = client.db("CodersWorld").collection("admin");

  app.post('/buyCourse',(req,res )=>  {
    const customerInfo = req.body
    orderCollection.insertOne(customerInfo)
    .then(result => res.send(result.insertedCount>0))
  })

  app.get('/courseList', (req, res) => {
    const email = req.query.email
    orderCollection.find({Email: email})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.post('/userReview',(req,res)=>{
    const reviewDetails = req.body
    reviewCollection.insertOne(reviewDetails)
    .then(result => res.send(result.insertedCount>0))
  })

  app.post('/orderList', (req, res)=>{
    orderCollection.find({})
    .toArray((err, document) =>{
      res.send(document)
    })
  })

  app.post('/addCourse', (req,res)=> {
    const courseDetails = req.body
    courseCollection.insertOne(courseDetails)
    .then(result=> res.send(result.insertedCount>0))
  })

  app.post('/makeAdmin', (req,res)=>{
    const adminDetails = req.body
    adminCollection.insertOne(adminDetails)
    .then(result => res.send(result.insertedCount>0))
  })

  app.post('/manageCourse', (req, res)=>{
    courseCollection.find({})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.delete('/deleteCourse/:id',(req, res) => {
    const productId = req.params.id
    courseCollection.deleteOne({_id: ObjectId(productId)})
    .then(result=> res.send(result.deletedCount>0))
  })

  app.get("/courses", (req, res) => {
    courseCollection.find({})
    .toArray((err, document) => {
      res.send(document)
    })
  })

  app.get('/review', (req, res) => {
    reviewCollection.find({})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.get('/course/:id', (req, res)=>{
    const productId = req.params.id
    courseCollection.find({_id: ObjectId(productId)})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.get('/adminPanel/:email', (req,res) =>{
  const email = req.params.email
  adminCollection.find({email: email})
  .toArray((err, document)=>{
    res.send(document[0])
  })
  })
    
});










app.listen( process.env.PORT || 5000)