var irs_getCatMap = Class.create();
irs_getCatMap.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	
	get: function() {
		var catMap = gs.getProperty('irs-category_map')

		return JSON.stringify(catMap)
	},
	
    type: 'irs_getCatMap'
});