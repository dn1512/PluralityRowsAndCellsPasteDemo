<%--
  Created by IntelliJ IDEA.
  User: liutengjun
  Date: 2020/10/26
  Time: 3:57 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
    <script type="text/javascript" src="assets/uploadify/jquery.js"></script>
    <script type="text/javascript" src="assets/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>
    <%--<script src="assets/easy-ui/easyui-lang-zh_CN.js"></script>--%>
    <script type="text/javascript" src="assets/js/addPasteEventListener.js"></script>
    <%--<script type="text/javascript" src="assets/js/jquery-form.js"></script>--%>
    <%--<script type="text/javascript" src="assets/js/fuelux/fuelux.wizard.min.js"></script>--%>
    <%--<script type="text/javascript" src="assets/js/fuelux/fuelux.wizard.min.js"></script>--%>
    <%--<script type="text/javascript" src="assets/js/jquery.validate.min.js"></script>--%>
    <%--<script type="text/javascript" src="assets/bootstrap3-dialog/js/bootstrap-dialog.min.js"></script>--%>
    <%--<script type="text/javascript" src="assets/bootstrap3-dialog/js/amms-dialog.js"></script>--%>
    <%--<script type="text/javascript" src="assets/custom/js/common.js"></script>--%>
    <%--<script type="text/javascript" src="assets/bootstrapValidator/bootstrapValidator.min.js"></script>--%>
    <%--<script type="text/javascript" src="assets/js/sign/BJCAWebSignCom.CSAIR.js"></script>--%>
    <%--<script type="text/javascript" src="assets/js/sign/jquery.md5.js"></script>--%>
    <%--<script type="text/javascript" src="assets/bootstrap-datetimepicker-2.3.0/js/bootstrap-datetimepicker.js">--%>
    <link rel="stylesheet" type="text/css" href="assets/jquery-easyui-1.4.4/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="assets/jquery-easyui-1.4.4/themes/icon.css">


    <script>

      var rowIndex = undefined;
      var field = undefined;

      $(function () {
        intializationDatagrid();
        loadDatagridDefaultRows();


        // document.getElementById('body').addEventListener('paste',function(e){
        //   if ( !(e.clipboardData && e.clipboardData.items) ) {
        //     return;
        //   }
        //   for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        //     var item = e.clipboardData.items[i];
        //
        //     if (item.kind === "string") {
        //       item.getAsString(function (str) {
        //         // console.log(str);
        //         // alert(checkHtml(str));
        //         if(checkHtml(str)){
        //           console.info('贴入从excel复制的多行内容');
        //           //解析html代码拿出数据
        //           var el = document.createElement( 'div' );
        //           el.innerHTML = str;
        //           var trs = el.getElementsByTagName('tr');
        //           console.info(trs);
        //
        //           var columns = $('#testDatagrid').datagrid("options").columns;
        //           for (var i = 0; i < columns[0].length -1 ; i++) {
        //             console.info(columns[0][i].field);
        //             if(columns[0][i].field == field){
        //               console.info(field + "找到了，在第"+rowIndex+"行第" +i+"个单元格");
        //               break;
        //             }
        //           }
        //         }
        //       })
        //     } else if (item.kind === "file") {
        //       var f= item.getAsFile();
        //       console.log(f);
        //     }
        //   }
        // });


        $(document).keyup(function(event){
          // alert('你按下了' + event.keyCode);
          // if (event.ctrlKey){
          //   alert('ctrlKey');
          // }
          if(event.ctrlKey && event.keyCode==86){
            // alert('ctrlKey+V');
            document.getElementById("body").onPaste;
          }
        });

      })

      function loadDatagridDefaultRows() {
        var data = {
          rows:[
            {'a':'1','b':'1','c':'1','d':'1','e':'1','f':'1'},
            {'a':'2','b':'2','c':'2','d':'2','e':'2','f':'2'},
            {'a':'3','b':'3','c':'3','d':'3','e':'3','f':'3'},
            {'a':'4','b':'4','c':'4','d':'4','e':'4','f':'4'},
            {'a':'5','b':'5','c':'5','d':'5','e':'5','f':'5'},
            {'a':'6','b':'6','c':'6','d':'6','e':'6','f':'6'},
            {'a':'7','b':'7','c':'7','d':'7','e':'7','f':'7'},
            {'a':'8','b':'8','c':'8','d':'8','e':'8','f':'8'},
            {'a':'9','b':'9','c':'9','d':'9','e':'9','f':'9'},
            {'a':'10','b':'10','c':'10','d':'10','e':'10','f':'10'},
            {'a':'11','b':'11','c':'11','d':'11','e':'11','f':'11'},
            {'a':'12','b':'12','c':'12','d':'12','e':'12','f':'12'},
            {'a':'13','b':'13','c':'13','d':'13','e':'13','f':'13'},
            {'a':'14','b':'14','c':'14','d':'14','e':'14','f':'14'},
            {'a':'15','b':'15','c':'15','d':'15','e':'15','f':'15'},
          ]
        }
        $("#testDatagrid").datagrid('loadData',data);
        // $("#testDatagrid").datagrid('load');

      }

      function intializationDatagrid(){
        $("#testDatagrid").datagrid({
          url : '',
          method : 'post',
          width : 'auto',
          height : 'auto',
          fit : true,
          fitColumns : true,
          nowrap : false,
          rownumbers : true, //是否加行号
          singleSelect : true,
          selectOnCheck : true,
          checkOnSelect : false,
          striped : true,
          loadMsg : '正在处理，请稍等...',
          scrollbarSize : 0,
          pagination : true, //是否显式分页
          pageSize : 10, //页容量，必须和pageList对应起来，否则会报错
          pageList : [ 10, 20, 30, 40 ], //分页中下拉选项的数值
          pageNumber : 1, //默认显示第几页
          columns : [ [
            {
              field:'a',
              title:'A',
              width:100,
              editor:{
                type:"text"
              }
            },{
              field:'b',
              title:'B',
              width:100,
              editor: {
                type: "text"
              }
            },{
              field:'c',
              title:'C',
              width:100,
              editor: {
                type: "text"
              }
            },{
              field:'d',
              title:'D',
              width:100,
              editor: {
                type: "text"
              }
            },{
              field:'e',
              title:'E',
              width:100,
              editor: {
                type: "text"
              }
            },{
              field:'f',
              title:'F',
              width:100,
              editor: {
                type: "text"
              }
            }
          ] ],
          onClickCell:function (index, field, value) {
            // console.info("index:"+index);
            // console.info("field:"+field);
            // console.info("value:"+value);
            rowIndex = index;
            field = field;
          },
          onDblClickRow:function (index, row) {
            if (rowIndex != undefined) {
              $("#testDatagrid").datagrid("endEdit", rowIndex);
              rowIndex = undefined;
            }
            //当无编辑行时
            if (rowIndex == undefined) {
              $("#testDatagrid").datagrid('beginEdit',index);
              rowIndex = index;
              var editors = $('#testDatagrid').datagrid('getEditors', index);
              for (var i = 0; i < editors.length; i++) {
                rowIndex = addPasteEventListenerToEditor('testDatagrid',editors[i],i,editors[i].field,index);
              }
            }

          }
        });
      }

    </script>

  </head>
  <body>
  <table id="testDatagrid"></table>
  </body>
</html>
