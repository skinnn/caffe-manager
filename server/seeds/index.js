const { Seeder } = require('mongo-seeding')
const path = require('path');
require('dotenv').config()

// Seeder config
const config = {
  database: process.env.DB_URI,
	dropDatabase: false,
	dropCollections: true // drops every collection which is being imported
}

// Instantiate Seeder class
const seeder = new Seeder(config)

const collections = seeder.readCollectionsFromPath(
  path.resolve('./seeds'), {
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId]
  }
)
console.log('Collections: ', collections)

// Seed database
seeder
  .import(collections)
  .then(() => {
    console.log('Success')
  })
  .catch(err => {
    console.log('Error', err)
  })