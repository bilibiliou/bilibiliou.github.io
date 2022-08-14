# 关于赛马问题解决方案

如果有25匹马,跑道5条,只能记比赛名次但是不能用秒表记录速度,问至少需要多少次才能从中找出最快的3匹马

这个问题就有上面那么复杂了,思路差不多

1.从25匹马中分成5组,每组5匹马。 
2.每组中决出头名,并记录它们的名次(比赛5次)
3.将每个组的头名进行决赛,取头名,这就是最快的一匹(比赛1次)
4.因为题目是要选出3头,而决赛中的第四名和第五名及其它们的组中的马至少是不可能比决赛中的第二名,第三名快了,所以这两组的马可以直接淘汰。
5.决赛的第二名速度肯定比自己组的马快,并且比决赛的第三名那组的所有马都快,但是不能保证决赛第一名组中的马是否会比决赛第二名的要快
6.因此，我们取决赛的第二名和第一组中失败的其他四匹马进行比赛(比赛1次).之后就要分情况讨论了

第一种情况:如果第二匹马没有取得头名,那么最快的第二匹马和第三匹马就立刻能找到了
需要的比赛的次数就是 5+1+1 = 7次

第二种情况:如果第二匹马取得了头名,那么我们就需要考虑剩下的4匹马和第二名组里面失败的4匹马和决赛中取得第三名的马进行比赛了
也就是要从9匹马中找到最快的一匹 9匹马中随机挑5匹进行比赛,取头名再和剩下的4匹进行比赛(比赛2次)
那么这种情况需要比赛的次数就是 5+1+1+2 = 9次

我们在看看概率:
如果第二匹马在和其他4匹马比赛的时候取得了头名,概论就是1/5 = 0.2 = 20%

如果第二匹马没有取得头名 就是 100% - 20% = 80%

这么看来,总的来说答案就是

`有80%概率需要比赛7次 有20%的概率需要比赛9次`


下面我们再看一道和这题差不多的题目(思路差不多)

听说是一个百度三面的面试题目:

有25匹马,跑道3条,条件上同,
问需要至少比赛多少次才能从中找出最快的5匹马

这是我自己想的,但是也不知道是否是最少

![奔猪问题](/assets/images/horse_racing.png)


如果我们把25马认作是数字、跑道也就是每次排序能够传递的参数个数
那么通过上文的结论,可以得知,每次排序传递的参数个数和需要取得的最值个数两个因素对最值问题的时间复杂度影响是很大的

如果参数越少,需要取得的值越多,那么时间复杂度就会很大,而且还会有很多种不同的情况
试想一下如果排序的是成百上千的数据呢？

所以,每次排序的参数个数应该设置的尽可能多一些,并且最好取值的广度大一些


