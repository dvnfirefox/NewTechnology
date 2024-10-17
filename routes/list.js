var express = require('express');
const {MongoClient} = require("mongodb");
const sea = require("node:sea");
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let result = await accessdatabase("")
    res.render('list', {title: 'Express', result});
});
module.exports = router;

router.post('/search', async function (req, res, next) {
    const {search} = req.body;
    res.render('create', {title: statut})
    let result = await accessdatabase(search);
    res.render('list', {title: 'Express', result});
})

async function accessdatabase(key) {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('truckExpress');
        const collection = database.collection('item');
        const result = await collection.find({"name" : {$regex : key}}).toArray();
        console.log(result);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}