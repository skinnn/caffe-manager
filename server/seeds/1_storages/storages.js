const { mapStoragesToEntities } = require('../helpers')

const storages = [
  {
    name: 'Main Storage 1',
    type: 'Main'
	},
	{
    name: 'Alt Storage 1',
    type: 'Alt'
	},
	{
    name: 'Main Storage 2',
    type: 'Main'
  }
]

module.exports = mapStoragesToEntities(storages)
