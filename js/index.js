//判断有无cookie   
const username = getCookie('username');
if (username) {
    $('.user-name').text(username);
} else {
    location.href = 'login.html';
}

let currPage = 1,
    size = 5,
    allPage = null,
    tableData = null;

// 绑定事件
function bindEvent() {
    // 左侧菜单栏
    $('.left-menu>dl').on('click', 'dd', function () {
        $(this).addClass('active').siblings().removeClass('active');
        const id = $(this).data('id');
        if ($(this).index() === 1) {
            $(`#${id}`).add('.search').fadeIn().end().siblings().not('.search').fadeOut();
        } else {
            $(`#${id}`).fadeIn().siblings().fadeOut();
        }
    })
    // 新增学生
    $('#add-student').on('click', '.submit-btn', function (e) {
        e.preventDefault();
        const data = dealData($('#add-student').serializeArray());
        sendAjax('/api/student/addStudent', data, function (res) {
            alert('添加成功');
            $('.left-menu dd[data-id="student-list"]').trigger('click');
            getTableData();
        })
    })
    // 编辑
    $("#student-list tbody").on('click', '.edit', function () {
        const index = $(this).parents('tr').index();
        for (const prop in tableData[index]) {
            if (tableData[index].hasOwnProperty(prop)) {
                if ($(".modal-content>form").get(0)[prop]) {
                    $(".modal-content>form").get(0)[prop].value = tableData[index][prop];
                }
            }
        }
        $(".modal").slideDown();
    })
    // 关闭弹窗
    $('.modal').click(function (e) {
        if (e.target === this) {
            $(this).slideUp();
        }
    })
    // 编辑表单的提交
    $('.modal-content .submit-btn').click(function (e) {
        e.preventDefault();
        const data = dealData($('.modal-content>form').serializeArray());
        sendAjax('/api/student/updateStudent', data, function (res) {
            alert(res.msg);
            getTableData();
            $(".modal").slideUp();
        })
    })
    // 删除
    $("#student-list tbody").on('click', '.delete', function () {
        const index = $(this).parents('tr').index();
        const isDel = window.confirm(`确认删除学号为${tableData[index].sNo}的学生信息吗？`);
        if (isDel) {
            sendAjax('/api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function (res) {
                alert(res.msg);
                getTableData();
            })
        }
    })
    // 搜索
    $('.search-btn').click(function () {
        const search = $("#search-info").val();
        const sex = $('#search-sex').val();
        if (search) {
            sendAjax("/api/student/searchStudent", {
                sex,
                search,
                page: currPage,
                size
            }, function (res) {
                allPage = Math.ceil(res.data.cont / size);
                renderTable(res.data.searchList,res.data.cont);
            })
        }
    })
    // 返回学生总表
    $('.return').click(function() {
        currPage = 1;
        $("#search-info").val("");
        getTableData();
    })
}
bindEvent();


// 获取表格数据
function getTableData() {
    sendAjax("/api/student/findByPage", {
        page: currPage,
        size
    }, function (res) {
        allPage = Math.ceil(res.data.cont / size);
        tableData = res.data.findByPage;
        renderTable(res.data.findByPage, res.data.cont);
    })
}
getTableData();

// 渲染表格
function renderTable(data, count) {
    const htmlStr = data.reduce((prev, curr) => {
        return prev + `
        <tr>
        <td>${curr.sNo}</td>
        <td>${curr.name}</td>
        <td>${curr.sex == 0 ? '男' : '女'}</td>
        <td>${curr.email}</td>
        <td>${new Date().getFullYear() - curr.birth}</td>
        <td>${curr.phone}</td>
        <td>${curr.address}</td>
        <td>
            <button class="edit" >编辑</button>
            <button class="delete">删除</button>
        </td>
    </tr>
        `
    }, '')
    $("#student-list tbody").html(htmlStr);
    $('.page').pager({
        pageSize: size,
        currentPage: currPage,
        allSize: count
    }, function (currentPage, pageSize) {
        currPage = currentPage,
            size = pageSize;
        if ($("#search-info").val()) {
            $('.search-btn').trigger('click');
        } else {
            getTableData();
        }
    })
}

// 处理数据
function dealData(dataArray) {
    const data = {};
    dataArray.forEach((item) => {
        data[item.name] = item.value;
    })
    return data;
}

// 获取所有学生
function getEchartsData () {
    const sexData = {
        "男": 0,
        "女": 0
    };
    const areaData = {};
    sendAjax("/api/student/findAll", undefined, function (res) {
        let all = res.data;
        all.forEach((person) => {
            if (!areaData[person.address]) {
                areaData[person.address] = 1;
            } else {
                areaData[person.address]++;
            }
            if (person.sex) {
                // 女
                sexData["女"]++;
            } else {
                sexData["男"]++;
            }
        })
        renderAreaEcharts(areaData);
        renderSexEcharts(sexData);
    })
}
getEchartsData();

// 渲染学生地域分布图
function renderAreaEcharts (data) {

    const myChart = echarts.init($("#student-info .area").get(0));
    // 指定图表的配置项和数据
    const option = {
        title: {
            text: '学生地域分布情况图'
        },
        tooltip: {},
        legend: {
            data:['城市']
        },
        xAxis: {
            data: Object.keys(data)
        },
        yAxis: {},
        series: [{
            name: '城市',
            type: 'bar',
            data: Object.values(data)
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// 渲染学生性别比列
function renderSexEcharts (data) {
    const myChart = echarts.init($("#student-info .sex").get(0));
    const option = {
        title: {
            text: '学生性别比列',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: Object.keys(data)
        },
        series: [
            {
                name: '性别',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: data["男"], name: '男'},
                    {value: data["女"], name: '女'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}



// 发送网络请求
function sendAjax(url, data={}, callback) {
    $.ajax({
        type: 'get',
        url: 'http://open.duyiedu.com' + url,
        data: {
            appkey: 'csl1_1590830311858',
            ...data
        },
        dataType: 'json',
        success(res) {
            if (res.status === 'success') {
                callback(res)
            } else {
                alert(res.msg)
            }
        }
    })
}