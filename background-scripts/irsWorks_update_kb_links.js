/*
    This script loops through all KB tables, and fields on the KB tables, and updates the links to the KB articles. 
    It also sanitizes KM article numbers to KB.

    Author: Nicholas Blanchard
*/

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

var instanceUrl = gs.getProperty('glide.servlet.uri') + 'esc?id=kb_article_view&sysparm_article='
var regexHref = /(href)/
var regexTarget = /target="_blank"/

tables.forEach(function(table) {
    var gr = new GlideRecord(table.name)
    gr.setLimit(20)
    gr.query()

    while(gr.next()) {
        table.fields.forEach(function(field){
            var fieldsArr = gr[field].split('<')
            
            fieldsArr.forEach(function(el, i){
                if(el.match(regexHref)) {
                    var url = el.match(/(https)+[^\s]+[\w]/)
                    var kbNo = el.match(/KM\d{8}|KMPR\d{4}|KB\d{8}|KBPR\d{4}/)
                    if(url && kbNo) { 
                        var res = recordSearch(kbNo[0].replace('KM','KB'))  
                        if(res) {
                            fieldsArr[i] = fieldsArr[i].replace(url[0], instanceUrl + kbNo[0].replace('KM','KB'))
                            gr[field] = fieldsArr.join('<')
                            gs.print(gr[field])
                            gr.update()
                        } else {
                            gs.print('[KB URL Builder v2.1.0] - ' + gr.number + ' - No record found for link to ' + kbNo[0] + ' (URL: ' + instanceUrl + kbNo[0] + ')')
                        }
                    }
                }

                if(el.match(regexTarget)) fieldsArr[i] = fieldsArr[i].replace(regexTarget,'') 
            })
        })
    }
})

function recordSearch(val) {
    var gr = new GlideRecord('kb_knowledge')
    gr.addQuery('number', val)
    gr.query()
    
    if(gr.next()) return true

    return false
}