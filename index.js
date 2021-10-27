const express = require("express");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
var cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsejt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("ProductsList");
    const productCollection = database.collection("products");
    // POST API
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = productCollection.insertOne(newProduct);
      res.send(result);
    });
    // GET API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    //delete API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });
    // UPDATE API
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateProduct.name,
          desc: updateProduct.desc,
          price: updateProduct.price,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // find specefig API
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
