var gr = new GlideRecord('cmn_location'),
	locName
gr.query()
while(gr.next()) {
	if(gr.name) locName = '(' + gr.name + ')'
	gr.u_display_name = gr.u_location_code + ' ' + locName
	gr.update()
}