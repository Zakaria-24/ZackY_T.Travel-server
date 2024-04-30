const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
  {origin:
    ["http://localhost:5174", "https://southeast-asia-ec5f1.web.app"]
}
));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfjtmur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tourSpotCollection = client.db("spotDB").collection("spot");
    const countriesCollection = client.db("spotDB").collection("countries");
    const newsletterCollection = client.db("spotDB").collection("newsletter");


    app.get('/spot', async(req, res) => {
      const cursor = tourSpotCollection.find()
      const allTouristSpots = await cursor.toArray();
      res.send(allTouristSpots);
    })

    // get for view details
    app.get('/spot/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const touristSpot = await tourSpotCollection.findOne(query);
      res.send(touristSpot);
    })

    // get for email 
    app.get('/spots/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await tourSpotCollection.find(query).toArray();
      res.send(result);
    })

    // get for country
    app.get('/countries', async (req, res) => {
      const cursor = countriesCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    // get for mycountry Spots
    app.get('/countries/:country', async (req, res) => {
      const country = req.params.country;
      const query = { country: country };
      const cursor = tourSpotCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })

    // post
    app.post('/spot', async (req, res) => {
        const newTouristSpot = req.body;
        console.log(newTouristSpot);
        const result = await tourSpotCollection.insertOne(newTouristSpot);
        res.send(result);
    })

    // post for newsletter
    app.post('/newsletter', async (req, res) => {
      const newNewsletter = req.body;
      console.log(newNewsletter);
      const result = await newsletterCollection.insertOne(newNewsletter);
      res.send(result);
    })

    app.put('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = {upsert:true}
      const newMyList = req.body;
      // console.log(newMyList, id);

      const updateMyList = {
        $set: {
            cost: newMyList.cost,
            country: newMyList.country,
            description: newMyList.description,
            location: newMyList.location,
            photoUrl: newMyList.photoUrl,
            seasonality: newMyList.seasonality,
            spotName: newMyList.spotName,
            time: newMyList.time,
            visit: newMyList.visit
        }
      }
      const result = await tourSpotCollection.updateOne(filter, updateMyList, option);
      console.log(result)
      res.send(result);

    })

    app.delete('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourSpotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('TOURISM MANAGEMENT SERVER RUNNING!');
});

app.listen(port, (req, res) => {
    console.log(`Server is running on port, ${port}`);
})