var express = require('express');
const {MongoClient} = require("mongodb");
const sea = require("node:sea");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('ship', { title: 'Express' });
});

// POST
router.post('/item', async function (req, res, next) {

    const {code, quantity} = req.body;
    statut = await ship(code, quantity);

    res.render('ship', {title: statut})
})
module.exports = router;


async function ship(code, quantity) {
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
        var newQuantity = parseInt(check.quantity) - parseInt(quantity);
        if (newQuantity > 0) {
            collection.updateOne({
                    _id: code
                },
                {$set: {quantity: newQuantity}},
                {upsert: false})
            return "products updated";
        }else {
            return "products cannot be shipped not enough item in stock"
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
