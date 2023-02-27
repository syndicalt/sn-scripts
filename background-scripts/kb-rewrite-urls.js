/**
 * @function executeRule
 * @param {GlideRecord} current - The current record
 * @param {GlideRecord} previous - The previous record
 * @returns {void}
 * @description rewrite the links to other KB articles to send users
 * to the irs_kbRedirect UI page.
 */

(function executeRule(current, previous /*null when async*/) {
	/** @param fields - array of fields from the table */
	var fields = []
	/** @param url - url of the instance */
	var url = gs.getProperty('glide.servlet.uri')
	/** @param gr - gliderecord of current */
	var gr = new GlideRecord(current.sys_class_name)
	gr.get('sys_id', current.sys_id)
	
	for (var key in gr) {
		fields.push(key)
	}
	
	fields.forEach(function(field) {
		/** @param searchKb - get an array of all KB and KBPR numbers in the field */
		var searchKb = gr[field].match(/KB\d{7}|KBPR\d{4}/g)
		
		/** 
		* skip records if the field is number, meta_description or if no
		* kb numbers exist in the field
		*/
		if(field === 'number' || field === 'meta_description' || !searchKb) return
		
		/** @param uniqueKb - filter duplicates from searchKb array */
		var uniqueKb = searchKb.filter(function(item,index) {
			return searchKb.indexOf(item) === index
		})
		
		/** 
		* loop unique kb numbers to replace the existing url with the
		* ui page redirect url
		*/
		uniqueKb.forEach(function(item) {
			var newUrl = url + 'redirect_ui_page.do?sysparm_article=' + item
			var urlReplace = '<a title="' + item + '" href="' + newUrl + '" rel="nofollow">' + item + '</a>'
			var regexString = '<a title=\"' + item + '\" href=(.*?) rel=(.*?)>(.*?)<\/a>'
			gr[field] = gr[field].replace(new RegExp(regexString,'g'), urlReplace)
			gr.update()
		})
	})
})(current, previous);