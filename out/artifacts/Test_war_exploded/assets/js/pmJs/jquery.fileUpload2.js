function fileUpload() {
}

var addLoadingDom = $('<div class="ajaxLoadBox"><div class="loadBoxWidth"><div class="modal-content">正在上传，请稍等。。。</div></div></div>');


/**initFileList
 * 文件上传
 * url
 * inputId 文件input框id
 * maxSize 文件最大限制 字节
 * suffixs 允许上传后缀 如 ".xls,.txt"
 * success
 * error
 * async 是否异步执行 true/false 默认true
 */
fileUpload = function (options) {
	if (!options.inputId || !options.url) {
		return;
	}
	var files = $("#" + options.inputId).prop('files');
	if (files.length != 0) {
		var fileParam = new FormData();
		for(var i = 0; i < files.length; i++){
			var file = files[i]
			if(options.suffixs != undefined && options.suffixs) {
				var suffixs = options.suffixs.split(",");
				var type = (file.name.substr(file.name.lastIndexOf("."))).toLowerCase();
				var flag = false; 
				for (var j=0; j < suffixs.length ; j++) {
					if(suffixs[j].replace(/(^\s*)|(\s*$)/g, "") == type){
						flag = true;
						break;
					}
				}
				if(!flag){
					AmmsDialog.alert("上传失败，文件不符合类型(" + options.suffixs + ")");
					$("#" + options.inputId).val('');
					return;
				}
			}
			
			if(options.maxSize != undefined && file.size > options.maxSize){
				AmmsDialog.alert("上传失败，文件太大，最大40M");
				$("#" + options.inputId).val('');
				return;
			}
			if(options.domId){
				var fileList = getFileList(options.domId)
				if(fileList != null){
					if(checkRepetitionFiles(file.name, fileList)){
						AmmsDialog.alert("文件已存在，请勿重复上传");
						$("#" + options.inputId).val('');
						return;
					}
				}
			}
			fileParam.append('files', file, file.name);
			//fileParam.append('file', file); //参数名：file
		}
		var async = options.async != undefined ? options.async : true;
		
		$.ajax({
			url: options.url,
			type: 'POST',
			data: fileParam,
			async: async, // 同步操作
			cache: false, //禁止浏览器对该URL的缓存
			contentType: false,
			processData: false,
			//dataType: "json",
			beforeSend: function () {
				$('body').append(addLoadingDom);
			},
			success: function (data) {
				$("#" + options.inputId).val('');
				addLoadingDom.remove();
				if(options.success != undefined && options.success){
					options.success(data);
				}
			},
			error: function () {
				$("#" + options.inputId).val('');
				addLoadingDom.remove();
				if(options.error != undefined && options.error){
					options.error();
				}
			}
		});
	}
}

// 文件查重
checkRepetitionFiles = function(fileName, fileList) {
	var fileArray = JSON.parse(fileList)
	for(var i = 0; i< fileArray.length; i++){
		var fileObj = fileArray[i];
		if(fileObj.docName == fileName){
			return true;
		}
	}
	return false;
}

/**
 * 	文件上传返回信息
 * url
 * inputId 文件input框id
 * maxSize 文件最大限制 字节
 * suffixs 允许上传后缀 如 ".xls,.txt"
 * success
 * error
 * params 其他参数 json对象格式
 * delVal 上传成功后是否删除输入框文件 默认true
 */
getFileUploadList = function (options) {
	var delVal = true;
	var result = '';
	if (!options.inputId || !options.url) {
		return;
	}
	var files = $("#" + options.inputId).prop('files');
	if (files.length != 0) {
		var fileParam = new FormData();
		for(var i = 0; i < files.length; i++){
			var file = files[i]
			if(options.suffixs != undefined && options.suffixs) {
				var suffixs = options.suffixs.split(",");
				var type = (file.name.substr(file.name.lastIndexOf("."))).toLowerCase();
				var flag = false; 
				for (var j=0; j < suffixs.length ; j++) {
					if(suffixs[j].replace(/(^\s*)|(\s*$)/g, "") == type){
						flag = true;
						break;
					}
				}
				if(!flag){
					AmmsDialog.alert("上传失败，文件不符合类型(" + options.suffixs + ")");
					$("#" + options.inputId).val('');
					return;
				}
			}
			
			if(options.maxSize != undefined && file.size > options.maxSize){
				AmmsDialog.alert("上传失败，文件太大，最大40M");
				$("#" + options.inputId).val('');
				return;
			}
			fileParam.append('file', file); //参数名：file
		}
		
		if(options.params){
            var params = options.params;
            if(!(params instanceof Object)) {
                params = JSON.parse(params);
            }
            for(var key in params){
                fileParam.append(key, params[key]);
            }
		}
		var async = options.async != undefined ? options.async : false;
		$.ajax({
			url: options.url,
			type: 'POST',
			data: fileParam,
			async: async, // 同步操作
			cache: false, //禁止浏览器对该URL的缓存
			contentType: false,
			processData: false,
			//dataType: "json",
			beforeSend: function () {
			},
			success: function (data) {
				result = data;
				if(options.delVal != undefined){
					delVal = options.delVal
				}
				if(delVal){
					$("#" + options.inputId).val('');
				}
				if(options.success != undefined && options.success){
					options.success(data);
				}
			},
			error: function () {
				$("#" + options.inputId).val('');
				if(options.error != undefined && options.error){
					options.error();
				}
			}
		});
	}
	return result;
}

/**
 * 文件下载
 * downloadUrl
 * docId: docId, 
 * docName: docName, 
 */
fileDownload = function (options) {
	if(!(options instanceof Object)) {
		options = JSON.parse(options);
	}
	if(options.downloadUrl == undefined || !options.downloadUrl){
		return;
	}
	var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("action", options.downloadUrl);
    for (var key in options) {
    	if (key != 'downloadUrl') {
    		form.append($("<input>").attr("type", "hidden").attr("name", key).attr("value", options[key]));
    	}
    }
    form.appendTo('body').submit().remove();
}


/**
 * domId 绑定渲染的id
 * files 初始化文件列表 array类型
 * uploadUrl
 * downloadUrl
 * inputDomId 文件input框id
 * maxSize 文件最大限制 字节
 * id 标识或者其他参数
 * suffixs 允许上传后缀
 */
initFileList = function (options) {
	if (options.domId != undefined && options.domId) {
		if (options.files != undefined && options.files) {
			var fileArray = JSON.parse(options.files);
			for (var j = 0; j < fileArray.length; j++) {
				var docId = fileArray[j].docId;
				var docName = fileArray[j].docName;
				
				var downloadParam = {docId: docId, docName: docName, downloadUrl: options.downloadUrl};
				if(options.id != undefined && options.id){
					downloadParam.id = options.id;
				}
				var downloadParamStr = JSON.stringify(downloadParam);
				var html = '<li for="message-text" class="control-label">' +
					'<span class="filesN">' +
					'<a href="javascript:void(0)" onclick=fileDownload(\''+ downloadParamStr +'\') class="alink" docName=' + docName + ' docId=' + docId + '>'
					+ docName + '</a>' + '</span>'
				if (options.uploadUrl != undefined && options.inputDomId != undefined && options.uploadUrl && options.inputDomId) {
					html = html + '<span onclick="filesDelete(this,\'' + options.inputDomId + '\')" class="delBtn">删除</span>' + '</li >'
				} else {
					html = html + '</li >'
				}
				$("#" + options.domId).append(html);
			}
		}
		if (options.uploadUrl != undefined && options.inputDomId != undefined && options.uploadUrl && options.inputDomId) {
			bindOnChange(options);
		}
	}
}

/**
 * domId 绑定渲染的id
 * files 初始化文件列表 array类型
 * uploadUrl
 * downloadUrl
 * inputDomId 文件input框id
 * maxSize 文件最大限制 字节
 * id 标识或者其他参数
 * suffixs 允许上传后缀
 */
bindOnChange = function (options) {
	if (options.uploadUrl != undefined && options.inputDomId != undefined && options.uploadUrl && options.inputDomId) {
		$("#" + options.inputDomId).change(function () {

			fileUpload({
				inputId: options.inputDomId,
				url: options.uploadUrl,
				suffixs: options.suffixs,
				maxSize: options.maxSize,
				domId: options.domId,
				success: function (data){
					if(data != undefined && data){
						var files = JSON.parse(data);
						if(files.message != undefined && files.message){
							AmmsDialog.alert(files.message);
							return;
						}
						for (var k = 0; k < files.length; k++) {
							var docId = files[k].docId;
							var docName = files[k].docName;
							
							var downloadParam = {docId: docId, docName: docName, downloadUrl: options.downloadUrl};
							var downloadParamStr = JSON.stringify(downloadParam);
							if(options.id != undefined && options.id){
								downloadParam.id = options.id;
							}
							
							$("#" + options.domId).append(
								'<li for="message-text" class="control-label">' +
								'<span class="filesN">' +
								'<a href="javascript:void(0)" onclick=fileDownload(\''+ downloadParamStr +'\') class="alink" docName=' + docName + ' docId=' + docId + '>'
								+ docName + '</a>' + '</span>' +
								'<span onclick="filesDelete(this, \'' + options.inputDomId + '\')" class="delBtn">删除</span>' +
								'</li >'
							);
						}
					} else {
						AmmsDialog.alert("文件为空！");
					}
					return data;
				},
				error: function(){
					AmmsDialog.alert("服务器错误，请联系管理员");
				}
			});
			
		})
	}
}



getFileList = function (domId) {
	var fileList;
	if ($("#" + domId + " a")) {
		fileList = [];
		$.each($("#" + domId + " a"), function (index, value) {
			var str = {};
			str.docId = $(value).attr('docId')
			str.docName = $(value).text()
			fileList.push(str)
		});
	}
	return fileList.length > 0 ? JSON.stringify(fileList) : null;
}

filesDelete = function (docDom, inputDomId) {
	$("#" + inputDomId).val('');
	$(docDom).closest("li").remove();
}
