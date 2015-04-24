;$.fn.extend({
	customFileInput:function(setting){ 
		setting=$.extend({
			text:'浏览',
			inputClass:'',
			inputExtra:'',
			buttonClass:'',
			buttonExtra:'',
			onChange:undefined
		},setting);
		
		return this.each(function(){
			var $this=$(this);
			if(this._fileInputCustomed||!$this.is('input:file'))return;
			
			this.wrapper=$this.wrap('<div />').parent().addClass('customFileInputWrapper inputWrapper' + this.name||this.id );
			this.fakeInput=$('<input type="text" autocomplete="off" '+setting.inputExtra+'/>').addClass($this.attr('class')+' '+setting.inputClass);
			this.fakeButton=$('<button '+setting.buttonExtra+'><span>'+setting.text+'</span></button>').addClass(setting.buttonClass);
			
			this.fakeInput
					.wrap('<div />')
					.parent()
						.addClass('customFileInputFakeWrapper fakeWrapper' + this.name||this.id )
						.append(this.fakeInput)
						.append(this.fakeButton)
					.prependTo(this.wrapper);
			//init styles
			$this.hide();
			this.wrapper.css({'position':'absolute'}).css({
				'position':'relative',
				// 'width':this.wrapper.width()+'px'
			}).css({'overflow':'hidden'});
			$this.css({
					'background-color':'#000',
					'border':'medium none',
					'outline':'medium none',
					'cursor':'pointer',
					'position':'absolute',
					'font-size':'900px',
					'top':'-10px',
					'right':'0',
					'opacity':'0',
					'filter' : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0,finishOpacity=100)'
			}).attr('size',500);

			$this.show();
			this.fakeInput.trigger('readonly')
			
			var that=this;
			$this.bind('change',function(){
				that.fakeInput.val(this.value);
				if(setting.onChange){
					setting.onChange.call(this,this.value);	
				}
			})
		});
	}
});
