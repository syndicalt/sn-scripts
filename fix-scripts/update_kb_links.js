var tables = [
    {
        'name':'u_kb_template_problem_solution_v2',
        'fields': ['u_kb_problem', 'u_kb_solution']
    },
    {
        'name':'u_kb_template_question_answer_v2',
        'fields': ['u_kb_question', 'u_kb_answer']
    },   
    {
        'name':'u_kb_template_software_request_v2',
        'fields': [
            'u_kb_approval_routing_path', 
            'u_kb_installation_errors_problems', 
            'u_kb_installation_instructions', 
            'u_kb_post_installation_instructions', 
            'u_kb_software_delivery_method',
            'u_kb_special_delivery_instructions'
        ]
    },
    {
        'name':'u_kb_template_error_cause',
        'fields': ['u_kb_error', 'u_kb_fix']
    },
    {
        'name':'u_kb_template_reference',
        'fields': ['u_kb_article', 'u_kb_article_body']
    } 
]

tables.forEach(function(el) {
    var gr = new GlideRecord(el.name)
    gr.query()
    while(gr.next()) {
        el.fields.forEach(function(field) {
        var srch = gr[field].match(/KM[0-9]{8}/)
        var regexString = new RegExp("<a\\s[^>]*href=\"|.([^\"]*)\"[^>]*>(.*?)<\\/a>",'g')
        if(srch) {
                gr[field] = gr[field].replace(srch,'<a href="' + gs.getProperty('glide.servlet.uri') + '/irs_kbRedirect.do?kb_article=' + srch[0].replace('KM','KB') + '">' + srch[0].replace('KM','KB') + '</a>')
                gr.update()
                gs.info('[UPDATE-KB-LINKS] Updated ' + srch[0] + ' article link to ' + link.number + '.')
            } else {
                gs.into('[UPDATE-KB-LINKS] Could not find KB article for ' + srch[0].replace('KM','KB') + '.')
            }
        })
    }
})