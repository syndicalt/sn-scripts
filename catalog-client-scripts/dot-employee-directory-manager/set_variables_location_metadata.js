function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading || newValue == '' || g_form.getValue('remote_user') === 'true') {
		g_form.setValue('city', '')
		g_form.setValue('state', '')
		g_form.setValue('postal_code', '')
		return;
	}
	
	if(g_form.getValue('remote_user') === 'false') {
		var userLocation = g_form.getReference('user_location', setLocation)
		
		function setLocation(userLocation) {
			g_form.setValue('street_address', userLocation.street)
			g_form.setValue('city', userLocation.city)
			g_form.setValue('state', userLocation.state)
			g_form.setValue('postal_code', userLocation.zip)
		}
	}
}