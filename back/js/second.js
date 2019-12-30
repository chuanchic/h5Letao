
$(function() {

    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页条数

    //一进入页面, 发送 ajax 请求进行渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function( info ) {
                // 在模板中可以任意使用数据对象里面的所有属性
                var htmlStr = template( "secondTpl", info );
                $('.lt_content tbody').html( htmlStr );

                // 进行分页初始化
                $('#paginator').bootstrapPaginator({
                    // 版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil( info.total / info.size ),
                    // 添加按钮点击事件
                    onPageClicked: function( a, b, c, page ) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    };

    //点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function() {
        $('#addModal').modal("show");
        // 通过获取一级分类接口(带分页的) 模拟 获取全部一级分类的接口
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function( info ) {
                var htmlStr = template("dropdownTpl", info );
                $('.dropdown-menu').html( htmlStr );
            }
        })
    });

    //给下拉列表的 a 添加点击事件(通过事件委托绑定)
    $('.dropdown-menu').on("click", "a", function() {
        // 获取 a 的文本
        var txt = $(this).text();
        // 设置 给按钮
        $('#dropdownText').text(txt);
        // 获取选中的id
        var id = $(this).data("id");
        // 设置给input，用来表单校验
        $('[name="categoryId"]').val(id);
        //因为隐藏域input的name属性值改变，监听不到，所以需要手动更新校验状态为校验成功
        //updateStatus(字段名, 校验状态, 校验规则)
        //校验规则：就是callback，用来校验失败的时候提示信息，校验成功的情况下不用传
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    //配置文件上传插件, 进行文件上传初始化
    $('#fileupload').fileupload({
        // 配置返回数据格式
        dataType: "json",
        // 上传完成图片后, 调用的回调函数
        // 通过 data.result.picAddr 获取响应的图片地址
        done: function(e, data) {
            // 获取地址
            var imgUrl = data.result.picAddr;
            // 设置给 img
            $('#imgBox img').attr("src", imgUrl);
            // 设置给input，用来表单校验
            $('[name="brandLogo"]').val(imgUrl);
            //同上，也需要手动更新为校验成功
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    //配置表单校验
    $('#form').bootstrapValidator({
        //指定不校验的类型，设置为空，即都校验，因为当前表单里有input框为type="hidden"类型的，需要校验
        excluded: [],
        feedbackIcons: {
            //校验成功时候，显示的图标
            valid: 'glyphicon glyphicon-ok',
            //校验失败时候
            invalid: 'glyphicon glyphicon-remove',
            //校验中时候
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            }
        }
    });

    //当表单校验成功时，会触发`success.form.bv`事件，此时会提交表单，需要阻止表单的自动提交，使用ajax进行提交
    $('#form').on("success.form.bv", function(e) {
        // 阻止默认的提交
        e.preventDefault();
        // 通过 ajax 提交
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function( info ) {
                if ( info.success ) {
                    // 重置表单内容和状态，只能重置表单元素，其他元素需要手动重置
                    $('#form').data("bootstrapValidator").resetForm(true);
                    //手动重置其他元素
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src", "images/none.png");
                    // 关闭模态框
                    $('#addModal').modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();
                }
            }
        })
    });

});