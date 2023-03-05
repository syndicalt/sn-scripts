/**
 * @function onLoad
 * @description this function is called when the form loads. it will check if the kb_category field is empty and if so, it will populate it using the value of the category field.
 */
function onLoad() {	
	g_form.setVisible('category', false)
	
	var ga = new GlideAjax('irs_kbCategoryOperations')
	ga.addParam('sysparm_name','get')
	/** get data from irs.knowldge.categoryMap */
	ga.getXMLAnswer(function(answer){
		var response = JSON.parse(answer),
			catMap = JSON.parse(response.result)
		
		if(response.status !== 200) {
			g_form.addErrorMessage(catMap)
			return false
		}
		
		if(!g_form.getValue('kb_category')) {
			var kbCategory = g_form.getValue('category'),
				kb = g_form.getValue('kb_knowledge_base'),
				/** get sys_id from kb_category table querying on knowledge base and label */
				ga1 = new GlideAjax('irs_kbCategoryOperations')
				ga1.addParam('sysparm_name','query'),
				ga1.addParam('sysparm_kb', kb)

				if(catMap['Database'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Database')
				if(catMap['Email'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Email')
				if(catMap['Hardware'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Hardware')
				if(catMap['Network'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Network')
				if(catMap['Security'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Security')
				if(catMap['Software'].indexOf(kbCategory) > -1) ga1.addParam('sysparm_category','Software')
				
				ga1.getXMLAnswer(function(answer){
					var response = JSON.parse(answer)
					
					if(response.status != 200) {
						g_form.addErrorMessage(response.result)
						return false
					}
					
					try{
						g_form.setValue('kb_category', response.result)
					}catch(e){
						g_form.addErrorMessage(e)
					}
				})
		}
	})
}
