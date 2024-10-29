var express = require('express');
const {MongoClient} = require("mongodb");
const sea = require("node:sea");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('receive', { title: 'Express' });
});

// POST
router.post('/item', async function (req, res, next) {

    const {code, quantity} = req.body;
    statut = await receive(code, quantity);

    res.render('receive', {title: statut})
})
module.exports = router;


async function receive(code, quantity) {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('truckExpress');
        const collection = database.collection('item');

        const check = await collection.findOne({ _id: code });
        if (check === null) {
            return "ID doesn't exist";
        }
        var newQuantity = parseInt(check.quantity) + parseInt(quantity);
        collection.updateOne({
                _id: code },
            { $set: { quantity: newQuantity } },
            { upsert: false })
        return "products updated";
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}


