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
        <td>默认值</td>
        <td>说明</td>
    </tr>
</thead>
<tbody>
    <tr>
        <td colspan="4"><b>容器配置</b></td>
    </tr>
    <tr>
        <td>container</td>
        <td>{string}</td>
        <td>'.zdialog'</td>
        <td>最外部的选择器</td>
    </tr>
    <tr>
        <td>contentContainer</td>
        <td>{string}</td>
        <td>'.zdialog-content'</td>
        <td>主题部分的选择器</td>
    </tr>
    <tr>
        <td>messageContainer</td>
        <td>{string}</td>
        <td>'.zdialog-message'</td>
        <td>消息信息的选择器</td>
    </tr>
    <tr>
        <td>buttonContainer</td>
        <td>{string}</td>
        <td>'.zdialog-content'</td>
        <td>按钮列表的选择器
        默认值和contentContainer一样
        因为默认模版的按钮就是主题部分的直接子元素</td>
    </tr>
    <tr>
        <td>layerContainer</td>
        <td>{string}</td>
        <td>'.zdialog-layer'</td>
        <td>阴影背景的选择器</td>
    </tr>
    <tr>
        <td colspan="4"><b>内容配置</b></td>
    </tr>
    <tr>
        <td>content</td>
        <td>{string}</td>
        <td></td>
        <td>消息内容，可以输入html标签</td>
    </tr>
    <tr>
        <td colspan="4"><b>外观配置</b></td>
    </tr>
    <tr>
        <td>left</td>
        <td>{string}
        {number}</td>
        <td>'5%'</td>
        <td>消息主体向左浮动距离</td>
    </tr>
    <tr>
        <td>right</td>
        <td>{string}
        {number}</td>
        <td>'5%'</td>
        <td>消息主体向右浮动距离</td>
    </tr>
    <tr>
        <td>top</td>
        <td>{string}
        {number}</td>
        <td>null</td>
        <td>消息主体向上浮动距离</td>
    </tr>
    <tr>
        <td>fixed</td>
        <td>{boolean}</td>
        <td>false</td>
        <td>消息主体浮动类型设置为：position:fixed</td>
    </tr>
    <tr>
        <td colspan="4"><b>按钮配置</b></td>
    </tr>
    <tr>
        <td>ok</td>
        <td>{boolean}
        {function}</td>
        <td>false</td>
        <td>确定按钮，可设置回调函数，false就是不显示。
        默认触发事件后会关闭框。
        如果是回调函数返回的是false，就会阻止关闭
        </td>
    </tr>
    <tr>
        <td>okValue</td>
        <td>{string}</td>
        <td>'确定'</td>
        <td>按钮文字</td>
    </tr>
    <tr>
        <td>okCSS</td>
        <td>{string}</td>
        <td>'btn btn-primary'</td>
        <td>按钮的样式</td>
    </tr>
    <tr>
        <td>cancel</td>
        <td>{boolean}
        {function}</td>
        <td>false</td>
        <td>取消按钮，可设置回调函数，false就是不显示。
        默认触发事件后会关闭框。
        如果是回调函数返回的是false，就会阻止关闭
        </td>
    </tr>
    <tr>
        <td>cancelValue</td>
        <td>{string}</td>
        <td>'取消'</td>
        <td>按钮文字</td>
    </tr>
    <tr>
        <td>cancelCSS</td>
        <td>{string}</td>
        <td>'btn'</td>
        <td>按钮的样式</td>
    </tr>
    <tr>
        <td>buttons</td>
        <td>{array}</td>
        <td>[]</td>
        <td>自定义按钮数组
        [
          {value:按钮内容, callback:回调函数, css:按钮样式}
        ]
        </td>
    </tr>
</tbody>
</table>

