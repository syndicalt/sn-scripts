function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading) {
		return;
	}

	var last = g_form.getValue('surname') ? g_form.getValue('surname') + ', ': ''
	var first = g_form.getValue('preferred_name') ? g_form.getValue('preferred_name') + ' ' : g_form.getValue('given_name') + ' '
	var middle = g_form.getValue('middle_name') ? g_form.getValue('middle_name') + ' ' : ''
	var ctrFlag = g_form.getValue('account_type') == 'contractor' ? 'CTR ' : ''
	var oa = g_form.getValue('user_oa') ? '(' + g_form.getDisplayValue('user_oa') + ')' : ''
	var constructedName = last + first + middle + ctrFlag + oa

	g_form.setValue('name', constructedName)
}