;$.fn.extend({
	/*
		$select.alterOptions({key:value, key:value, ...., key:value }, {
			"emptyText": "请选择xxx"}
		});
	*/
	alterOptions: function(optionList, setting){
		var tmpHTML = [];
		setting = $.extend({
						"selected": undefined,
						"emptyText": undefined
					}, setting);
		if(setting.emptyText){
			tmpHTML.push('<option value="">'+setting.emptyText+'</option>');
		}
		if(!$.isEmptyObject(optionList)){
			for(var key in optionList){
				if(optionList.hasOwnProperty(key)){
					tmpHTML.push('<option value="'+key+'"'+(key===setting.selected?' selected="selected"':'')+'>'+optionList[key]+'</option>');
				}
			}
		}
		tmpHTML = tmpHTML.join("\n");
		return this.filter('select').each(function(){
			$(this).html(tmpHTML).trigger('update');
		});
	}
});