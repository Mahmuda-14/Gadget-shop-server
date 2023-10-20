const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware

// app.use(cors());
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());



// // I9NWHy5yUQdAQZRY
// BrandServer

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcz5gxh.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.bcz5gxh.mongodb.net/?retryWrites=true&w=majority";

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
  

    const productCollection = client.db('productDB').collection('products');



    // get data

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })



    // sending data to db
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })



// get data with id
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id; 
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      // console.log(result);
      res.setHeader('Content-Type', 'application/json');     
      res.send(result);
    });


    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem= req.body;

      const products = {
          $set: {

            name:updatedItem.name,
            brand:updatedItem.brand, 
            rating:updatedItem.rating,
            type:updatedItem.type,
            price:updatedItem.price,
            image:updatedItem.image
          }
      }

      const result = await productCollection.updateOne(filter, products, options);
      console.log(result);
      res.send(result);
  })
    





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
  res.send('Brand server is running');
})

app.listen(port, () => {
  console.log(`brand server is running on port: ${port}`)
})