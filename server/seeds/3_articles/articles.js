const { getSubgroupsObjectId } = require('../helpers');

let articles = [
  {
		id: getSubgroupsObjectId('Orange Juice'),
    name: 'Orange Juice',
    quantity: 1,
    price: 10,
    retail_price: 5,
    image: 'images\\drinks.jpg',
    inStorage: getSubgroupsObjectId('Main Storage 1'),
    subgroup_name: 'Drinks',
		subgroup_id: getSubgroupsObjectId('subgroup1'),
		updated_date: '2019-12-16T01:00:33.269Z'
	},
	{
		id: getSubgroupsObjectId('Coca Cola'),
    name: 'Coca Cola',
    quantity: 1,
    price: 15,
    retail_price: 6,
    image: 'images\\coca-cola.png',
    inStorage: getSubgroupsObjectId('Main Storage 1'),
    subgroup_name: 'Drinks',
		subgroup_id: getSubgroupsObjectId('subgroup1'),
		updated_date: '2019-12-16T01:00:33.269Z'
	},
	{
		id: getSubgroupsObjectId('Fanta'),
    name: 'Fanta',
    quantity: 1,
    price: 12,
    retail_price: 4,
    image: 'images\\fanta.png',
    inStorage: getSubgroupsObjectId('Main Storage 1'),
    subgroup_name: 'Drinks',
		subgroup_id: getSubgroupsObjectId('subgroup1'),
		updated_date: '2019-12-16T01:00:33.269Z'
	},
	{
		id: getSubgroupsObjectId('Jack Daniels'),
    name: 'Jack Daniels',
    quantity: 1,
    price: 10,
    retail_price: 5,
    image: 'images\\jack.jpg',
    inStorage: getSubgroupsObjectId('Main Storage 1'),
    subgroup_name: 'Alcoholic Drinks',
		subgroup_id: getSubgroupsObjectId('subgroup2'),
		updated_date: '2019-12-16T01:00:33.269Z'
	},
	{
		id: getSubgroupsObjectId('Heineken'),
    name: 'Heineken',
    quantity: 1,
    price: 10,
    retail_price: 5,
    image: 'images\\heineken.jpg',
    inStorage: getSubgroupsObjectId('Main Storage 1'),
    subgroup_name: 'Alcoholic Drinks',
		subgroup_id: getSubgroupsObjectId('subgroup2'),
		updated_date: '2019-12-16T01:00:33.269Z'
  }
]

module.exports = articles