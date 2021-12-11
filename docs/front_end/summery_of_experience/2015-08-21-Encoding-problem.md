---
layout: post
title: 使用github + jekyll + markdown建站遇到的一些问题和细节
category: 技术
keywords: 技术,jekyll,github,markdown,建站
---

## 缘由

这几天看到网上涌现了许多流行的博客

清一色 github + jekyll + markdown 或者 github + hexo + markdown

于是就跟风也学着建立一个。由于这方面的教程网上有很多，所以在这里我就不再过多赘余

## 分享下我遇到的一些问题和一些细节

  window下面安装ruby时候出现的一些问题
  由于jekll是以ruby语言编写的，自然需要安装ruby的编译程序
  
  >(小知识扩充:[关于ruby 和 松本行弘](http://www.programmer.com.cn/4002/))

  linux系统很好装

  
  >yum install jekyll 

或者

  >gem install jekyll
  
  但本人用的是window系统
  安装就比较繁琐一些

  具体的步骤是三步  先装ruby编译程序 => 在装以ruby为基础的插件快速安装工具箱DevKit => 安装jekll

### 第一步 安装 ruby 编译程序

  登录网站[ruby-installer](http://rubyinstaller.org/downloads/)
  下载最新的适用自己电脑的(x86位数)ruby版本

  下载完安装 一路next

  ![shootphoto](/assets/img/ruby-installer-shootpic.png)
  (注意：这里需要勾选一下 “Add Ruby executables to your PATH”，这样执行程序会被自动添加至 PATH 而避免不必要的头疼)
   
  原博客说最好保持默认路径，但是本人安装时，是修改了默认路径的，一般这种老外软体安装路径原则基本上都是别有空格 + 不要带中文

### 第二步 安装Devkit

  安装完毕之后我们需要安装Ruby的一个简化安装工具箱(develop-kit) 用来安装jekyll
 
  1.前往[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)(注意:因为GFW的关系，有可能此链接失效,这时候你就百度搜索一下，应该都会出来的)
  
  ![shootpic](/assets/img/ruby-installer-shootpic2.png)
  
  2.下载简化安装工具
  
  选择和自己Ruby版本相同的安装包(其实不难 一般选择 x86 64位数 Ruby 2.00以上版本的就是)
   
  3.解压缩文件包(本人是和ruby 放在一起的,方便管理。还是文件名遵守上面的原则，无空格，无中文)
  
  4.老版的Devkit 可能还需要一步

  >cd “DevKit安装路径”
   ruby dk.rb init
   notepad config.yml

  在打开的记事本窗口中，于末尾添加新的一行 - Devkit的父级目录，保存文件并退出,但是本人安装的时候，貌似安装的过程中这一步程序就已经帮你自动完成了~

  5.打开cmd,cd(change directory)到存放的目录下面
  
  ![shootpic](/assets/img/ruby-installer-shootpic3.png)

  然后一句 ruby dk.rb install 自动安装


### 第三步 安装 jekyll

  本来问题是很简单的

  但是，很可惜这个世界有个叫 [GFW (Great Firewall of China)](http://baike.baidu.com/link?url=ySORFGUBA2HZQ-5A7ojQjdYmqiIyreSNVyCqN1kPnf47exTMOPgd-CRJj1Gqp8hy4s1TZPrgAHpopPNX8Y9vNa)的东西,也不知道哪天抽了风，把Devkit默认安装路径与中国用户的连接切断了

  结果，我们无法连接默认下的下载路径

  但是，所谓魔高一尺道高一丈。中国勇敢勤劳的程序猿们把Devkit可能安装的所有安装包都镜像了一份，放在了[淘宝的云端](http://ruby.taobao.org/)，并且每15分钟更新一次(业界良心,致以最崇高的敬意)

  所以我们现在需要修改该默认的安装路径
  
  >gem sources -r https://rubygems.org/  (注意:后面的/不能少)
   gem sources -a https://ruby.taobao.org/ (注意:一定要完全一样)

  现在修改完安装源后我们查看一下

  >D:\Ruby-for-window\Devkit>gem sources -l

  >*** CURRENT SOURCES ***
   https://ruby.taobao.org/

   (注意:一定要保证这里只有一个sources 如果 有两个 说明gem sources -r https://rubygems.org/ 命令没有执行)

   修改完淘宝源后,开始安装jekyll

   1.确认gem 已经安装

>gem -v
(弹出版本号，即安装成功)
   
   2.安装jekyll

>gem install jekyll

## 代码高亮

如果我们需要在博客上展示自己的代码可以添加代码高亮，而代码高亮的第三方插件中我选择的是pygments。

步骤

```javascript
    安装python ==> 安装eazy_install ==> 安装pygments ==> 使用pygments产生使代码高亮的.css文件 ==> 在html的header区域引用外部的css文件 ==> 编辑markdown的时候编辑高亮区域 ==> 实现页面高亮
```

这么多步骤，真的很麻烦，但是，一步一步来，最终是可以解决问题的

### 安装python

首先，我们下载[安装包]() 
因为，python2 和 python3 是两个区别度比较大的版本，所以大家不要下载3.0+ 这里下载的是2.7的
然后，就出现问题了。
window 8.1(估计win7也会出现)下会因为权限问题(报错 2503 2502 安装nodejs的时候也会出现类似问题)导致安装失败,解决这个办法,网上有很多种
这里，我就介绍我亲自尝试过的方法
win + x 打开有管理员权限的cmd
![shootpic](/assets/img/python-install2.png)

然后顺着安装向导一步一步就能装，安装过程中注意勾选自动添加到path(环境变量)

如果忘记添加了，也不要紧
![shootpic](/assets/img/python-install3.png)

然后 重启一下cmd 
执行代码

>C:\Windows\system32>python -V(大写)
 Python 2.7.5

如果正确弹出了版本号，说明安装成功了

### 安装easy_install

一个插件管理工具 (可以类比 Devkit) 好处是，使用它安装插件不用配置和设置其他文件， 只要一句代码就搞定

言归正传，首先我们先下载[安装包 ez_setup.py](https://pypi.python.org/pypi/setuptools)
![shootpic](/assets/img/python-install4.png)

下载完后，一句cmd代码解决问题
切换到存放ez_install的地方
>python ez_setup.py

然后，还是和上面一样，需要添加一下配置环境， 具体步骤参照上面

### 安装pygments
>easy_install pygments
解决问题

### 检查一下安装情况

> C:\Windows\system32>python -V
  Python 2.7.5

> C:\Windows\system32>easy_install --version
  setuptools 18.2

弹出版本号，说明安装成功

### 使用pygments

pygments是基于python的一款第三方插件

使用方法可以参考

[http://pygments.org/docs/cmdline/](http://pygments.org/docs/cmdline/)和
[http://segmentfault.com/a/1190000000661337](http://segmentfault.com/a/1190000000661337)

细节1:在你使用pygments前，需要告诉jekyll 你用的高亮语法是pygments
在配置文件_config.yml中添加 新版jekyll:`highlighter: pygments` 老版:`pygments: true`

细节2:检查Pygments的主题样式,需要先在cmd中进入python编译模式

```javascript
C:\Windows\system32>python
Python 2.7.5 (default, May 15 2013, 22:43:36) [MSC v.1500 32 bit (Intel)] on win
32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```
  再在底下依次输入这两句代码

`from pygments.styles import STYLE_MAP`
`STYLE_MAP.keys()`

但是，产生css文件的时候 不需要在python的编译模式下 需要先ctrl + c 退出python
然后，在执行 pygmentize -f html(声明在html文件下高亮) -a .highlight -S default(主题样式名) > 你准备生产的文件夹路径 + \pygments.css

  * `-f` html指明需要输出html文件
  * `-a` .highlight指所有css选择器都具有.highlight这一祖先选择器
  * `-S` default就是指定所需要的样式了，各位可以对各种样式都尝试一下。在官网上是可以直接尝试的哦！
  * `->` pygments.css将内容输出到pygments.css文件中

然后，在header标签里面引入外部css文件

细节3: 怎么使用高亮css

你需要高亮的代码块上下添加markdown语法

![shootpic](/assets/img/python-install5.png)


=========华丽的分割符=========

安装部分就是以上内容，然后就是一个比较容易被坑的问题

当你安装完毕后

执行 jekyll serve

发现无法将写好markdown转化为标准的页面html

这时候,先检查 头部layout区域是否拼写正确
- - -
layout: post(引号和post之间要有一个空格)
- - -
(注意: - 之间不能有空格，这里打了空格主要是为了方便阅读)

其次就是编码问题,一定要保证你的markdown文件和浏览器的编码相同，不然不单单是乱码问题，有时候是不会乱码，但是jekyll因编码问题无法解析你的markdown文件

很简单，一般都是同一使用UTF-8编码
sublime 和 notepad++ 都能保存你的编码设置

## git 使用

因为在本地写好内容之后，就需要使用git分布式版本控制系统进行操作，所以需要掌握一些git的基本操作

[git - 简易指南](http://www.bootcss.com/p/git-guide/)

要深入学习git 还可以学习《pro git》

[pro git 电子版](http://git-scm.com/book/en/v2)

## 关于升级jekyll 3.0

这一个月来，每次push新的博客版本，github有都一直在提示我高亮出问题，一直没在意

知道昨天，被push forbidden，知道github 已经升级到了jekyll3.0 版本

每次升级，都是一次大工程

要改的地方真不少

① 高亮插件换成了rouge 取代了原来的 pygments

高亮语法从原来的 

```c
  \{\% highlight xxx \%\}
```

换成了

\`\`\`xxx<br>
    // 高亮部分   
\`\`\`

注意 ： xxx 为语言名称，必须为小写  高亮代码块 必须和上下隔出来一行

如何查询rouge 到底能高亮那些语言呢？ 

如果你在本地安装了rouge 可以直接调用命令`rougify list` 进行查看

如果你并没有安装rouge ， 只能上网浏览了[List of supported languages and lexers](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers)

② jkeyll 3.0 再也不支持绝对路径的使用了

所以不能再出现:

<s>relative_permalinks: true</s>

### 关于本地升级jekyll解析器

升级的jekyll,实际上就是一句话的事

```javascript
  gem update jekyll

```

但是再次之前，会遇到一个问题

就是，gem需要进行更新

而gem更新的时候会遇到 SSL 检验证书无法通过的问题，这是因为，电脑中缺少cacert.pem 的根证书

```javascript
  错误提示 : E:/Ruby200/lib/ruby/2.0.0/net/imap.rb:1454:in `connect': SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (OpenSSL::SSL::SSLError)
```

如果要解决，只要下载这个根证书，并绑定到环境变量里面就OK了

[下载证书](http://curl.haxx.se/docs/caextract.html)

修改环境变量

```javascript
  变量名： SSL_CERT_FILE
  变量值： xxx/cacert.pem
```

最后，重启cmd 升级成功~

![update-jekyll](/assets/img/update-jekyll.png)

## 感谢

本人，在学过程中看了很多前辈的博客，可惜本人因为机器原因，丢失了一些博文链接，所以现在只记得一些博文连接，对此，深表遗憾

但是，还是对所有帮助过本人的前辈表示衷心的感谢，谢谢你们为中国编程事业做出的辛勤贡献，谢谢

[Havee's Space的博客](havee.me/internet/2013-08/support-pygments-in-jekyll.html)
[Jerry's Blog ](http://segmentfault.com/a/1190000000661337)
[oukongli的blog资料](http://blog.csdn.net/kong5090041/article/details/38408211)
[Run Jekyll on Windows](http://jekyll-windows.juthilo.com/5-running-jekyll/)
[解决gem ssl证书失效](http://www.csdn123.com/html/topnews201408/35/3635.htm)
[Upgrading Jekyll 2 to 3 on GitHub Pages](http://blog.virtuacreative.com.br/upgrade-jekyll-2-to-3-gh-pages.html)