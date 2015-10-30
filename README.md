# zDialog
移动端弹出框插件

- 基于zepto.js;
- 可以与zepto的扩展库touch.js配合;
- resource中的图片文件就一张二维码图片，仅仅用于扫描
- styles/demo.css文件仅仅是页面布局CSS
- 就200多行代码，对于不符合使用项目的部分，可随意修改
- 下图是这个弹框的款式

![demo](http://pwstrick.github.io/zDialog/resource/demo.jpg)

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
        <td>按钮列表的选择器<br/>
        默认值和contentContainer一样<br/>
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
        <td>template</td>
        <td>{string}</td>
        <td>见前文</td>
        <td>模版内容</td>
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
        <td>确定按钮<br/>
        可设置回调函数，false就是不显示<br/>
        默认触发事件后会关闭框<br/>
        如果是回调函数返回的是false，<br/>
        就会阻止关闭
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
        <td>取消按钮<br/>
        可设置回调函数，false就是不显示<br/>
        默认触发事件后会关闭框<br/>
        如果是回调函数返回的是false，<br/>
        就会阻止关闭
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
        <pre>
        [
          {
             value:按钮内容,
             callback:回调函数,
             css:按钮样式
          }
        ]</pre>
        </td>
    </tr>
    <tr>
        <td colspan="4"><b>交互配置</b></td>
    </tr>
    <tr>
        <td>quickClose</td>
        <td>{boolean}</td>
        <td>true</td>
        <td>快速关闭，点击空白处关闭</td>
    </tr>
    <tr>
        <td>opacity</td>
        <td>{number}
        {boolean}</td>
        <td>0.6</td>
        <td>阴影透明度，false就是完全透明</td>
    </tr>
    <tr>
        <td>eventType</td>
        <td>{string}</td>
        <td>'click'</td>
        <td>点击类型
        如果配合touch.js，可以设置为tap类型</td>
    </tr>
    <tr>
        <td>debug</td>
        <td>{boolean}</td>
        <td>false</td>
        <td>开启或关闭调试</td>
    </tr>
    <tr>
        <td colspan="4"><b>事件配置</b></td>
    </tr>
    <tr>
        <td>onopen</td>
        <td>{function}</td>
        <td>function(){}</td>
        <td>打开弹出框的时候触发</td>
    </tr>
    <tr>
        <td>onclose</td>
        <td>{function}</td>
        <td>function(){}</td>
        <td>关闭事件的时候触发</td>
    </tr>
</tbody>
</table>

## 联系我
对zDialog的使用有任何问题,或者发现bug,欢迎给我反馈：
[提交反馈](https://github.com/pwstrick/zDialog/issues/new)

