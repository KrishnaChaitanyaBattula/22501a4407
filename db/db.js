const { MongoClient } = require('mongodb');

const uri = process.env.CONNECTION_STRING || 'mongodb://localhost:27017';
const dbName = 'urlshortener';

let db = null;

async function connect() {
  if (db) return db;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return db;
}

module.exports = { connect };