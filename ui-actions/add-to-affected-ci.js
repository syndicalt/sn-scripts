var gr = new GlideRecord('sys_attachment')
gr.addEncodedQuery('table_sys_id=' + current.sys_id + '^file_name=affected_ci.csv')
gr.addQuery('content_type','application/vnd.ms-excel')
gr.query()

if (gr.next()) {
    var sa = new Packages.com.glide.ui.SysAttachment(),
        binData = sa.getBytes(gr),
        string = new Packages.java.lang.String(binData),
        arr = string.split("\n")
    
    gs.log('[Add CI from CSV] Binary:' + string)
     

    arr.forEach(function(item, index) {
        var taskCI = new GlideRecord('task_ci'),
            str = item.toString(),
            len = str.length(),
            newStr = str.substring(0,len-2),
            ci_sys_id = getCI(newStr)
        
        if(ci_sys_id) {
            taskCI.initialize()
            taskCI.task = current.sys_id
            taskCI.ci_item = ci_sys_id
            taskCI.insert()
        } else {
            gr.addInfoMessage('CI '+ arr<i> + ' not found in CMDB.')
        }
    })
    
    action.setRedirectURL(current)
} else {
    gs.addInfoMessage("Attachment not found! Please attach a CSV file named affected_ci.csv")
    action.setRedirectURL(current)
}

function getCI(host) {
    var gr = new GlideRecord('cmdb_ci')
    gr.addQuery('name','STARTSWITH',host)
    gr.query()
    
    if(gr.next()) {
        return gr.sys_id
    }
    
    return null
}