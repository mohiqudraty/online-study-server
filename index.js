const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assignment11.eiurimr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection here -----------------------------------------
    const assignmentCollection = client
      .db("studyOnlineDB")
      .collection("assignments");

    const submitttedCollection = client.db("studyOnlineDB").collection("faqs");
    const faqCollection = client.db("studyOnlineDB").collection("faqs");
    const featureCollection = client.db("studyOnlineDB").collection("features");

    // create an assignment api  ----------------
    app.post("/api/v1/all-assignment", async (req, res) => {
      try {
        const assignment = req.body;
        const result = await assignmentCollection.insertOne(assignment);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get  single assignment data for view and update page  ------------------
    app.get("/api/v1/single-assignment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await assignmentCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get all assignment api -------------------
    app.put("/api/v1/all-assignment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const assignment = req.body;
        const options = { upsert: true };
        const updateAssignment = {
          $set: {
            title: assignment.title,
            photo: assignment.photo,
            description: assignment.description,
            marks: assignment.marks,
            level: assignment.level,
            dueDate: assignment.dueDate,
          },
        };
        const result = await assignmentCollection.updateOne(
          filter,
          updateAssignment,
          options
        );
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get all assignment api -------------------
    app.get("/api/v1/all-assignment", async (req, res) => {
      try {
        const level = req.query.level;
        let query = {};
        if (level) {
          query = { level: level };
        }
        const cursor = assignmentCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get features here ---------------
    app.get("/api/v1/features", async (req, res) => {
      const cursor = featureCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // faq get here ----------------
    app.get("/api/v1/faq", async (req, res) => {
      const cursor = faqCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Study Online Server Is Running!");
});

app.listen(port, () => {
  console.log(`study online server running on port ${port}`);
});
