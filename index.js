const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyw1sec.mongodb.net`;

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
        const task = client.db('task').collection('task');

        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await task.insertOne(newTask);
            res.json({ result});
        });
        app.get('/task', async (req, res) => {
            const user = await task.find({}).toArray();
            res.json(user);
        });
        


        app.get('/task', async (req, res) => {
            try {
                const email = req.query.email;
                const query = { email: email };
                const result = await task.find(query).toArray();
                res.send(result);

            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });
        
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await task.deleteOne(query);
            res.send(result);
            })
          
        

        app.get('/', (req, res) => {
            res.send('It is working');
        });
        
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateTask = req.body;
    
            const task = {
                $set: {
                    
                     name :updateTask.name,
                     description:updateTask.description,
                     taskDate :updateTask.taskDate,
                    priority :updateTask.priority,
                    status :updateTask.status,
                    
                }
            }
    
            const result = await task.updateOne(filter, task, options);
            res.json({ success: true, message: 'Application successful' });
        })

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Connect the client to the server
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Don't close the client here to keep the connection open
    }
}

run().catch(console.dir);
