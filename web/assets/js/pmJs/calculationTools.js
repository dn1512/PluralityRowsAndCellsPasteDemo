var calculationTools = {
    //工具变量
    // 传入的参数
    intArr: [],
    //传入参数的个数，用来在intArr四则运算放大倍数后还原正常值
    parameterNum: 0,

    //加法 
    add: function () {
        this.init.apply(this, arguments);
        return this.calculation("add");
    },
    //减法   
    sub: function () {
        this.init.apply(this, arguments);
        return this.calculation("sub");
    },
    //乘法   
    mul: function () {
        this.init.apply(this, arguments);
        return this.calculation("mul");
    },
    //除法   
    div: function () {
        this.init.apply(this, arguments);
        return this.calculation("div");
    },

    //初始化
    init: function () {
    	this.parameterNum = arguments.length;
        this.intArr = [].map.call(arguments, function (item) {
            return item;
        });
    },
    //数组循环计算
    calculation: function (flag) {
        //把数组第一个值赋给sum
        var sum = this.intArr[0];
        //从数组第二项开始四则运算
        for (var i = 1; i < this.parameterNum; i++) {
            if (flag === "add") {
                sum = floatObj.add(sum, this.intArr[i]);
            } else if (flag === "sub") {
                sum = floatObj.sub(sum, this.intArr[i]);
            } else if (flag === "mul") {
            	sum = floatObj.mul(sum, this.intArr[i]);
            } else if (flag === "div") {
            	sum = floatObj.div(sum, this.intArr[i]);
            }
        }
        return sum;
    }
};

//百分数转小数 
function toPoint(percent) {
	if(percent){
        var str = percent.replace("%", "");
        return Number(floatObj.div(str, 100));
	}
	return '0';
}
//小数转百分数
function toPercent(point) {
    var str = Number(floatObj.mul(point, 100));
    str += "%";
    return str;
}

// 日期相减, 获得天数
function getNumberOfDays(date1, date2) {
    //date1：开始日期，date2结束日期
    var a1 = Date.parse(new Date(date1));
    var a2 = Date.parse(new Date(date2));
    var day = parseInt((a1 - a2) / (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
    return day
};

// 四舍五入
function roundVal(val, num) {
    if (val == '' || val == undefined || val == null ) {
        return val;
    }
    
    if (num) {
        var v2 = '1';
        for (var i = 1; i <= num; i++) {
            v2 += '0';
        }
        v2 = Number(v2)
        return Math.round(floatObj.mul(val, v2)) / v2;
    } else {
        return Math.round(val)
    }
}


Number.prototype.toFixed = function (s) {  //在Number的原型上重写toFixed方法
    var tempValue = this;
    var symbol = "";
    //针对负数 特殊处理
    if (tempValue < 0) {
        tempValue = -tempValue;
        symbol = "-";
    } 
    var changenum = roundVal(tempValue, s);
    return symbol+changenum;
}

// 动态增删表格
function addrow(tableDom) {
    var table = $(tableDom)[0]; //获得表格的信息
    if (table.rows.length == 0) { //如果是向一个空表增加一行
        var row = table.insertRow(0); //向空表插入一行
        var col = row.insertCell(0); //向新行插入一列
        col.innerHTML = "↓ FH、FC / AVERAGE →";
    } else {
        var getCol = table.rows[0].cells; //如果不是空表，首先获得表格有多少列，先获取再插入新行
        var row = table.insertRow(table.rows.length);
        for (var i = 0; i < getCol.length; i++) { //依次向新行插入表格列数的单元格
            var col = row.insertCell(i);
            if (i <= 0) { //追加行的第一列
                col.innerHTML =
                    '<input type="text" onblur="numberConversion(this)" name="fhfc1" style="width: 50px"> to ' +
                    '<input type="text" onblur="numberConversion(this)" name="fhfc2" style="width: 50px">'
            } else {
                col.innerHTML = '<input type="text" onblur="percentageConversion(this)" name="rate" style="width:80px">';
            }

        }
    }
}

function delrow(tableDom) {
    var table = $(tableDom)[0];
    if (table.rows.length <= 2) {
        return;
    }
    table.deleteRow(table.rows.length - 1); //删除一行
}

function addcol(tableDom) {
    var table = $(tableDom)[0]; //获取表格信息
    var getRow = table.rows.length; //获得行数
    var getCol = table.rows[0].cells;
    var colLen = getCol.length; //获得列数
    for (var i = 0; i < getRow; i++) {
        var insertCol = table.rows[i].insertCell(colLen); //依次向每一行的末尾插入一个新列
        if (i == 0) { //追加列的第一行
            insertCol.innerHTML =
                '<input type="text" onblur="numberConversion(this)" name="average1" style="width: 60px"> to' +
                '<input type="text" onblur="numberConversion(this)" name="average2" style="width: 60px">';
        } else {
            insertCol.innerHTML = '<input type="text" onblur="percentageConversion(this)" name="rate" style="width:80px">';
        }
    }
}

function delcol(tableDom) {
    var table = $(tableDom)[0]; //获取表格信息
    var getRow = table.rows.length; //获取表格的行数
    var getCol = table.rows[0].cells //获取表格的列数
    var colLen = getCol.length - 1;
    if (getCol.length <= 2) {
        return;
    }
    for (var i = 0; i < getRow; i++) {
        var del = table.rows[i].deleteCell(colLen); //删除每一行末尾的单元格
    }
}


var floatObj = function () {
    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }

    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0};
        if (isInteger(floatNum)) {
            ret.num = floatNum;
            return ret
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        var intNum = parseInt(floatNum * times + 0.5, 10);
        ret.times = times;
        ret.num = intNum;
        return ret
    }

    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/sub/mul/div）
     *
     */
    function operation(a, b, op) {
        var o1 = toInteger(a);
        var o2 = toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max;
            case 'sub':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max;
            case 'mul':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'div':
                result = (n1 / n2) * (t2 / t1);
                return result
        }
    }

    // 加减乘除的四个接口
    function add(a, b) {
        return operation(a, b, 'add')
    }

    function sub(a, b) {
        return operation(a, b, 'sub')
    }

    function mul(a, b) {
        return operation(a, b, 'mul')
    }

    function div(a, b) {
        return operation(a, b, 'div')
    }

    // exports
    return {
        add: add,
        sub: sub,
        mul: mul,
        div: div
    }
}();

// 新增li滚动效果
function automaticScroll(thisDom) {
    var li = $(thisDom).parents('ul').find('li:last-child'); //最后一个li
    return $(li).offset().top;
}

// 判断IE浏览器内核
function getBrowserInfo() {
    var ua = navigator.userAgent.toLocaleLowerCase();
    var browserType = null;
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        browserType = "IE";
    } else if (ua.match(/firefox/) != null) {
        browserType = "火狐";
    } else if (ua.match(/ubrowser/) != null) {
        browserType = "UC";
    } else if (ua.match(/opera/) != null) {
        browserType = "欧朋";
    } else if (ua.match(/bidubrowser/) != null) {
        browserType = "百度";
    } else if (ua.match(/metasr/) != null) {
        browserType = "搜狗";
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        browserType = "QQ";
    } else if (ua.match(/maxthon/) != null) {
        browserType = "遨游";
    } else if (ua.match(/chrome/) != null) {
        if (window.navigator.userActivation) {
            browserType = '谷歌';
        } else {
            browserType = '360';
            var is360js = _mime("type", "application/vnd.chromium.remoting-viewer");

            function _mime(option, value) {
                var mimeTypes = navigator.mimeTypes;
                for (var mt in mimeTypes) {
                    if (mimeTypes[mt][option] == value) {
                        return true;
                    }
                }
                return false;
            }
            if (is360js) {
                browserType = '360急速模式';
            } else {
                browserType = '360兼容模式';
            }
        }
    } else if (ua.match(/safari/) != null) {
        browserType = "Safari";
    }
    return browserType;
}

// 判断IE浏览器版本
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11
    } 
    // else {
    //     return -1; //不是ie浏览器
    // }
}