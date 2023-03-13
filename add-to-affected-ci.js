var gr = new GlideRecord('sys_attachment')
gr.addEncodedQuery('table_sys_id=' + current.sys_id + '^file_name=affected_ci.csv')
gr.addQuery('content_type','application/vnd.ms-excel')
gr.query()

if (gr.next()) {
     var sa = new Packages.com.glide.ui.SysAttachment()
     var binData = sa.getBytes(gr)
     var string = new Packages.java.lang.String(binData)
     gs.log(string)
     var arr = string.split("\n")
     for(i=0; i<arr.length ; i++){
         var taskCI = new GlideRecord("task_ci")
         taskCI.initialize()
         taskCI.task = current.sys_id
         var str = arr<i>.toString()
         var len = str.length()
         var newStr = str.substring(0,len-2)
         var grA = new GlideRecord("cmdb_ci")
         grA.addQuery("name",'STARTSWITH',newStr)
         grA.query()
         if(grA.next()){
             taskCI.ci_item = grA.sys_id
             taskCI.insert()
         }
         else {
             gs.addInfoMessage('CI '+ arr<i> + ' not found in CMDB.')
         }
     }
     action.setRedirectURL(current)
} else {
     gs.addInfoMessage("Attachment not found! Please attach a CSV file named affected_ci.csv")
     action.setRedirectURL(current)
}
