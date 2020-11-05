/**
 *
 * 为datagrid的编辑器挂载粘贴事件监听 实现将从excle中赋值出来的多行多列数据进行多行多列粘贴
 *
 * @param datagridId     ｜     datagridID名称
 * @param editor         ｜     使用datagrid的getEditors 方法取出 editors 对象，循环editors 得到的editors[i]
 * @param editorIndex    ｜     editors[i]中的i值 目前没用上，未来扩展需要
 * @param field          ｜     editors[i].field 得到的该列的field
 * @param rowIndex       ｜     editor所在的行id 也就是进入编辑状态时的index值
 */

function addPasteEventListenerToEditor(datagridId,editor,editorIndex,field,rowIndex) {
  // console.info(editor.target[0]);
  // field = field;
  $(editor.target).bind('focus',function (e) {
    //当前单元格的值
    var currentValue = undefined;
    //当前单元格上一步的值
    var currentLastValue = undefined;
    //将编辑器的原值赋值给当前单元格的值
    currentValue = editor.oldHtml;
    ////这个监听没加上
    // if(null != editor.target[0].onpaste){
    //   editor.target[0].onpaste = null;
    // }
    $(editor.target).bind('input',function () {
      //当前单元格的值交给当前单元格上一步的值
      currentLastValue = currentValue;
      //获取新的当前单元格值
      currentValue = $(this).val();
    });


    editor.target[0].onbeforepaste = function(e){
      alert(0);
      console.info(e);
      console.info('onbeforepaste');
    }
    /*
    经测试 $(editor.target).bind('paste',function (e) {  })
    方式添加的监听，可以监听到粘贴事件 但是e.clipboardData获取不到
    故此使用editor.target[0].onpaste = function(e){}的方式添加监听
   */
    editor.target[0].onpaste = function(e){
      //判断能否获取剪贴板的内容
      if ( !(e.clipboardData && e.clipboardData.items) ) {
        return;
      }
      //循环剪贴板中的所有item对象
      for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i];
        //item对象中类型属于字符串的
        if (item.kind === "string") {
          item.getAsString(function (str) {
            // console.log(checkHtml(str));
            // console.log(str);
            if(checkHtml(str)){
              // console.log(str);
              //解析html代码拿出数据
              var el = document.createElement( 'div' );
              el.innerHTML = str;
              //获得所有粘贴进来的tr
              var trs = el.getElementsByTagName('tr');
              //拿出所有当前页面行的数据
              var rowsData = $('#'+datagridId).datagrid('getRows');
              //最后一行的索引号
              var lastRowsIndex = rowsData.length - 1;
              //开始粘贴的行的索引号
              var pasteStartRowIndex = rowIndex;
              //开始粘贴的单元格的索引号
              var cellIndex;
              //获取datagrid的所有列的列名
              var columns = $('#'+datagridId).datagrid("options").columns;
              //获取最后一个列的索引号
              var lastCellIndex = columns[0].length - 1;
              for (var i = 0; i < columns[0].length -1 ; i++) {
                // console.info(columns[0][i].field);
                if(columns[0][i].field == field){
                  // 给单元格的索引号赋值
                  cellIndex = i;
                  break;
                }
              }
              //结束当前行的编辑状态
              $('#'+datagridId).datagrid('endEdit',rowIndex);
              for (var x = 0; x <= (lastRowsIndex - pasteStartRowIndex); x++) {
                if(x >= trs.length){
                  continue;
                }
                //获取粘贴进来的行里获取所有的单元格
                var tds = trs[x].cells;
                for (var j = 0; j < (lastCellIndex - cellIndex); j++) {
                  if(j >= tds.length){
                    continue;
                  }
                  //第几个单元格就拿从开始粘贴的单元格的索引号开始的第几个列名
                  var fieldName = columns[0][j+cellIndex].field;
                  //去除第一个单元格的粘贴痕迹，只保留粘贴前单元格内的字符
                  if(x == 0 && j == 0){

                    var putInstr = currentLastValue + tds[j].innerHTML.trim();
                    rowsData[x+pasteStartRowIndex][fieldName] = putInstr;
                  }else{
                    rowsData[x+pasteStartRowIndex][fieldName] = tds[j].innerHTML.trim();
                  }
                }
              }
              //重新添妆所有数据
              $('#'+datagridId).datagrid('loadData',rowsData);
              //下面这个方法不要轻易打开，若直接对当前行再次粘贴多行多列，会有问题。
              // $('#'+datagridId).datagrid('beginEdit',rowIndex);
              //需要重置 rowIndex值一遍再次开启编辑状态
              return undefined;
            }
          })
        } else if (item.kind === "file") {
          //剪贴板中类型属于文件的 ps：这个在IE里不能用  火狐和谷歌可以
          var f= item.getAsFile();
          console.log(f);
        }
      }
      return rowIndex;
    }

  })

}

/**
 * 判断字符串是否是个html代码
 * @param htmlStr
 * @returns {boolean}
 */
function checkHtml(htmlStr) {
  var  reg = /<[^>]+>/g;
  return reg.test(htmlStr);
}