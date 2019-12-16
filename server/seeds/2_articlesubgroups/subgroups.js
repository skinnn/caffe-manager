const { getObjectId, getSubgroupsObjectId } = require('../helpers');

const articleSubgroups = [
  {
    id: getObjectId('subgroup1'),
		name: 'Drinks',
		image: 'images\\drinks.jpg',
		inWhichStorage: getSubgroupsObjectId('Main Storage 1')
	},
	{
		id: getObjectId('subgroup2'),
		name: 'Alcoholic Drinks',
		image: 'images\\alcoholic-drinks.jpg',
		inWhichStorage: getSubgroupsObjectId('Main Storage 1')
	}
]

module.exports = articleSubgroups