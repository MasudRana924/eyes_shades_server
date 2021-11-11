const express = require('express')
const { MongoClient, CURSOR_FLAGS } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// middleware 
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrpwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('eyes-Shades')
        console.log('database connected')
        // foods connection
        const glassesCollection = database.collection('glasses')
        // order connection
        const ordersCollection = database.collection('orders')
        // get api for all data 
         app.get('/glasses', async (req, res) => {
            const cursor = glassesCollection.find({})
            const glasses = await cursor.toArray()
            res.send(glasses)
            console.log('data')
        })
        //    get single data 
        app.get('/glass/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await glassesCollection.findOne(query)
            res.json(product)
        })  
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })
           

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('eyes_Shades is running under server')
})
app.listen(port, () => {
    console.log("server is running on", port)
})