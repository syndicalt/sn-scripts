var referrer = document.referrer,
	url = window.location.host,
	queryString = window.location.search,
	urlParams = new URLSearchParams(queryString),
	kbArticle = urlParams.get('kb_article'),
	uriPlatformUI = '/nav_to.do?uri=kb_view.do?sysparm_article=' + kbArticle,
	uriEsc = '/esc?id=kb_article_view&sysparm_article=' + kbArticle,
	fwdUrl = new String()

if(!kbArticle) {
	fwdUrl === referrer
} else if (referrer.match(/esc/g)) {
	fwdUrl = 'http://' + url + uriEsc
} else {
	fwdUrl = 'http://' + url + uriPlatformUI
}

if(fwdUrl === referrer) {
	window.history.back()
} else {
	window.open(fwdUrl,'_blank')
	window.history.back()
}