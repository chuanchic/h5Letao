$(function () {
    //通过插件，添加表单校验
    $('#form').bootstrapValidator({
        //配置字段，字段是和input输入框的name相匹配
        field: {
            //用户名字段
            username: {
                //配置校验规则
                validators: {
                    //用户名不能为空
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    //长度2-6位
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度2-6位"
                    },
                    //专门用于回调的规则
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            //密码字段
            password: {
                //配置校验规则
                validators: {
                    //密码不能为空
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    //长度6-12位
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度6-12位"
                    },
                    //专门用于回调的规则
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        },
        //配置校验时的图标显示，默认是bootstrap风格，字体图标：在 Bootstrap - 组件 - Glyphicons 字体图标 里查找
        feedbackIcons: {
            //校验成功时候，显示的图标
            valid: 'glyphicon glyphicon-ok',
            //校验失败时候
            invalid: 'glyphicon glyphicon-remove',
            //校验中时候
            validating: 'glyphicon glyphicon-refresh'
        }
    });

    // 通过插件，添加登录按钮校验，type="submit"的时候，插件会在表单提交时进行校验
    // 校验成功时候，默认就提交表单，发生页面跳转，注册表单校验成功事件，阻止默认行为，通过ajax进行提交，ajax的提交不会刷新页面
    // 校验失败时候，配置提示用户即可
    // 注册表单校验成功事件
    $('#form').on("success.form.bv", function (e) {
        //阻止默认表单提交
        e.preventDefault();
        //通过ajax进行提交
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $('#form').serialize(),//通过jquery进行序列化：username=root&password=12312312
            dataType: "json",
            success: function (info) {
                if(info.success){//登录成功，跳转首页
                    location.href = "index.html";
                }else if(info.error === 1000){
                    //更新状态，三个参数：
                    //参数一：字段名称，指哪个输入框
                    //参数二：校验状态，常用是两个值，VALID，INVALID
                    //参数三：哪些校验规则要更新，不传默认就是输入框对应的所有校验规则
                    $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }else if(info.error === 1001){
                    $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        })
    });

    //通过插件，给重置按钮添加实现
    $('[type="reset"]').click(function () {
        //调用插件方法，重置校验的状态，也就是重置输入框里的对勾或者叉号之类的按钮
        //输入框里的内容不需要手动重置，type=reset默认就会重置里面的内容
        //resetForm(resetValue)，参数不传或者传false，只会重置校验状态，传true，还会重置输入框里的内容
        $('#form').data("bootstrapValidator").resetForm();
    });

});