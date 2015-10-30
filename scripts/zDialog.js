/*!
 * zdialog
 * Date: 2015-10-28
 * https://github.com/pwstrick/zdialog
 * author：pwstrick
 */
;(function($, global){
	'use strict';
	var _zDialog = null;
	var zDialog = function (options) {
        this.options = $.extend({}, zDialog.defaults, options);//合并参数设置
        this.init();//进行一些初始化工作
    };
    /**
     * 单例获取zDialog
     */
    zDialog.getzDialog = function(options) {
    	if(_zDialog != null) {
    		var olds = _zDialog.options;
    		var news = $.extend({}, zDialog.defaults, options);
    		//判断新的和旧的是否一样
    		var equal = zDialog.isEqual(olds, news);
    		if(equal) {//如果参数相同返回单例对象
    			return _zDialog;
    		}
    	}
    	_zDialog = new zDialog(options);
    	return _zDialog;
    }
    /**
     * 默认配置项
     */
    zDialog.defaults = {
    	//容器
    	container: '.zdialog',//弹出框外层选择器 包括阴影和内容
    	contentContainer: '.zdialog-content',//主题部分的选择器
    	messageContainer: '.zdialog-message',//消息信息的选择器
    	buttonContainer: '.zdialog-content',//按钮列表的选择器
    	layerContainer: '.zdialog-layer',//阴影的选择器
    	
    	//内容
        content: "",//弹出框内容
        
        //外观
        left: "5%",
        right: "5%",//用left和right替代width宽度 因为手机屏幕不一样
        top: null,
        fixed:false, //是否使用属性position:fixed
        
        //按钮
        ok: false,//点击确定触发事件 false就不显示
        okValue: "确定",//确定文字
        okCSS: "btn btn-primary",
        cancel: false,//点击取消触发事件 false就不显示
        cancelValue: "取消",//取消内容
        cancelCSS: "btn",
        buttons: [],//自定义按钮组 有三个属性[{value,callback,css}]
        
        //交互
        eventType: "click",//按钮事件类型 默认是click，可以设置为tap
        quickClose:true, //点击空白处关闭
        opacity:0.6, //阴影层透明度 false表示完全透明
        debug:false, //调试内容
        
        //事件
        onopen:function(){},//打开弹出框的时候触发
        onclose:function(){}//关闭事件的时候触发
    };
    //默认模版 可自定义
    zDialog.defaults.template = 
    	'<aside class="zdialog">'+
			'<div class="zdialog-layer"></div>'+
			'<div class="zdialog-content">'+
			   '<div class="zdialog-message"></div>'+
			'</div>'+
		'</aside>';

    /**
     * 插件的方法
     */
    zDialog.prototype = {
        init: function () {
        	var me = this;
        	//销毁存在的
        	me.$container = $(this.options.container);
        	me.$container.remove();
        	//重新添加
            $('body').append(this.options.template);
            //对象
            me.$container = $(this.options.container);
            me.$message = $(this.options.messageContainer);
            me.$button = $(this.options.buttonContainer);
            me.$content = $(this.options.contentContainer);
            me.$layer = $(this.options.layerContainer);
            //左右位移 代替宽度
            if(me.options.left) {
            	me.$content.css('left', me.options.left);
            }
            if(this.options.right) {
            	me.$content.css('right', me.options.right);
            }
            me.layer();
            me.btn();
            me.position();
            //快速关闭事件 就是点击背景层 隐藏弹出框
            if(me.options.quickClose === true) {
            	me.$layer.on(me.options.eventType, function() {
            		me.close();
            	});
            }
        },
        position: function () {//位置计算
        	var top = this.options.top;//已自定义高度
        	var fixed = this.options.fixed;
        	if(top == null) {//未设置值
        		if(fixed === true) {
        			top = '30%';//直接写死 下面的计算会出问题
        		}else {
        			var $window = $(window);
			        var dt = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
			        var wh = $window.height();
			        var oh = this.$content.height();
			        var top = (wh - oh) * 382 / 1200 + dt;// 黄金比例
			        top = Math.max(parseInt(top), dt);
        		}
        	}
        	this.$content.css('top', top);
        	if(fixed === true) {//fixed定位
        		this.$content.css('position', 'fixed');
        	}
        },
        layer: function() {//阴影层操作
        	var screen = window.screen.height;//屏幕高度
			var height = $(document).height();//标签高度
			if(height < screen) {
				height = screen;
			}
			this.$layer.css('height', height);
			var opacity = this.options.opacity;
			this.$layer.css('opacity', opacity === false ? 0 :opacity);
        },
        open: function() {//显示弹出框
        	this.$message.html(this.options.content);
            this.$container.show();
            this.options.onopen.apply(this);//绑定弹出框的时候附加的事件
        },
        close: function() {//关闭弹出框
            this.$container.hide();
            this.options.onclose.apply(this);//绑定关闭框的时候附加的事件
        },
        btn: function () {//按钮事件绑定
        	var me = this;
        	var buttons = me.options.buttons;
        	var ok = me.options.ok;
        	var cancel = me.options.cancel;
        	var length = buttons.length;
        	//先绑定自定义按钮
        	if(length > 0) {
        		//绑定自定义按钮
        		for(var i=0; i<length; i++) {
        			var $custom = zDialog.btnBind(buttons[i].callback, buttons[i].css, buttons[i].value, me);
        			me.$button.append($custom);
        		}
        	}
        	var $ok = zDialog.btnBind(ok, me.options.okCSS, me.options.okValue, me);
        	me.$button.append($ok);
        	var $cancel = zDialog.btnBind(cancel, me.options.cancelCSS, me.options.cancelValue, me);
        	me.$button.append($cancel);
        },
        console: function(msg) {//控制台调试
	    	if(this.options.debug === false)
	    		return '';
	    	if(typeof console !== 'undefined') {
	    		console.log(msg);
	    	}
	    }
    };

	/**
	 * 按钮生成
	 * 绑定了事件后，默认都会关闭，只有当设置的函数返回false的时候，阻止关闭
	 */
	zDialog.btnBind = function(btn, css, value, me) {
		var $btn='';
		var eventType = me.options.eventType;
		if(btn !== false) {
        	$btn = $('<button>').attr({'type':'button', 'class':css}).text(value)
        	if(btn === true) {
        		$btn.on(eventType, function() {
        			me.close();//默认关闭
        		});
        	}else if(typeof btn === 'function') {//绑定事件
        		$btn.on(eventType, function() {
        			var result = btn.apply(this);//如果返回false，则阻止关闭
        			if(result !== false) {
        				me.close();
        			}
        		});
        	}
        }
		return $btn;
	};
    /**
     * 判断两个值是否相同
     */
    zDialog.isEqual = function(a, b, strong) {
    	var aProps = Object.getOwnPropertyNames(a);
    	var bProps = Object.getOwnPropertyNames(b);
    	if (aProps.length != bProps.length)
    		return false;
    	strong = strong || false;//强比较和弱比较
    	for (var i = 0; i < aProps.length; i++) {
    		var propName = aProps[i];
    		if(strong) {
    			if (a[propName] !== b[propName])
	    			return false;
    		}else {
    			if (a[propName] != b[propName])
	    			return false;
    		}
    	}
    	return true;
    };

	global['zDialog'] = zDialog;
})(Zepto, window);