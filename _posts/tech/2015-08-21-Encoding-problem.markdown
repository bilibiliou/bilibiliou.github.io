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
  gem install jekyll
  
  但本人用的是window系统
  安装就比较繁琐一些

  具体的步骤是三步  先装ruby编译程序 --> 在装以ruby为基础的插件快速安装工具箱DevKit --> 安装jekll

  登录网站[ruby-installer](http://rubyinstaller.org/downloads/)
  下载最新的适用自己电脑的(x86位数)ruby版本

  下载完安装 一路next ， 

  ![shootphoto]()
  (注意：)

  安装完毕之后我们需要安装Ruby的一个简化安装工具箱(develop-kit) 用来安装jekyll
 
  本来问题是很简单的

  但是，很可惜这个世界有个叫 [GFW (Great Firewall of China)](http://baike.baidu.com/link?url=ySORFGUBA2HZQ-5A7ojQjdYmqiIyreSNVyCqN1kPnf47exTMOPgd-CRJj1Gqp8hy4s1TZPrgAHpopPNX8Y9vNa)的东西,也不知道哪天抽了风，把Devkit默认安装路径与中国用户的连接切断了

  结果，我们无法连接默认下的下载路径

  但是，所谓魔高一尺道高一丈。中国勇敢勤劳的程序猿们把Devkit
   



  

