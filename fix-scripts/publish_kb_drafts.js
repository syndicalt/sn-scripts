gs.log("[PUBLISH-KB-TEMPLATES] Starting update script","PUBLISH-KB-TEMPLATES")

gs.setSession.setStrictQuery(true)

var tables = [
    'u_kb_template_problem_solution_v2',
    'u_kb_template_question_answer_v2',   
    'u_kb_template_software_request_v2',
    'u_kb_template_error_cause',
	'u_kb_template_reference'    
]

tables.forEach(function(el){
    var pending = new GlideRecord(el);
    pending.addEncodedQuery('workflow_state=draft^ORworkflow_state=review');
    pending.query()
    gs.log("[PUBLISH-KB-TEMPLATES] Found " + pending.getRowCount() + " records to update.","PUBLISH-KB-TEMPLATES")
    while(pending.next()) {
        gs.log("[PUBLISH-KB-TEMPLATES] Changing: " + pending.number + " to PUBLISHED.","PUBLISH-KB-TEMPLATES")
        pending.workflow_state = 'published'
        pending.update()
    }

    gs.log("[PUBLISH-KB-TEMPLATES] Completed script for table: " + el,"PUBLISH-KB-TEMPLATES")
})