
;(function ($,undefined) {
	'use strict';
	
	$.fn.extend({
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

	$(document.body).on('error', 'input, select', function(e, msg){
		var $t = $(getTarget(e)).closest('.form-group'), $control = $(getTarget(e));

		if($t.length)$t.addClass('has-error'); 
		var $line = $control.parent();
			if( $line.prop('className').indexOf('group')>-1){
				$line = $line.parent();
			}
			$line.append([
				'<div class="alert alert-danger" role="alert">',
					'<i class="icon-danger"></i> ',
					(msg || $control.data('error')), 
				'</div>'
			].join("\n"));
	}).on('readonly','input:text',function(){
		$(this).prop('readonly', true).addClass('txt-readonly');
	}).on('editable','input:text',function(){
		$(this).prop('readonly', false).removeClass('txt-readonly');
	}).on('disable','input:text',function(){
		$(this).prop('disabled', true).addClass('txt-disabled');
	}).on('enable','input:text',function(){
		$(this).prop('disabled', false).removeClass('txt-disabled');
	}).on('disable','.input-group',function(){
		$(this).addClass('input-group-disabled');
	}).on('enable','.input-group',function(){
		$(this).removeClass('input-group-disabled');
	}).on('disable','label',function(){
		$(this).addClass('input-group-disabled');
		$(this).find('input').prop('disabled', true);
	}).on('enable','label',function(){
		$(this).removeClass('input-group-disabled');
		$(this).find('input').prop('disabled', false);
	}).on('disable','button',function(){
		$(this).prop('disabled', true).addClass('btn-disabled');
	}).on('enable','button',function(){
		var $t= $(this);
		if($t.data('content')){
			$t.html($t.data('content'));
			$t.data('content','');
		}
		$t.prop('disabled', false)
			.removeClass('btn-disabled')
			.removeClass('btn-loading')
			.removeClass('btn-success')
			.removeClass('btn-error');
	}).on('success','button',function(){
		var $t= $(this);
		if($t.data('success')){
			$t.html($t.data('success'));
		}
		$t.prop('disabled', true)
			.removeClass('btn-disabled')
			.removeClass('btn-loading')
			.removeClass('btn-error')
			.addClass('btn-success');
	}).on('loading','button',function(){
		var $t= $(this);
		$t.data('content', $t.html());
		$t.html('<i class="icon-loading"> <em class="rect1"></em> <em class="rect2"></em> <em class="rect3"></em> <em class="rect4"></em> <em class="rect5"></em> </i>');
		$t.prop('disabled', true).addClass('btn-loading');
	}).on('error','button',function(e, msg){
		var $t= $(this);
		if($t.data('errortimeout'))clearTimeout($t.data('errortimeout'));

		if($t.data('content') && $t.data('content') !== ''){
			if($t.data('error')){
				$t.html($t.data('error'));
			}else{
				$t.html($t.data('content'));
				$t.data('content','');
			}
		}else if($t.data('error')){
			$t.data('content', $t.html());
			$t.html($t.data('error'));
		}
		if(msg){
			var $line = $t.closest('[class*="col-"]');
			$line.append([
				'<div class="alert alert-danger" role="alert">',
					'<i class="icon-danger"></i> ', 
					msg, 
				'</div>'
			].join("\n"));
		}

		$t.prop('disabled', true).addClass('btn-error');
		$t.data('errortimeout', setTimeout((function(){$t.trigger('enable')}), 3000));
	}).on('requesting', function(){
		var $loading = $('<div class="loading-full"><i class="icon-loading"> <em class="rect1"></em> <em class="rect2"></em> <em class="rect3"></em> <em class="rect4"></em> <em class="rect5"></em> </i></div>');
		$(document.body).append($loading);
		$loading.fadeIn('150');
	}).on('request_complete', function(){
		$('.loading-full').fadeOut('150', function(){
			$(this).remove();
		});
	}).on('click','input:checkbox[role="check-total"]',function(e) {
		var $t = $(this),n = $t.attr('name');
		//全选
		if($t.is(':checked')){
			//把没选中的 执行click
			$(':checkbox[role="check-item"][name="' + n + '"]:not(:checked)').click();
		}
		//反选
		else{
			//把选中的 执行click
			$(':checkbox[role="check-item"][name="' + n + '"]:checked').click();
		}
	}).on('click','input:checkbox[role="check-item"]',function(e) {
		var $t = $(this),n = $t.attr('name');
		var total = $(':checkbox[role="check-total"][name="' + n + '"]');
		if($t.is(':checked')){
			if($(':checkbox[role="check-item"][name="'+n+'"]:not(:checked)').length==0){
				total.attr('checked','checked');
				total.siblings('.customCheckbox').addClass('customCheckbox_checked');
			}
		}else{
			total.removeAttr('checked');
			total.siblings('.customCheckbox').removeClass('customCheckbox_checked');
		}
	}).on('click', '[role=page]', function (e) {
		var $t = $(getTarget(e)), $tab;

		//find page-item
		$t = $t.is('[role=page-item]')? $t : $t.closest('[role=page-item]');

		//valid page-item, skip active one
		if(!$t.length || $t.hasClass('active'))return;
		//find tab
		$tab = $(this);

		//publish event message
		var tabName = $tab.data('page-name'), tab = $t.attr('data-pager');
		if(tabName && tab !==""){
			$.publish('page_'+tabName+'_changed', tab);
		}
	}).on('click', '[role=tab]', function (e) {
		var $t = $(getTarget(e)), $tab;

		//find tab-item
		$t = $t.is('[role=tab-item]')? $t : $t.closest('[role=tab-item]');

		//valid tab-item, skip active one
		if(!$t.length || $t.hasClass('active'))return;
		//find tab
		$tab = $(this);

		//style class
		$tab.find('.active').removeClass('active');
		$t.addClass('active');

		//publish event message
		var tabName = $tab.data('tab-name'), tab = $t.data('tab');
		if(tabName && tab !==""){
			console.log('tabName:',tabName);
			console.log('tab:',tab);
			$.publish('tab_'+tabName+'_changed', tab);
		}
	}).on('click', '[role=label-select]', function(e){
		var $t = $(getTarget(e));
		if($t.is('.ac_customselect_show') || $t.closest('.ac_customselect_show').length)return;
		$.publish('click_customselect_show', $('.ac_customselect_show', this));
	}).on('click', '[role=button]', function(e){
		var $t = $(getTarget(e));
		console.log($t);
		//find button
		$t = $t.is('[role=button]')? $t : $t.closest('[role=button]');
		
		if($t.data('toggle')){
			$t.closest('.'+$t.data('toggle')).toggleClass('open');
		}
	});

	$(document).ajaxStart(function() {
		$(document.body).trigger('requesting');
	}).ajaxComplete(function() {
		$(document.body).trigger('request_complete');
	});
}());

/*
	form-actions

	$('.form-group').trigger('error', msg);
	msg String Optional default: $control.data('error')


	has-error
	<div class="alert alert-danger" role="alert">
		<i class="icon-danger"></i> 请将文字控制在12字之内
	</div>
*/
function isValid($t){
	$t = $t.jquery? $t: $($t);
	var validateIf = $t.data('validateif') || $t.data('validate-if');
	if(validateIf){
		try{
			var validateOrNot = eval(validateIf);
			if(!validateOrNot)return true;
		}catch(e){console.log(e)}
	}
	return (new RegExp($t.data('validate'))).test($t.val());
}

/*
	所有被选中
*/
function allChecked() {
	var _arr=[];
	$(':checkbox[role="check-item"]:checked').each(function() {
		_arr[_arr.length] = $(this).attr('data-item');
	});
	return _arr;
}

/*
	escape
*/
function escapeHtml(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
/*
	unescape
*/
function unscapeHtml(text){
	var map = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		"&#039;": "'",
		"&apos;": "'"
	};
	return text.replace(/(&amp;|&lt;|&gt;|&quot;|&#039;|&apos;)/g, function(m) { return map[m]; });
}

/*
	比较两个日期大小。
	date1 > date2 return true
	else return false
*/
function compareDate(date1,date2) {
	if(isNaN(date1) || isNaN(date2)){
		return false;
	}

	if(date1 && date1.toString().length < 13){
		date1 = date1.toString() + '000';
	}

	if(date2 && date2.toString().length < 13){
		date2 = date2.toString() + '000';
	}

	date1 = parseInt(date1);
	date2 = parseInt(date2);
	if(date1 > date2){
		return true;
	}else{
		return false;
	}
}

/*
	get datetime
*/
function getDateTime(dt) {
	if(isNaN(dt)){
		return dt;
	}
	if(dt && dt.toString().length < 13){
		dt = dt.toString() + '000';
	}
	var date = new Date(parseInt(dt)),
	h = date.getHours(),
	m = date.getMinutes(),
	y = date.getFullYear(),
	M = date.getMonth() + 1,
	d = date.getDate();

	return y + '-' + timeFormat(M) + '-' + timeFormat(d) + ' ' + timeFormat(h) + ':' + timeFormat(m);
}

/*
	get date
*/
function getDate(dt) {
	if(isNaN(dt)){
		return dt;
	}
	if(dt && dt.toString().length < 13){
		dt = dt.toString() + '000';
	}
	var date = new Date(parseInt(dt)),
		y = date.getFullYear(),
		M = date.getMonth() + 1,
		d = date.getDate();
	return y + '-' + timeFormat(M) + '-' + timeFormat(d);
	// return new Date(parseInt(dt)).toLocaleString().replace(/\//g,'-').split(' ')[0];
}

/*
	date and time format
*/
function timeFormat (num) {
	num = parseInt(num);
	if(num < 10){
		num = '0' + num.toString();
	}
	return num;
}

/*
	split num with ',' like 12,345 
*/
function splitNumber(num){
	return (+num).toLocaleString();	 
}

/*
	change money unit
*/
function calcMoney(money){
	if(!money)return 0;
	intMoney = parseInt(money);
 	var wei = intMoney.toString().length, unit = '', arrMoney = [], floatMoney = 0;

 	if(wei>12){
 		var tmMoney = intMoney / 1000000000000;
		floatMoney = tmMoney.toFixed(4 - parseInt(tmMoney).toString().length);
		unit = '万亿';
 	} else if(wei > 9){
		var tmMoney = intMoney / 100000000;
		floatMoney = tmMoney.toFixed(4 - parseInt(tmMoney).toString().length);
		unit = '亿';
 	}else if(wei == 9){
 		var tmMoney = intMoney / 100000000;
 		floatMoney=tmMoney.toFixed(1);
 		unit = '亿';
 	} else if(wei > 5){
		var tmMoney = intMoney / 10000;
		floatMoney = tmMoney.toFixed(4 - parseInt(tmMoney).toString().length);
		unit = '万';
	}else if(wei == 5){	 
		var tmMoney = intMoney / 10000;	 
		floatMoney = tmMoney.toFixed(1);
		unit = '万';
	}else if(wei > 0){
		floatMoney = (+money).toFixed(4);
	}
	arrMoney = floatMoney.toString().split('.');
	if(!arrMoney[1] || parseInt(arrMoney[1]) == 0){
		return arrMoney[0] + unit;
	}else{
		return arrMoney[0]+'.'+((arrMoney[1]+'').substr(0,2))+unit;
	}
}

/*
	utils
*/
function getTarget(e){
	return e.target || e.srcElement || e.originalTarget;
}

/*
	num1 * num2
*/
function accMul(arg1,arg2){
	if(arg2==undefined || arg1 == undefined){return 0;}
    var m = 0,s1 = arg1.toString(), s2 = arg2.toString();
    try{ m += s1.split(".")[1].length }catch(e){ }
    try{ m += s2.split(".")[1].length }catch(e){ }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);	 
}

/*
	num1 + num2
*/
function accAdd(arg1,arg2){	
    var r1, r2, m, arg1 = arg1 || 0, arg2 = arg2 || 0;
    try{ r1 = arg1.toString().split(".")[1].length }catch(e){ r1 = 0; }
    try{ r2 = arg2.toString().split(".")[1].length }catch(e){ r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));	 
    return (arg1 * m + arg2 * m) / m;
}

/*
	num1 / num2
*/
function accDiv(arg1,arg2){	
	if(arg2 == undefined || arg1 == undefined || arg2 == '' || arg1 == ''){return 0;}
	var t1 = 0,t2 = 0,r1,r2;
	if(arg1 == 'undefined' || arg2 == 'undefined')return 0;
    try{t1 = arg1.toString().split(".")[1].length}catch(e){ }
    try{t2 = arg2.toString().split(".")[1].length}catch(e){ }
    with(Math){	 
        r1 = Number(arg1.toString().replace(".",""));
        r2 = Number(arg2.toString().replace(".",""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

/*
	json -> k=v&k1=v1&...
*/
function jsonToUrl (json) {
	var urlStr = '';
	if(json){
		for(var key in json){
			urlStr = urlStr + '&' + key + '=' + json[key];
		}
		urlStr = urlStr.substr(1);
	}
	return urlStr;
}