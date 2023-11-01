function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading || newValue == '') {
		return;
	}
	
	var user = g_form.getReference('user_record', setValues)
	
	function setValues(user) {
		if(g_form.getValue('remote_user') === 'true') {
			g_form.setLabelOf('user_location', 'Location (Closest DOT Facility)')
			g_form.setValue('user_location', '')
			g_form.setDisabled('street_address', true)
			g_form.setValue('street_address', 'Remote')
			g_form.setValue('city', '')
			g_form.setDisplay('city', false)
			g_form.setLabelOf('state', 'State/Province (Home/Remote)')
			g_form.setMandatory('state', true)
			g_form.setValue('state', '')
			g_form.setReadOnly('state', false)
			g_form.setDisplay('postal_code', false)
			g_form.setValue('postal_code', '')
			return
		}
		
		g_form.setValue('user_location', user.location)
		if(!user.location) g_form.setMandatory('user_location', true)
		g_form.setLabelOf('user_location', 'Location')
		g_form.setDisplay('city', true)	
		g_form.setReadOnly('city', true)
		g_form.setLabelOf('state', 'State/Province')
		g_form.setMandatory('state', false)
		g_form.setReadOnly('state', true)
		g_form.setDisplay('postal_code', true)
		g_form.setReadOnly('postal_code', true)
	}
}