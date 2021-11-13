const express = require('express')
const { MongoClient, CURSOR_FLAGS } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
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
        // user connection
        const usersCollection = database.collection('users')

        //  Data section
        // get api for all data 
        app.get('/glasses', async (req, res) => {
            const cursor = glassesCollection.find({})
            const glasses = await cursor.toArray()
            res.send(glasses)

        })
        //    get single data 
        app.get('/glass/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await glassesCollection.findOne(query)
            res.json(product)
        })
        // get api for all data 
        app.get('/products', async (req, res) => {
            const cursor = glassesCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            let products;
            const count = await cursor.count()
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                const products = await cursor.toArray()
            }
            res.send({
                count, products
            })
        })

        // orders api section 
        // orders post 
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })
        app.get('/getorders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray()
            res.send(orders)
        })
        app.get('/myorders', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = ordersCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)

        })

        // Users section 
        // post user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        // make admin 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        // checked admin or not 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //    post api 
        app.post('/glasses', async (req, res) => {
            const newGlass = req.body
            const result = await glassesCollection.insertOne(newGlass)
            res.json(result)
        })
        //   delete api 
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })


        // delete product glasses
        app.delete('/glasses/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await glassesCollection.deleteOne(query)
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