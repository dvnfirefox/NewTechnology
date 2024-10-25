var express = require('express');
const {MongoClient} = require("mongodb");
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  let result = await accessdatabase()
  res.render('index', {title: 'Express', count: result});
});

module.exports = router;

async function accessdatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('truckExpress');
    const collection = database.collection('item');
    const result = await collection.countDocuments();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
