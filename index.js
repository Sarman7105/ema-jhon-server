const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5055
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0q0ko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

client.connect(err => {
    
    const productsCollection = client.db("emaJhonStore").collection("Products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");
    
    app.post('/addProducts', (req, res) => {
      const products = req.body;
      productsCollection.insertMany(products)
        .then(result => {
        res.send(result.insertedCount)
      })

    })
    app.post('/addOrder', (req, res) => {
      const order = req.body;
      // console.log(order);
      ordersCollection.insertOne(order)
        .then(result => {
        res.send(result.insertedCount > 0)
      })

    })
  
  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((error, documents) => {
        res.send(documents);
    })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({})
      .toArray((error, documents) => {
        res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key:req.params.key})
      .toArray((error, documents) => {
        res.send(documents);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    // console.log(productKeys);
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((error, documents) => {
        res.send(documents);
    })
  })
  
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
