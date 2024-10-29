var express = require('express');
const {MongoClient} = require("mongodb");
const sea = require("node:sea");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('remove', { title: 'Express' });
});
// POST
router.post('/item', async function (req, res, next) {

    const {code} = req.body;
    statut = await ship(code);

    res.render('remove', {title: statut})
})
module.exports = router;


async function ship(code) {
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
        collection.updateOne({
                _id: code },
            { $set: { archived: true } },
            { upsert: false })
        return "products deleted";
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
