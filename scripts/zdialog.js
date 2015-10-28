window.grape = {};

/**
 * 弹出框简易插件
 */
grape.dialog = {
	_alert: function(params) {
		var html='';
		if(params['layer']) {
			html += '<div class="alert-layer"></div>';
		}
		if(params['extra'] != undefined && params['extra'].length > 0) {
			html += params['extra'];
		}
		html += '<div class="alert-content">';
//		html += '<header><i class="icon-guanbi"></i></header>';
//		if(params['title'] != undefined && params['title'].length > 0) {
//			html += '<h1><i class="icon-baocuo"></i><span>'+params['title']+'</span></h1>';
//		}
		if(params['message'] != undefined && params['message'].length > 0) {
			html += '<div>'+params['message']+'</div>';
		}
		var btn='';
		//隐藏按钮
		if(params['close']) {
			
		}else {
			btn = '<a class="btn-link btn btn-block close" href="javascript:void(0)">确定</a>';
		}
		//显示取消按钮
		if(params['cancel']) {
			btn = '<a class="btn-link btn btn-block cancel" href="javascript:void(0)">确定</a>';
			btn += '<a class="btn-link btn btn-block close" href="javascript:void(0)">取消</a>';
		}
		html += btn;
		html += '</div>';
		return html;
	},
	alert: function(params) {
		var $alert = $('#alert_info');
		var scrollTop = $('body').scrollTop();
		var screen = window.screen.height;
		var height = $(document).height();
		if(height < screen) {
			height = screen;
		}
		//由于要显示一个箭头 所以改成fixed属性
//		var top = 120+scrollTop;
//		if(scrollTop == 0) {
//			top = '30%';
//		}
		
		var content = this._alert(params);
		if($alert.length > 0) {
			$alert.html(content).show();
//			$alert.find('.alert-content').css('top', top);
			$alert.one('tap', '.cancel', function() {//重新绑定cancel事件
				$(this).closest('.alert').hide();
				if(params['cancel']) {
					params['cancel'].apply();
				}
			});
			return;
		}
		var html = '<aside class="alert" id="alert_info">';
		html += content;
		html += '</aside>';
		$('body').append(html);	
		$('#alert_info').find('.alert-layer').css('height', height);
		$('#alert_info').find('.alert-content').css('top', top);
		$('#alert_info').on('tap', '.close', function() {
			$(this).closest('.alert').hide();
			if(params['closeFn']) {
				params['closeFn'].apply();
			}
		}).on('tap', '.alert-layer', function() {
			$(this).closest('.alert').hide();
		}).one('tap', '.cancel', function() {
			$(this).closest('.alert').hide();
			if(params['cancel']) {
				params['cancel'].apply();
			}
		});
  },
  close: function() {
  	$('#alert_info').hide();
  }
};

//申请提现 额外操作
function custom_cash(val) {
	//判断是否是10的倍数
	var remainder = +val % 10;
	return !(remainder==0);
}

/**
 * 注册页面
 * 判断二维码扫描是否已经登录
 */
function invite_register(code, url) {
	if(code.length == 0) {
		return;
	}
	var name = $('#nav_login').text();
	if(name == '登录'){
		return;
	}
	var closeFn = function() {
		location.href = url;
	};
	grape.dialog.alert({message:'您已注册并登陆钱来乐，请退出后再扫二维码', layer: true, closeFn:closeFn});
}
	
/**
 * 验证简易插件
 */
Zepto(function($) {
	/**
	 * 通用post提交
	 * @param {Object} url
	 * @param {Object} inputs
	 * @param {Object} fn
	 * @param {Object} errorFn
	 * @param {Object} context
	 */
	function com_post(url, inputs, fn, errorFn, context, $alert) {
		var $button = $('button');
		var btn_length = $button.length;
		//var $disabled = $('button[disabled]');
		if(btn_length > 0) {
			setDisabled($('button'));//防止重复提交
			loading($('button'));
		}
		return $.post(url, inputs, function(json) {
			//将disable的按钮设置取消
			if(btn_length > 0) {
				removeDisabled($('button[disabled]'));
				removeLoading();
			}
			var data;
			if(!json) {
				//返回空字符串的情况 返回空格式
				data = {"msg":"","code":"","result":1};
			}else if(typeof json == 'string')
				data = (0,eval)('(' + json + ')');
			else
				data = json;
			var params = [data];
			if(fn) {
				var context = context || null;
				if(isSuccess(data)) {
					fn.apply(context, params);
				}else {
					if(data.msg != null && data.msg.length > 0) {
						if($alert === undefined)
							$alert = $('.help-error');
						if($alert.length > 0) {
							$alert.show().html(data.msg);
						}else {
							grape.dialog.alert({message:data.msg});
						}
					}
					if(errorFn !== undefined)
						errorFn.apply(context, params);
				}
			}
		});
	}
	
	/**
	 * 跳转
	 */
	function loaction_href(json, href) {
		var href_attrs = [];
		if(!is_empty(json.href_attrs)) {
			$.each(json.href_attrs, function(key, value) {
				href_attrs.push(key+'='+value);
			});
		}
		if(href_attrs.length > 0) {
			href += '?'+href_attrs.join('&');
		}
		location.href = href;
	}
	
	function isSuccess(json) {
		return +json.result === 1 && json.result !== null;//类型转换做判断
	}

	
	
	/**
	 * 通用tap事件
	 */
	function com_tap($btn, fn) {
		$btn.tap(function() {
			if($(this).attr('disabled') !== false) {
				return false;
			}
			fn.apply(this);//执行
		});
	}
	
	/**
	 * 调用loading效果
	 */
	function loading($object, params) {
		var $loading = $('#pull-up-loading');
		var height = $object.height();
		var width = $object.width();
		if($object.offset() == null) {
			return;
		}
		var top = $object.offset().top + height/2 - 20;
		var left = $object.offset().left + width/2 - 20;
		var msg = '';
		if(params != undefined) {
			msg = params['msg'] || '';
			top += params['top'] || 0;
			left += params['left'] || 0;
		}
		//alert(left)
		if($loading.length > 0) {
			$loading.css({top:top, left:left});
			$loading.show();
			//计算top和left值
			
			return;
		}
		$('body').append('<div id="pull-up-loading" class="pull-up pull-up-loading"><span class="pull-icon"></span>'+msg+'</div>');
		$loading = $('#pull-up-loading');
		$loading.css({top:top, left:left});
	}
	function removeLoading() {
		$('#pull-up-loading').hide();
	}
	
	/**
	 * 设置重复提交限制
	 */
	function setDisabled($btn) {
		$btn.attr('disabled', 'disabled');//防止重复提交
	}
	/**
	 * 取消重复提交限制
	 */
	function removeDisabled($btn) {
		$btn.removeAttr('disabled');
	}
	
	/**
	 * 获取参数内容
	 */
	function getUrlParms() {
		var args={};   
	    var query=location.search.substring(1);//获取查询串   
	    var pairs=query.split("&");//在逗号处断开   
	    for(var i=0; i<pairs.length; i++) {   
	        var pos=pairs[i].indexOf('=');//查找name=value   
	        if(pos==-1)
	        	continue;//如果没有找到就跳过
	        var argname=pairs[i].substring(0,pos);//提取name   
	        var value=pairs[i].substring(pos+1);//提取value   
	        args[argname]=unescape(value);//存为属性   
	    }
	    return args;
	}
	
	/**
	 * 绑定弹出层事件
	 */
	$('.alert-content').on('tap', '.icon-guanbi', function() {
		$(this).closest('.alert').hide();
	});
	
	/**
     * 异步加载图片
     */
	if(typeof($.fn.lazyload) !== 'undefined') {
		$('img.lazy').lazyload({
            effect: "fadeIn"
        });
	}
	
	/**
	 * body全局绑定
	 */
	$("body").on('touchstart', '[data-onhover]', function () {//基础hover事件模拟器
        $(this).addClass($(this).data('onhover'));
    }).on('touchend', '[data-onhover]', function () {//基础hover事件模拟器
        $(this).removeClass($(this).data('onhover'));
    }).on('tap', '[data-ahref]', function () {//绑定标签跳转
        location.href = $(this).data('ahref');
    });
	
	/* 表单验证
   	======================================================================== */
   	/**
	 * 手机格式验证
	 */
	function mobile_check(mobile) {
		var mobile_pattern = /^1\d{10}$/g;
		mobile_pattern.lastIndex = 0;
		return mobile_pattern.test(mobile);
	}
	/**
	 * 邮箱格式验证
	 * @param {Object} mobile
	 */
	function email_check(email) {
		var email_pattern = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/g;
		email_pattern.lastIndex = 0;
		return email_pattern.test(email);
	}
	/**
	 * 密码确认
	 */
	function password_confirm_check($confirm) {
		var $target = $($confirm.data('confirm'));
		return $target.val() === $confirm.val();
	}
	/**
	 * 判断是否为空
	 */
	function is_empty(obj) {
		if (obj == null) return true;
    	if (Object.prototype.toString.call(obj) == '[object String]') return obj.length === 0;
    	return false;
	}
	/**
	 * 正整数判断
	 */
	function is_digit(digit) {
		var digit_pattern = /^\d+$/;
		digit_pattern.lastIndex = 0;
		return digit_pattern.test(digit);
	}
	
	var btn_mobile_code = function() {
		//发送验证码
		var $this = $(this);
		var $target = $($this.data('target'));
		var $error = $($this.data('error'));
		var mobileError = $target.data('mobileMessage');
		var mobile = $.trim($target.val());

		//验证手机规则
		if(!mobile_check(mobile)) {
			grape.dialog.alert({message:mobileError, layer:true});
			//$error.show().html(mobileError);
			return;
		}
		var second = 60;
		var second_interval;
		var fnTimeout = function() {
			second--;
			if(second <= 0) {
				$this.text('获取验证码');
				removeDisabled($this);
				$this.removeClass('disabled');
				clearTimeout(second_interval);
				return;
			}
			$this.text(second+'秒');
			setDisabled($this);
			$this.addClass('disabled');
			second_interval = setTimeout(fnTimeout, 1000);
		};
		fnTimeout();
		var ajax = $this.data('ajax');
		var params = {mobile:mobile};
		com_post(ajax, $.extend(params, $this.data()), function(json) {
			$error.show().html(json.msg);
		});
	};
	com_tap($('[name=btn_mobile_code]'), btn_mobile_code)
	
	function _validate($input, val) {
		var isError = false;
		var errorMsg = '';
			//必填项验证
			if($input.data('required') === true) {
				isError = val.length == 0;
				if(isError) {
					errorMsg = $input.data('requiredMessage');
				}
			}
			//手机格式验证
			if($input.data('mobile') === true && !isError) {
				isError = !mobile_check(val);
				if(isError) {
					errorMsg = $input.data('mobileMessage');
				}
			}
			//正整数验证
			if($input.data('digit') === true && !isError) {
				isError = !is_digit(val);
				if(isError) {
					errorMsg = $input.data('digitMessage');
				}
			}
			
			//密码确认验证
			if($input.data('confirm') !== undefined && !isError) {
				isError = !password_confirm_check($input);
				if(isError) {
					errorMsg = $input.data('confirmMessage');
				}
			}
			//邮箱格式验证
			if($input.data('email') === true && !isError && val.length>0) {
				isError = !email_check(val);
				if(isError) {
					errorMsg = $input.data('emailMessage');
				}
			}
			//最小长度验证
			if($input.data('minlength') !== undefined && !isError) {
				var minlength = $input.data('minlength');
				isError = minlength > val.length;
				if(isError) {
					errorMsg = $input.data('minlengthMessage');
				}
			}
			//最大长度验证
			if($input.data('maxlength') !== undefined && !isError) {
				var maxlength = $input.data('maxlength');
				isError = maxlength < val.length;
				if(isError) {
					errorMsg = $input.data('maxlengthMessage');
				}
			}
			//不等于
			if($input.data('valueNotEquals') !== undefined && !isError) {
				var valueNotEquails = $input.data('valueNotEquals');
				isError = valueNotEquails == val;
				if(isError) {
					errorMsg = $input.data('valueNotEqualsMessage');
				}
			}
			//自定义函数
			if($input.data('customFn') !== undefined && !isError) {
				var fn = $input.data('customFn');
				if(typeof window[fn] === 'function') {
					isError = window[fn].apply(this, [val]);
				}
				if(isError) {
					errorMsg = $input.data('customFnMessage');
				}
			}

			return {isError:isError, errorMsg:errorMsg};
	}
	/**
	 * 验证提交
	 */
	$('.validate').submit(function() {
		var $this = $(this);
		var $submit = $this.find('[type=submit]');
		var $inputs = $this.find('input[name]').not('button');
		var $selects = $this.find('select');
		var $error = $this.find('.help-error');
		var isError = false;
		var errorMsg = '';
		var params = {};
		if($selects.length > 0) {
			$.each($selects, function(index, item) {
				$inputs.push(item);
			});
		}
		//清除错误样式
		$submit.closest('form').find('.has-error').removeClass('has-error');
		if($error.length == 0) {
			$submit.parent().append('<p class="help-inline help-error"></p>');
			$error = $this.find('.help-error');
		}

		$inputs.each(function(key, value) {
			var $input = $(value);
			var val = $.trim($input.val());
			var name = $input.attr('name');
			//多选框
			if($input.is('[type=checkbox]')) {
				val = [];
				$('[name="'+name+'"]').filter(function() {
					return $(this).attr('checked');
				}).each(function() {
					val.push($(this).val());
				});
				//val = $input.is(':checked') ? val : '';
			}
			
			
//			
//			//单选框
//			if($input.is(':radio')) {
//				name = $input.attr('name');
//				$input = $input.closest('.controls');
//				val = $(':radio[name='+name+']').filter(':checked').val();
//			}
			
			if(isError) {
				return;
			}

			var error = _validate($input, val);
			errorMsg = error.errorMsg;
			isError = error.isError;
			if(isError) {
				$input.closest('.form-group').addClass('has-error');
			}
			params[name] = val;
		});
		
		if(isError) {
			$error.show().html(errorMsg);
			return false;
		}
		
		var ajax = $submit.data('ajax');
		var href = $submit.data('href');
		var successFn = function(json) {
			//$submit.removeAttr('disabled');
			switch ($submit.data('alertType')) {
				case 'dialog':
					grape.dialog.alert({message:json.msg, close:true})
					break;
				default:
					$error.show().html(json.msg);
					break;
			}
			var ajax_href = json.href; //由ajax返回的url
			//回调函数中额外的函数
//			var otherFn = $submit.data('otherFn');
//			if(otherFn !== undefined) {
//				eval(otherFn);
//			}
			//是否是本页面刷新
			var reload = $submit.data('reload');
			if(reload === true) {
				setTimeout(function() {
					location.reload();
				}, 500);
			}else if(ajax_href != undefined && ajax_href.length > 0) {
				loaction_href(json, ajax_href);
			}
			else if(href != undefined) {
				loaction_href(json, href);
			}
		};
		com_post(ajax, $.extend(params, $submit.data()), successFn);
		return false;
	});
	
	//islider图片切换
	if(window.iSlider !== undefined) {
		$('.ad-images').each(function(index) {
			var iSlider_list = [];
			$(this).children().each(function() {
				iSlider_list.push({content:$(this).html()});
			});
			if(iSlider_list.length <= 1) {
				return;
			}
			$(this).children().remove();
			var islider = new iSlider({
				duration: 5000,
			    dom: document.getElementById("iSlider-wrapper"+index),
			    data: iSlider_list,
			    isLooping: true,
			    isAutoplay: true,
			    plugins: ['dot']
			});

		});
	}

	/**
	 * tab切换
	 */
	$('.tab').on('tap', 'li', function() {
		var $this = $(this);
		var $target = $($this.data('target'));
		var $siblings = $this.parent().children('li');
		var toggle = $this.parent().data('toggle');
		$siblings.each(function() {
			var $obejct = $($(this).data('target'));
			$obejct.hide()
		});
		if(toggle === true && $this.hasClass('active')) {
			$this.removeClass('active');
			return;
		}
		//$target.siblings('section').hide()
		$target.show();
		$this.siblings().removeClass('active');
		$this.addClass('active');
	});
	
	/* 钱包与赞助
   	======================================================================== */
	//列表页面 过滤操作
	$('li[name=filter]').each(function() {
		var url_params = getUrlParms();//当前地址的参数
		var $this = $(this);
		var $target = $($this.data('target'));
		var name = $target.attr('id');
		$target.on('tap', 'dd', function() {
			url_params[name] = $(this).data('value');
			var json = {'href_attrs':url_params};
			loaction_href(json, window.location.pathname);//跳转
		});
	});
	
	//下拉刷新
	if(typeof($.fn.dropload) !== 'undefined') {
		var $data_list = $('#data_list');
		if($data_list.length>0) {
			ajaxGetList();//默认载入一次
			$data_list.dropload({
			    scrollArea : window,
			    loadDownFn : function(me) {
			    	ajaxGetList(me);
			    }
			});
		}
		function ajaxGetList(me) {
			var params = $data_list.data();
		    params['p'] = $data_list.attr('data-page');
		    //只在首次载入的时候显示
		    if(params['p'] == 1)
		    	loading($data_list, {msg:'正在载入中....',top:30,left:-40});//载入信息
		    var errorFn = function() {
		    	removeLoading();
		    };
		    com_post($data_list.data('ajax'), params, function(json) {
		    	removeLoading();
				var list = json.data;
				var page = +$data_list.attr('data-page');
				if(page == 1 && (list==null || list.length == 0)) {
					var $no_data = $('#no_data');//没有内容时候的提示
					if($no_data.length > 0) {
						$data_list.parent().hide();
						$no_data.show();
						return;
					}
				}
				if(me !== undefined)
					me.resetload();
				if(list == null || list.length == 0) {
					//grape.dialog.alert({message:'没有更多了！', layer:true});
					return;
				}
				
				page++;
				$data_list.attr('data-page', page);
				var rendered = Mustache.render($($data_list.data('template')).html(), {'list': list});
		    	$data_list.append(rendered);
		    	$('img.lazy').lazyload();//再绑定一次延迟加载图片
			}, errorFn);
		}
	}
	//礼品选择
	$('#gift').on('tap', 'li', function() {
		$(this).css('height', $(this).height());
		$(this).closest('#gift').find('li').removeClass('active');
		$(this).addClass('active');
	});
	//提交礼品
	var btn_gift = function() {
		var $this = $(this);
		var type = $('#gift_tab').find('li.active').data('value');
		var gift = 0;
		var address = '';
		if(type == 2) {//选择礼品
			gift = $('#gift').find('li.active').data('value');
			if(gift === undefined) {
				grape.dialog.alert({message:'请选择礼品', layer:true});
				return;
			}
			address = $.trim($('#address').val());
		}
		var params = $this.data();
		params['type'] = type;
		params['gift'] = gift;
		params['address'] = address;
		var href = $this.data('href');
		var btn_type = $this.data('btype');
		var prompt = $this.data('prompt');
		var successFn = function(json) {
			//$this.removeAttr('disabled');
			if(btn_type == 'team') {
				var closeFn = function() {
					location.href = href;
				};
				grape.dialog.alert({message:prompt, layer:true, closeFn:closeFn});
			}else {
				grape.dialog.alert({message:json.msg, close:true});
//				var extra = '<img src="/images/arrow.png" style="position:fixed;z-index:9999;top:10px;right:20px" width="50%"/>';
//				//提示下载按钮
//				grape.dialog.alert({message:'<p>下载应用请点击右上角按钮</p><span class="blue">[在浏览器中打开]</span>', close:true, layer:true, extra:extra});
//				$this.hide();
				setTimeout(function() {
					grape.dialog.close();
					if(href !== undefined)
						location.href = href;
				}, 1000);
			}
		};
		com_post($this.data('ajax'), params, successFn);
	};
	com_tap($('#btn_gift'), btn_gift);
	
	//提交任务审核
	var btn_verify = function() {
		var images = [];
		var $this = $(this);
		var href = $this.data('href');
		$('#upload_verify').find('dd').each(function() {
			images.push($(this).data('value'));
		});
		if(images.length == 0) {
			grape.dialog.alert({message:'请先上传图片', layer:true});
			return;
		}
		var params = $.extend($this.data(), {'images':images.join(',')});
		var successFn = function(json) {
			setDisabled($this);
			grape.dialog.alert({message:json.msg, close:true});
			setTimeout(function() {
				grape.dialog.close();
				if(href !== undefined)
					location.href = href;
			}, 1000);
		};
		com_post($this.data('ajax'), params, successFn);
	};
	com_tap($('#btn_verify'), btn_verify);
	
	//图片上传
	if(window.lrz !== undefined) {
		//初始化
		$('.lrz4').each(function() {
			var id = $(this).attr('id');
			var container = $(this).data('container');//保存图片的位置
			var default_value = $(this).data('value');//默认设置的图片ID
			var $hidden = $('<input>').attr({type:'hidden', id:id+'_hidden', name:id+'_hidden'}).insertAfter($(this));//用户保存图片
			if(default_value != undefined) {
				$hidden.val(default_value);
			}
			var image_type = $(this).data('type');
			switch(image_type) {
				case 'upload_app'://上传APP步骤的位置
					//图片删除
			        $(container).on('tap', 'dd', function() {
						var $this= $(this);
						var cancel = function() {
							$this.remove();
							var ids = [];
							$(container).children('dd').each(function() {
								ids.push($(this).data('value'));
							});
							$hidden.val(ids.join(','));
						};
						grape.dialog.alert({message:'您确定要删除该图片吗？', cancel:cancel, layer:true});
					});
		        	break;
		        case 'upload_card':
		        	$(container).on('tap', 'img', function() {
		        		var $this= $(this);
						var cancel = function() {
							$this.prev().show();//将前面的标签显示
							$hidden.val('');
							$this.remove();
						};
						grape.dialog.alert({message:'您确定要删除该图片吗？', cancel:cancel, layer:true});
		        	});
		            break;
		        case 'upload_avatar':
		        	$(container).on('tap', 'img', function() {
		        		var $this= $(this);
						var cancel = function() {
							$hidden.val('');
							$this.remove();
						};
						grape.dialog.alert({message:'您确定要删除该图片吗？', cancel:cancel, layer:true});
		        	});
		        	break;
			}
			$(this).on('change', function() {
				var $this = $(this);
				var $dt = $this.closest('dt');
				var ajax = $this.data('ajax');
				var image_type = $this.data('type');
				var hidden = $this.attr('id')+'_hidden';
				var $hidden = $('#'+hidden);
				var container = $(this).data('container');//保存图片的位置
				if(this.files.length == 0) {
					return;
				}
				loading($this);
				lrz(this.files[0]).then(function (rst) {
		            //将图片插入到指定位置
		            var img = new Image();
		            img.src = rst.base64;
		            switch(image_type) {
		            	case 'upload_app'://上传APP步骤的位置
			            	img.onload = function () {
			            		$('<dd></dd>').append(img).insertBefore($dt);
				            };
		            		break;
		            	case 'upload_card':
		            		img.onload = function () {
		            			$(img).css('width', '100%');
			            		$(container).append(img);
			            		$(container).children('div').hide();
				            };
		            		break;
		            	case 'upload_avatar':
		            		img.onload = function () {
		            			$(img).css({width:35, height:35});
		            			$(container).html(img);
				            };
		            		break;
		            }
		            return rst;
		        }).then(function (rst) {
		        	//将图片传送到后方
		            var params = $.extend($this.data(), {image:rst.base64});
		            var successFn;
					switch(image_type) {
						case 'upload_app'://上传APP步骤的位置
							successFn = function(json) {
								$dt.prev('dd').attr('data-value', json.data.imageid);
								//重新保存到隐藏域中
								var ids = [];
								$(container).children('dd').each(function() {
									ids.push($(this).data('value'));
								});
								$hidden.val(ids.join(','));
							}
							break;
						case 'upload_card':
						case 'upload_avatar':
							successFn = function(json) {
								$hidden.val(json.data.imageid);
							}
							break;
					}
					com_post(ajax, params, successFn);
		            return rst;
		        }).catch(function (err) {
		            //捕捉到错误信息
		            grape.dialog.alert({message:err})
		        }).always(function () {
		            //不管是成功失败，这里都会执行
		            removeLoading();
		        });
			});
		});
	}
	
	function _emptyClosestError(id) {
		var val = $.trim($(id).val());
		if(val.length == 0) {
			$(id).closest('.form-group').addClass('has-error');
			$('#error').html($(id).attr('placeholder'));
			return false;
		}
		return val;
	}
	//实名认证审核
	var cash_verify = function() {
		var $this = $(this);
		//限制按钮不可点击
		if($this.attr('disabled') !== false) {
			return false;
		}
		//1：支付宝  2：银行卡
		var type = $('#verify_tab').find('.active').data('value');
		var $error = $('#error');
			
		if(type == 1) {
			var user = _emptyClosestError('#ali_user');
			if(user === false) {
				return;
			}
			var account = _emptyClosestError('#ali_account');
			if(account === false) {
				return;
			}
		}else {
			var user = _emptyClosestError('#bank_user');
			if(user === false) {
				return;
			}
			var name = _emptyClosestError('#bank_name');
			if(name === false) {
				return;
			}
			var account = _emptyClosestError('#bank_account');
			if(account === false) {
				return;
			}
		}
		var front = $('#upload_card1_hidden').val();
		var back = $('#upload_card2_hidden').val();
		if(front.length == 0) {
			$error.html('请上传身份证正面');
			return;
		}
		if(back.length == 0) {
			$error.html('请上传身份证背面');
			return;
		}
			
		var params = $.extend($this.data(), {user:user,account:account,name:name,front:front,back:back,type:type});
		var href = $this.data('href');
		var successFn = function(json) {
			grape.dialog.alert({message:json.msg, close:true});
			setTimeout(function() {
				location.href = href;
			}, 1000);
		};
		com_post($this.data('ajax'), params, successFn);
	};
	com_tap($('#cash_verify'), cash_verify);
	
	/**
	 * 下拉框美化
	 */
	$('.select').each(function() {
		var $this = $(this);
		$this.hide();
		var options = $this.find('option');
		var $target = $('<span>').html(options.not(function(){ return !this.selected }).text());
		$target.insertAfter($this);
		var $container = $('<div>').addClass('select-container dn');
		$container.css('height', $(document).height());
		var $dl = $('<dl>');
		$dl.on('tap', 'dd', function() {
			var current = $(this).data('value')
			$target.html($(this).html());
			$container.hide();
			options.removeAttr('selected');
			options.filter(function(){ return this.value == current}).attr('selected', true);
			//$this.find('option[value="'+current+'"]').attr('selected', true);
		}).on('tap', 'i', function() {
			$container.hide();
		});
		$dl.append('<dt><i class="icon-guanbi"></i></dt>');
		options.each(function(index) {
			var html = $(this).html();
			var value = $(this).val();
			var $dd = $('<dd>');
			if(index == 0) {
				$dd.addClass('first');
			}
			$dd.attr('data-value', value);
			$dd.html(html);
			$dl.append($dd);
		});
		$container.append($dl);
		$('body').append($container);
		$target.tap(function() {
			$container.show();
		});
	});
	
	/**
	 * 添加标签
	 */
	$('button[name="add_tag"]').tap(function() {
		var $this = $(this);
		var $target = $($this.data('target'));
		var val = $target.val();
		if(val.length == 0) {
			grape.dialog.alert({message:$target.attr('placeholder'), layer:true});
			return;
		}
		var ajax = $this.data('ajax');
		var params = $.extend($this.data(), {value:val});
		var successFn = function(json) {
			var id = json.data.id;
			var $label = $('<label>').addClass('checkbox-inline');
			var $checkbox = $('<input>').attr({value:id, type:'checkbox'});
			$label.append($checkbox).append(val);
			$target.val('');
			$this.parent().prev().append($label);
		};
		com_post(ajax, params, successFn);
	});
	
	/**
	 * 下载跳转
	 */
	$('#download').on('tap', 'section', function() {
		var ua = window.navigator.userAgent.toLowerCase();
    	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
    		var extra = '<img src="/images/arrow.png" style="position:fixed;z-index:9999;top:10px;right:20px" width="50%"/>';
			//提示下载按钮
			grape.dialog.alert({message:'<p>下载应用请点击右上角按钮</p><span class="blue">[在浏览器中打开]</span>', close:true, layer:true, extra:extra});
    		return;
    	}
    	location.href = $(this).data('href');
	});
});


