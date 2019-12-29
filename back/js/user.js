
$(function () {

    var currentPage = 1;  // 当前页
    var pageSize = 5;   // 每页条数

    // 定义currentId
    var currentId;
    var isDelete; // 标记用户状态

    // 1. 一进入页面, 发送 ajax 请求所有用户的数据, 进行页面渲染
    render();
    // 作用: 根据全局的currentPage和pageSize进行页面渲染
    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                // 参数1: 模板id
                // 参数2: 数据对象
                var htmlStr = template("tpl", info);
                $('.lt_content tbody').html(htmlStr);

                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    // 指定 bootstrap 的版本(默认是2)，要和容器ul相对应
                    bootstrapMajorVersion: 3,
                    // 总页数，向上取整
                    totalPages: Math.ceil(info.total / info.size),
                    // 当前页
                    currentPage: info.page,
                    // 给所有的按钮, 添加页码点击事件
                    // 参数：
                    // event：         包装后的事件
                    // originalEvent： 原始事件
                    // type：          点击的是什么类型的按钮，上一页，下一页，首页，...
                    // page：          点击的是哪一页
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                });
            }
        });
    }


    // 2. 给所有启用禁用按钮, 添加点击事件(通过事件委托绑定), 显示模态框
    $('tbody').on('click', ".btn", function() {
        // 显示模态框
        $('#userModal').modal("show");

        // 通过自定义属性, 获取td中存的用户id, 并保存在全局变量中
        // jQuery中获取自定义属性的方法是：data()
        currentId = $(this).parent().data("id");

        // 1 启用, 0 禁用
        // 通过判断类名, 决定需要传递给后台 isDelete,
        // 如果是禁用按钮, 想要禁用该用户, 就是将该用户状态, 变成 0, 传 0
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    // 3. 点击模态框的确定按钮, 实现启用禁用切换
    $('#submitBtn').click(function() {
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id : currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function( info ) {
                if ( info.success ) {
                    // 关闭模态框
                    $('#userModal').modal("hide");
                    // 页面重新渲染
                    render();
                }
            }
        })
    })

})