const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();


const app = express();

const port = process.env.PORT || 5000;

//middleware 

app.use(cors());
app.use(express.json());



//connecting to the mongodb server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzgvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run(){
    try{
      await client.connect();
      //creating a database
      const database = client.db("volunteer");

      //creating a collection /array of data
      const eventsCollection = database.collection("events");
      const volunteerCollection = database.collection("volunteers");
      const myEventsCollection = database.collection("myEvents");
      //end of creating a collection /array of data

      console.log("Connection to the database is established");

      //GET API

      app.get("/events", async (req, res) => {
        const cursor = eventsCollection.find({});
        const events = await cursor.toArray();
        res.json(events);
      });

      app.get("/volunteers", async (req, res) => {
          const cursor = volunteerCollection.find({});
          const volunteers = await cursor.toArray();
          res.json(volunteers);
      })

      // get data by id

      app.get("/events/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await eventsCollection.findOne(query);
        res.json(result);
      });

    //   get my events

    app.get("/myEvents/:email", async (req, res) => {
        console.log(req.params.email);
        const result = await myEventsCollection.find({email: req.params.email}).toArray();
        console.log(result);
        res.json(result);
    })


      //POST API

      // adding the events
      app.post("/events", async (req, res) => {
        const event = req.body;
        const result = await eventsCollection.insertOne(event);
        console.log(event);
        res.json(result);
      });


      //adding my events

      app.post("/myEvents", async (req, res) => {
          const myEvent = req.body;
          const result = await myEventsCollection.insertOne(myEvent);
          console.log(myEvent);
          res.json(result);
      })

      //adding a volunteer

      app.post("/volunteers", async (req, res) => {
        const volunteer = req.body;
        const result = await volunteerCollection.insertOne(volunteer);
        console.log(volunteer);
        res.json(result);
      });


      //DELETE API

      app.delete("/myEvents/:id", async (req, res) => {
        //   console.log(req.params);
          const id = req.params.id;
          const query = {_id:id};
          const result = await myEventsCollection.deleteOne(query);
        //   console.log(result);
          res.json(result);
      })

    }
    finally{

    }
}

run().catch(console.dir);


//page initialization 

app.get('/', (req, res) => {
    res.send('Welcome to Volunteer Server');
})

app.listen(port ,()=>{
    console.log("Server has started on port", port);
})