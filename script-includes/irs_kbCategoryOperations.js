/**
*
* Class representing operations related to KB categories.
*
* @class
*/
var irs_kbCategoryOperations = Class.create();
irs_kbCategoryOperations.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	/**
	*
	* Returns data from sys_property irs.knowledge.categoryMap.
	*
	* @function
	*
	* @returns {string} The JSON string containing the category map and the HTTP status code.
	*/
	get: function() {
		var json = {}
		var catMap = gs.getProperty('irs.knowledge.categoryMap')
	
		if(catMap) {
			json = JSON.stringify({ 'status': 200, 'result': catMap })
			return json
		}
		
		json = JSON.stringify({ 'status': 400, 'result': 'Sys_property irs.knowledge.catMap not Found!'})
		return json
	},
	/**
	*
	* Returns the sys_id of the KB category.
	*
	* @function
	*
	* @returns {string} The JSON string containing the sys_id and the HTTP status code.
	*/
	query: function() {
		var json = {}
		var category = this.getParameter('sysparm_category')
		var kb = this.getParameter('sysparm_kb')
		var gr = new GlideRecord('kb_category')
		gr.addQuery('label', category)
		gr.addQuery('parent_id', kb)
		gr.query()
		
		if(gr.next()) {
			json = JSON.stringify({ 'status': 200, 'result': gr.sys_id.getValue() })
			return json
		}
		
		json = JSON.stringify({ 'status': 400, 'result': 'KB Category not Found!'})
		return json
	},
	
    type: 'irs_kbCategoryOperations'
});
