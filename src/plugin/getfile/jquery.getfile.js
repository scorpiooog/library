;$.extend({
	getFile:function(url,para){
		
		para = (para ? jsonToUrl(para) : false) || '';
		var formcontent = '<iframe class="hidden" src="'+url+'?'+para+'"></iframe>';
		$(formcontent).appendTo('body');
	}
});