function onChange(control, oldValue, newValue, isLoading) {
	/** array of form fields */
	var fields = g_form.getFieldNames()
	/** always show */
	var requestorFields = [
		'container_requestor_details_start',
		'container_requestor_details_end',
		'break_user_record_start',
		'break_user_record_end',
		'requested_for', 
		'manager'
	]
	/** required fields */
	var requiredFields = [
		'account_type', 
		'business_phone', 
		'given_name',
		'user_location',
		'surname', 
		'user_department',
		'user_manager',
		'user_oa',
		'user_cost_center',
		'job_title'
	]
	/** fields locked for editng */
	var lockedFields = [
		'name', 
		'street_address', 
		'city', 
		'state', 
		'postal_code',
		'samaccountname'
	]
	/** fields editable per role */
	var modal_hr_role = [
		'given_name', 
		'preferred_name', 
		'middle_name', 
		'surname', 
		'remote_user',
		'user_location', 
		'business_phone', 
		'mobile_phone', 
		'user_manager',
		'user_oa', 
		'user_department', 
		'user_cost_center',
		'job_title', 
		'hire_date',
		'account_type'
	]
	var dept_hr_role = [
		'given_name', 
		'preferred_name', 
		'middle_name', 
		'surname', 
		'remote_user',
		'user_location', 
		'business_phone', 
		'mobile_phone', 
		'user_manager',
		'user_oa', 
		'user_department', 
		'user_cost_center',
		'job_title', 
		'hire_date',
		'account_type'
	]
	var service_desk_role = [
		'given_name', 
		'preferred_name', 
		'middle_name', 
		'surname', 
		'remote_user',
		'user_location', 
		'business_phone', 
		'mobile_phone', 
		'user_manager',
		'user_oa', 
		'user_department', 
		'user_cost_center',
		'job_title', 
		'hire_date',
		'account_type'
	]
	var telecom_role = [
		'given_name', 
		'preferred_name', 
		'middle_name', 
		'surname', 
		'remote_user',
		'user_location', 
		'business_phone', 
		'mobile_phone', 
		'user_manager',
		'user_oa', 
		'user_department', 
		'user_cost_center',
		'job_title', 
		'hire_date',
		'account_type'
	]
	var user_role = [
		'given_name', 
		'preferred_name', 
		'middle_name', 
		'surname', 
		'remote_user',
		'user_location', 
		'business_phone', 
		'mobile_phone', 
		'user_manager',
		'user_oa', 
		'user_department', 
		'user_cost_center',
		'job_title', 
		'hire_date',
		'account_type'
	]
	
	/** configure form and clear values if loading or no user record */
	if (isLoading || newValue == '') {
		/** remove fields from dom if user_record is cleared */
		fields.forEach(function(field) {
			if(field != 'user_record') g_form.setMandatory(field, false)
			if(requestorFields.indexOf(field) === -1) g_form.setVisible(field, false)
		})
		
		/** clear form values when user record is cleared */
		g_form.setValue('name', '')
		g_form.setValue('preferred_name', '') //
		g_form.setValue('middle_name', '')
		g_form.setValue('given_name', '')
		g_form.setValue('surname', '')
		g_form.setValue('user_location', '')
		g_form.setValue('remote_user', '')
		g_form.setValue('business_phone', '')
		g_form.setValue('mobile_phone', '') //
		g_form.setValue('user_manager', '')
		g_form.setValue('user_department', '')
		g_form.setValue('user_cost_center', '')
		g_form.setValue('user_oa', '')
		g_form.setValue('job_title', '') //
		g_form.setValue('hire_date', '') //
		g_form.setValue('account_type', '') //
		g_form.setValue('samaccountname', '')
		return;
	}
	
	/** get requested_for reference record to compare oa values for modal_hr */
	g_form.getReference('requested_for', function(requestor) {
		/** get user_record reference value to populate variables */
		var user = g_form.getReference('user_record', setUserValues)

		function setUserValues(user) {
			/** handle records locked for ad update */
			if(user.u_record_locked === 'true') {
				fields.forEach(function(field) {
					if(field === 'user_record') return
					g_form.setMandatory(field, false)
					if(requestorFields.indexOf(field) === -1) g_form.setVisible(field, false)
				})
				g_form.showFieldMsg('user_record','Record locked for AD update!','error')
				return
			}
			
			/** loop each field and process actions */
			fields.forEach(function(field) {
				if(field === 'original_record') {
					g_form.setVisible(field, false)
					return
				}
				if(field != 'user_record') g_form.setReadOnly(field, true)
				var userSysId = user.sys_id
				var userOa = user.u_oa
				var requestorOa = requestor.u_oa
				
				/** set fields visible and set locked field read-only */
				g_form.setVisible(field, true)
				
				/** field security for admin role */
				if(g_user.hasRole('dirmgr.admin')) {
					if(lockedFields.indexOf(field) > -1 || requestorFields.indexOf(field) > -1) return 
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
				/** field security for modal_hr role */
				if(g_user.hasRole('dirmgr.modal_hr') && modal_hr_role.indexOf(field) > -1 /*&& userOa === requestorOa*/) {
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
				/** field security for dept_hr role */
				if(g_user.hasRole('dirmgr.dept_hr') && dept_hr_role.indexOf(field) > -1) {
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
				/** field security for service_desk role */
				if(g_user.hasRole('dirmgr.service_desk') && service_desk_role.indexOf(field) > -1) {
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
				/** field security for telecom role */
				if(g_user.hasRole('dirmgr.telecom') && telecom_role.indexOf(field) > -1) {
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
				/** field security for user role */
				if(userSysId === requestor.sys_id && user_role.indexOf(field) > -1) {
					g_form.setReadOnly(field, false)
					if(requiredFields.indexOf(field) > -1) g_form.setMandatory(field, true)
					return
				}
			})

			/** set field values */
			g_form.setValue('name', user.name)
			g_form.setValue('preferred_name', user.u_preferred_name) //
			g_form.setValue('middle_name', user.middle_name)
			g_form.setValue('given_name', user.first_name)
			g_form.setValue('surname', user.last_name)
			g_form.setValue('user_location', user.location)
			g_form.setValue('remote_user', user.u_remote)
			g_form.setValue('business_phone', user.phone)
			g_form.setValue('mobile_phone', user.mobile_phone) //
			g_form.setValue('user_manager', user.manager)
			g_form.setValue('user_department', user.department)
			g_form.setValue('user_cost_center', user.cost_center)
			g_form.setValue('user_oa', user.u_oa)
			g_form.setValue('job_title', user.title) //
			g_form.setValue('hire_date', user.u_hire_date) //
			g_form.setValue('account_type', user.u_account_type) //
			g_form.setValue('samaccountname', user.u_samaccountname)
		}
	})
}