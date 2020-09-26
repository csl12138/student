(function () {
    class PagerFunc {
        constructor(wrap = null, {
            pageSize = 5,
            currentPage = 1,
            allSize = 10
        }, pageTurning=function(){}) {
            this.pageSize = pageSize;
            this.currentPage = currentPage;
            this.allSize = allSize;
            this.allPage = Math.ceil(allSize / pageSize);
            this.wrapper = wrap;
            this.pageTurning = pageTurning;
        }
        layout() {
            const pageContainer = $("<div class='my-page-div'></div>");
            const sizeDiv = $(`<div class='page-size'>当前每页显示<input type='number' value=${this.pageSize} />条数据</div>`);
            // 装页码的容器
            const oUl = $("<ul class='page-number'></ul>");
             // 上一页
             $("<li class='prev'>上一页</li>").appendTo(oUl);
            // 第一页
            $("<li class='page-item'>1</li>").appendTo(oUl).addClass(this.currentPage === 1 ? 'active' : '');
            // 判断省略号
            if (this.currentPage - 2 - 1 > 1) {
                $("<span>...</span>").appendTo(oUl)
            }
            for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
                if (i > 1 && i < this.allPage) {
                    $("<li class='page-item'></li>").text(i).addClass(this.currentPage === i ? "active" : '').appendTo(oUl);
                }
            }
            // 判断省略号
            if (this.currentPage + 2 + 1< this.allPage) {
                $("<span>...</span>").appendTo(oUl)
            }
            // 最后一页
            this.allPage !== 1 && this.allPage !== 0 && $(`<li class='page-item'>${this.allPage}</li>`).appendTo(oUl).addClass(this.currentPage === this.allPage ? 'active' : '');
            // 下一页
            $("<li class='next'>下一页</li>").appendTo(oUl);
            pageContainer.append(sizeDiv).append(oUl).appendTo(this.wrapper);
            if (this.currentPage === 1) {
                $('.prev').hide()
            }
            if(this.currentPage === this.allPage || this.allPage === 0) {
                $('.next').hide()
            }
        }
        bindEvent() {
            $('.prev').click(() => {
                this.currentPage --;
                this.rebuild();
            })
            $('.next').click(() => {
                this.currentPage ++;
                this.rebuild();
            })
            const self = this;
            $('.page-item').click(function() {
                self.currentPage = parseInt($(this).text());
                self.rebuild();
            })
            $(".page-size>input").change(function() {
                if ($(this).val() == 0) {
                    alert('每页显示数据不能为0');
                    return false
                }
                self.currentPage = 1;
                self.pageSize = $(this).val();
                // self.allPage = Math.ceil(self.allSize / self.pageSize);
                self.rebuild();
            })
        }
        rebuild() {
            this.wrapper.empty();
            // this.layout();
            // this.bindEvent();
            this.pageTurning(this.currentPage, this.pageSize);
        }
        init() {
            this.wrapper.empty();
            this.layout();
            this.bindEvent();    
        }
    }
    $.fn.extend({
        pager(config, pageTurning) {
            const pager = new PagerFunc(this, config, pageTurning);
            pager.init();
        }
    })
}())