function onSubmit() {
	var user = g_form.getReference('user_record', checkUser)
	
	function checkUser(user) {
		if(!user) return false
		
		if(user.u_record_locked == 'true') {
			g_form.addErrorMessage('This request cannot be submitted at this time.')
			return false
		}
		
		return true
	}
}