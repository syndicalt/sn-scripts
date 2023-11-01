function onChange(control, oldValue, newValue, isLoading) {
	if(isLoading || newValue == '') {
		return
	}
	
	var selectedOa = g_form.getReference('user_department', setUserOa)
	
	function setUserOa(selectedOa) {
		g_form.setValue('user_oa', selectedOa.u_operating_agency)
		g_form.setValue('user_cost_center', '')
	}
	
}