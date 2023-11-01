function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue === '') {
		g_form.clearMessages('business_phone')
        return;
    }

    var regex = /[(]?\d{3}[-.)\s]?[ ]?\d{3}[-.\s]?\d{4}\b/

    if (!regex.test(newValue)) {
        g_form.showFieldMsg('business_phone', 'Please enter a valid US phone number.', 'error')
        return
    }

    var cleaned = ('' + newValue).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        var formatted = '(' + match[1] + ') ' + match[2] + '-' + match[3]
        g_form.setValue('business_phone', formatted)
    } else {
        g_form.showFieldMsg('business_phone', 'Please enter a valid US phone number.', 'error')
    }
}