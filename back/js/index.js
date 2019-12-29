$(function () {

    //echarts - 文档 - 教程 - 5分钟上手Echarts，然后复制为下面代码
    //或者去这里找：echarts - 实例 - 官方实例

    // 基于准备好的dom，初始化echarts实例
    var echart1 = echarts.init(document.querySelector(".echarts_1"));
    // 指定图表的配置项和数据
    var option1 = {
        //标题
        title: {
            text: '2017注册人数'
        },
        //提示框组件，鼠标放在柱状图上会有提示
        tooltip: {
            //一般折线图为：axis，饼状图为：item
            trigger: "axis"
        },
        //图例指示
        legend: {
            data:['人数']
        },
        //X轴刻度
        xAxis: {
            data: ["1月","2月","3月","4月",,"5月"]
        },
        //Y轴刻度，应该根据数据动态生成，不能直接写死，echarts已经做了
        yAxis: {},
        series: [{
            name: '人数',
            //line：折线图，pie：饼状图，bar：柱状图
            type: 'bar',
            data: [1005, 2000, 3600, 190, 510, 920]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    echart1.setOption(option1);

    var echart2 = echarts.init(document.querySelector(".echarts_2"));
    var option2 = {
        title : {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x:'center'
        },
        //提示框组件，鼠标放在柱状图上会有提示
        tooltip : {
            trigger: 'item',
            //查看formatter：echarts - 文档 - 配置项手册 - setOption - tooltip - formatter
            //可以得知 饼图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //图例指示
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','新百伦','李宁','阿迪王']
        },
        series : [
            {
                //系列名称，代表上面的a变量
                name: '品牌',
                type: 'pie',
                //配置直径占容器的百分比
                radius : '55%',
                //配置圆心的位置
                center: ['50%', '60%'],
                //数据项名称，代表上面的b变量
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'李宁'},
                    {value:1548, name:'阿迪王'}
                ],
                //添加阴影效果
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    echart2.setOption(option2);

});