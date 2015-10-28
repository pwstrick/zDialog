/*!
 * zdialog
 * Date: 2015-10-28
 * https://github.com/pwstrick/zdialog
 * author：pwstrick
 */
;(function($, global){
	'use strict';

	var zDialog = function (element, options) {
        this.options = $.extend({}, zDialog.defaults, options);//合并参数设置
        this.init();//进行一些初始化工作
    };
    
    /**
     * 默认配置项
     */
    zDialog.defaults = {
        content: "",//弹出框内容
        
        ok: function() {},//点击确定触发事件
        okValue: "确定",//确定文字
        cancel: function() {},//点击取消触发事件
        cancelValue: "取消",//取消内容
        buttons: [],//自定义按钮组
        
        width:'80%',//弹出框宽度
        height:'',//弹出框高度
        
        fixed:false, //是否使用属性position:fixed
        quickClose:true, //点击空白处关闭
        layer:true, //是否显示阴影层
        zIndex:9999, //z-index属性
        
        onshow:function(){},//打开弹出框的时候触发
        onclose:function(){}//关闭事件的时候触发
    };
    
    /**
     * 插件的方法
     */
    zDialog.prototype = {
        init: function () {
            console.log('init');
        },
        func1: function () {

        },
        func2: function () {

        }
    };

	global['zDialog'] = zDialog;
})(Zepto, window);