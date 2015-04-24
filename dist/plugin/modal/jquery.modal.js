/*
 * 模态框， jQuery 插件
 *
 * wangbaoguo
 *
 */
;(function ($) {
	$.extend({
		modal:function(para){
			para =$.extend({
				titleLine:true,
				title:'',
				message:'',
				footers:[
					{
						name:'确定',
						className:'btn btn-primary',
						clickFun:function(){$.modalHide()}
					}
				]
			}, para);

			var tmbtn,$f;

			if(!$(document.body).data('hasmodal')){
				$(document.body).data('hasmodal',true);
				var title = para.title ? (para.titleLine?'<h3>' + para.title + '</h3>' : '<h2 class="no-underline">' + para.title + '</h2>') : '';
				var container = ['<div class="modal">',
								'<div class="modal-dialog"><div class="modal-content'+(para.titleLine?'':' bg-reverse')+'">',
									'<div class="modal-header">',
										title,
										'<i class="icon-close-primary close"></i></div>',
									'<div class="modal-body">'+para.message+'</div>',
									'<div class="modal-footer"></div></div></div></div>'].join('');
				$(document.body).append(container);
				$('.modal .icon-close-primary').on('click',function(){
					$.modalHide();
				});
			}
			$('.modal-header span').html(para.title);
			$('.modal-body').html(para.message);

			$f = $('.modal-footer');
			$f.html('');
			for (var i = 0,length = para.footers.length; i < length; i++) {
				tmbtn = para.footers[i];
				$('<button class="btn">'+tmbtn.name+'</button>').addClass(tmbtn.className).on('click',tmbtn.clickFun).appendTo($f);
			};

			var backdrop = '<div class="modal-backdrop"></div>';
			$(document.body).addClass('modal-open').append(backdrop);
		},
		modalHide:function(){
			$(document.body).removeClass('modal-open');
			$('.modal').fadeOut(300);
			$('.modal-backdrop').fadeOut(300,function(){
				$('.modal-backdrop').remove();
			});
		},

	});	
}(jQuery));