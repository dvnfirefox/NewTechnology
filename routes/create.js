var express = require('express');
const { MongoClient } = require('mongodb');
var router = express.Router();

// GET route for rendering the form
router.get('/', function(req, res, next) {
  res.render('create', { title: '' });
});

// POST route for handling form submission
router.post('/item', async function (req, res, next) {
  const {code, name, price} = req.body;

  // Handle the form submission logic (e.g., save data to a database)
  console.log('Code:', code);
  console.log('Name:', name);
  console.log('Price:', price);
  statut = await createRow(code, name, price);
  res.render('create', {title: statut})
});

module.exports = router;




async function createRow(code, name, price) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  let statut = "item created with success";  // Use 'let' to declare 'statut'

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db('truckExpress');
    const collection = database.collection('item');

    // New document to insert
    const newItem = {
      id: code,  // You can generate this dynamically if needed
      name: name,
      price: price
    };

    // Insert the document
    const result = await collection.insertOne(newItem);
    console.log(`New document inserted with the following id: ${result.insertedId}`);
  } catch (err) {
    statut = "Item failed to be created";
    console.error(err);  // Log the error for debugging
  } finally {
    // Ensure client will close when you finish/error
    await client.close();
  }
  return statut;  // Return 'statut' as the result
}