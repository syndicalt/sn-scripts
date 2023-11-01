function onLoad() {
	var fields = g_form.getFieldNames()
	var requestorFields = [
		'container_requestor_details_start', 
		'container_requestor_details_end',
		'break_user_record_start',
		'break_user_record_end',
		'requested_for', 
		'manager'
	]
	
	fields.forEach(function(field){
		if(requestorFields.indexOf(field) === -1) g_form.setVisible(field, false)
	})
}