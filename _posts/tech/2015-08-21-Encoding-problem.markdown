---
layout: post
title: 使用github + jekyll + markdown建站的遇到的一些问题
category: 技术
keywords: 技术,jekyll,github,markdown,建站
---

## 缘由

这几天看到网上涌现了许多流行的博客

清一色 github + jekyll + markdown 或者 github + jekyll + hexo

于是就跟风也学着建立一个。由于这方面的教程网上有很多，所以在这里我就不再过多赘余

## 分享下我遇到的一些问题

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

  下载完安装 一路next ， 

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

## 感谢

 这里引用了oukongli的blog资料[http://blog.csdn.net/kong5090041/article/details/38408211](http://blog.csdn.net/kong5090041/article/details/38408211)

 特此表示衷心感谢

  

