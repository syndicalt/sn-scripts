function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading || newValue == '') {
		g_form.setVisible('original_record', false)
		g_form.setValue('original_record','')
		return;
	}
	
	/** get user record */
	var user = g_form.getReference('user_record', setValues)
	var result = {}
	
	g_form.setVisible('original_record', false)
	
	function setValues(user) {
		/** set result array values */
		result.name = user.name
		result.preferred_name = user.u_preferred_name
		result.middle_name = user.middle_name
		result.given_name = user.first_name
		result.surname = user.last_name
		result.phone = user.phone
		result.mobile_phone = user.mobile_phone
		result.title = user.title
		result.u_hire_date = user.u_hire_date
		result.u_account_type = user.u_account_type
		result.u_samaccountname = user.u_samaccountname
		
		/** get department name */
		var ga0 = new GlideAjax('getRecordNameValue')
		ga0.addParam('sysparm_name', 'get')
		ga0.addParam('sysparm_table', 'cmn_department')
		ga0.addParam('sysparm_rec', user.department)
		ga0.getXML(getResponse)
		/** get cost center name */
		var ga2 = new GlideAjax('getRecordNameValue')
		ga2.addParam('sysparm_name', 'get')
		ga2.addParam('sysparm_table', 'cmn_cost_center')
		ga2.addParam('sysparm_rec', user.cost_center)
		ga2.getXML(getResponse)
		/** get manager name */
		var ga3 = new GlideAjax('getRecordNameValue')
		ga3.addParam('sysparm_name', 'get')
		ga3.addParam('sysparm_table', 'sys_user')
		ga3.addParam('sysparm_rec', user.manager)
		ga3.getXML(getResponse)
		/** get oa name */
		var ga4 = new GlideAjax('getRecordNameValue')
		ga4.addParam('sysparm_name', 'get')
		ga4.addParam('sysparm_table', 'u_mode_definition')
		ga4.addParam('sysparm_rec', user.u_oa)
		ga4.getXML(getResponse)
		/** get location name */
		var ga5 = new GlideAjax('getRecordNameValue')
		ga5.addParam('sysparm_name', 'get')
		ga5.addParam('sysparm_table', 'cmn_location')
		ga5.addParam('sysparm_rec', user.location)
		ga5.getXML(getResponse)
		
		function getResponse(response){
			var answer = response.responseXML.documentElement.getAttribute('answer')
			var table = JSON.parse(answer).table
			var field = ''
			
			/** determine output array key */
			if(table === 'cmn_location') field = 'location'
			if(table === 'cmn_department') field = 'department'
			if(table === 'cmn_cost_center') field = 'cost_center'
			if(table === 'sys_user') field = 'manager'
			if(table === 'u_mode_definition') field = 'u_oa'

			if(JSON.parse(answer).status === 200) {
				result[field] = JSON.parse(answer).result
				/** set original_record value (hidden) */
				g_form.setValue('original_record', JSON.stringify(result))
				return
			} else {
				/** handle ajax error */
				g_form.addErrorMessage('[ERROR] ' + 'Status: ' + JSON.parse(answer).status + ', Message: ' + JSON.parse(answer).result)
				return false
			}
		}
	}
}