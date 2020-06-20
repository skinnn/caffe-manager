/**
 * Checks if an object is empty (if obj has any properties)
 * @param 	{Object} 	obj	 [Object to be evaluated]
 * @return	{Boolean}			 [Returns boolean true or false]
 */
export const isEmptyObject = (obj) => {
	if (!obj) throw new Error('Value not specified')
	if (obj.constructor !== Object || obj === null) throw new TypeError('The provided value is not of type Object')
	return obj && obj.constructor === Object && Object.keys(obj).length === 0
}