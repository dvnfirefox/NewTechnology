var express = require('express');
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload')
const {resolve} = require("node:path");
const path = require("node:path");
var router = express.Router();
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  tempFileDir: path.join(__dirname, 'temp'),
}));

// GET
router.get('/', function(req, res, next) {
  res.render('create', { title: '' });
});

// POST
router.post('/item', async function (req, res, next) {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image file uploaded.');
  }
  let image = req.files.image;
  const {code, name, price} = req.body;
  pathImage = resolve('public/images', image.name);
  image.mv(pathImage);
  const relativePath = path.join('/images', image.name);
  statut = await createRow(code, name, price, relativePath);

  res.render('create', {title: statut})
})

module.exports = router;




async function createRow(code, name, price, image) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  let statut = "item created with success";

  try {
    await client.connect();

    const database = client.db('truckExpress');
    const collection = database.collection('item');

    const newItem = {
      _id: code,
      name: name,
      price: price,
      quantity: 0,
      image: image,
      archived: false,
    };
    const check = await collection.findOne({ _id: code });
    if (check !== null) {
      return "ID already exists";
    }
    const result = await collection.insertOne(newItem);
    console.log(`New document inserted with the following id: ${result.insertedId}`);
  } catch (err) {
    statut = "Item failed to be created";
    console.error(err);
  } finally {
    await client.close();
  }
  return statut;
}