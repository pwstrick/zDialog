# zDialog
弹出框插件

- 基于zepto.js;
- 可以与zepto的扩展库touch.js配合;
- resource中的图片文件就一张二维码图片，仅仅用于扫描
- styles/demo.css文件仅仅是页面布局CSS

## 移动端展示
![二维码](http://pwstrick.github.io/zDialog/resource/qrcode1.png) 

Demo [http://pwstrick.github.io/zDialog](http://pwstrick.github.io/zDialog)

## 开始使用 zDialog

使用zDialog最简单的办法是查阅我们提供的简易例子，请浏览index.html的内容

#### 载入zDialog

引入CSS文件和zepto库文件，还有zDialog类文件
``` html
<link rel="stylesheet" href="styles/zDialog.css" />
<script src="scripts/zepto/zepto.js"></script>
<script src="scripts/zDialog.js"></script>
```

#### 初始化一个zDialog

``` javascript
var dialog = zDialog.getzDialog();
```

上面这种方式是模拟一个单例来初始化，也可以

``` javascript
var islider = new zDialog();
```

#### zDialog默认模版
模版是可以自定义的，配合CSS，如果自定义了的话，就得在容器配置中重新配置各个参数。
总共有5个参数，分别对应各个位置，最外层位置、主题位置、阴影位置、消息信息位置和按钮位置
``` html
<aside class="zdialog">
	<div class="zdialog-layer"></div>
	<div class="zdialog-content">
		  <div class="zdialog-message">提示信息</div>
		  <button type="button" class="btn btn-primary">确定</button>
		  <button type="button" class="btn">取消</button>
	</div>
</aside>
```

### 下面是zDialog详细的选项配置列表
<table>
<thead>
    <tr>
        <td>选项</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
</thead>
<tbody>
    <tr>
        <td colspan="3">容器配置</td>
    </tr>
    <tr>
        <td>container</td>
        <td>{string}</td>
        <td>最外部的选择器，默认就是模版中的'.zdialog'</td>
    </tr>
    <tr>
        <td>contentContainer</td>
        <td>{string}</td>
        <td>主题部分的选择器，默认就是模版中的'.zdialog-content'</td>
    </tr>
    <tr>
        <td>messageContainer</td>
        <td>{string}</td>
        <td>消息信息的选择器，默认就是模版中的'.zdialog-message'</td>
    </tr>
    <tr>
        <td>buttonContainer</td>
        <td>{string}</td>
        <td>按钮列表的选择器，默认就是模版中的'.zdialog-content'，因为默认模版的按钮就是主题部分的直接子元素</td>
    </tr>
    <tr>
        <td>layerContainer</td>
        <td>{string}</td>
        <td>阴影背景的选择器，默认就是模版中的'.zdialog-layer'</td>
    </tr>
</tbody>
</table>

