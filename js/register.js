const registerForm = $("#register-from").get(0),
      submitBtn = $(".submit-btn");

submitBtn.click(function (e) {
    const ev = e || window.event,
          account = registerForm.account.value,
          username = registerForm.username.value,
          password = registerForm.password.value,
          rePassword = registerForm.repassword.value;
    ev.preventDefault();
    if (account && username && password && rePassword) {
        if (password === rePassword) {         
            // ajax('POST', 'http://open.duyiedu.com/api/student/stuRegister', `appkey=csl1_1590830311858&account=${account}&username=${username}&password=${password}&rePassword=${repassword}`, function(res) {
            //     if (res.status == 'success') {
            //         alert(res.msg);
            //         location.href = 'login.html';
            //     } else {
            //         alert(res.msg);
            //     }
            // }, true)
            $.ajax({
                type: 'POST',
                url: 'http://open.duyiedu.com/api/student/stuRegister',
                data: {
                    appkey: 'csl1_1590830311858',
                    account,
                    username,
                    password,
                    rePassword
                },
                dataType: 'json',
                success(res) {
                    console.log(res);
                    if (res.status === 'success') {
                        alert(res.msg);
                        location.href = 'login.html'
                    } else {
                        alert(res.msg);
                    }
                }
            })
        } else {
            alert('两次输入密码不一致');
        }
    } else {
        alert('请补全注册信息！');
    }
})