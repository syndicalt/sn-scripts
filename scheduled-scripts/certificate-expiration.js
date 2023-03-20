var gr= new GlideRecord('cmdb_ci_certificate');
gr.addQuery('active', true);  
gr.query();      

while (gr.next()) {
    var dateDiff = gs.dateDiff(gr.getDisplayValue('valid_to'), gs.nowDateTime(), false)
    dateDiff = holder.split(' ')[0]
    
    switch(dateDiff) {
        case 120:
            gs.eventQueue('certificate.expiring.60',gr)
            break
        case 90:
            gs.eventQueue('certificate.expiring.90',gr)
            break
        case 60:
            gs.eventQueue('certificate.expiring.60',gr)
            break
        case 30:
            gs.eventQueue('certificate.expiring.30',gr)
            break
        case 15:
            gs.eventQueue('certificate.expiring.15',gr)
            break
        default:
            break
    }
}

