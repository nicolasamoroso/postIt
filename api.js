const express = require('express')
const mongoose = require('mongoose')
const URI = 'mongodb://localhost:27017/test'
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app'))

mongoose.connect(URI, options, (err, db) => {
    if (err) console.error(err);
    else console.log("database connection")
})

const path = require('path');
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const PostIt = require('./postsIt')

app.get('/postsIt', async (req, res) => {
    const postIts = await PostIt.find()
    res.status(200).send(postIts)
})

app.get('/postsIt/:id', async (req, res) => {
    const { id } = req.params
    const postIt = await PostIt.findOne({ _id: id })
    if (postIt) res.status(200).send(postIt)
    else res.status(404).send({ message: 'PostIt not found' })
})

app.post('/postsIt', async (req, res) => {
    const postIt = new PostIt(req.body)
    await postIt.save()
    res.status(201).redirect('/')
})

app.put('/postsIt/:id', async (req, res) => {
    const { id } = req.params
    const postIt = await PostIt.findOne({ _id: id })
    if (postIt) {
        postIt.set(req.body)
        await postIt.save()
        res.sendStatus(204)
    } 
    else res.status(404).send({ message: 'PostIt not found' })
})

app.delete('/postsIt/:id', async (req, res) => {
    const { id } = req.params
    const postIt = await PostIt.findOne({ _id: id })
    if (postIt) {
        await postIt.remove()
        res.sendStatus(204)
    } 
    else res.status(404).send({ message: 'PostIt not found' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.all('*', async (req, res) => {
    res.send('404')
})