removeCookie('username');
const loginForm = $('#login-form').get(0);
dengluBtn = $('.denglu-btn');
dengluBtn.click(function (e) {
    const ev = e || window.event,
        account = loginForm.account.value,
        password = loginForm.password.value;
    ev.preventDefault();
    if (account && password) {
        $.ajax({
            type: 'POST',
            url: 'http://open.duyiedu.com/api/student/stuLogin',
            data: {
                appkey: 'csl1_1590830311858',
                account,
                password
            },
            dataType: 'json',
            success(res) {
                if (res.status === 'success') {
                    setCookie('username', account);
                    location.href = 'index.html';
                } else {
                    alert(res.msg)
                }
            }
        })
    } else {
        alert('请填写完再登录!');
    }
})