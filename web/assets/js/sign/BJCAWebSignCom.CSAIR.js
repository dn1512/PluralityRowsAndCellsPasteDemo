var $_$CurrentObj = null;   // Current use class Object

function WriteEnterpriseBusinessInfo(bstrEnterpriseName, bstrComputerCode, bstrTaxRegisterCode, bstrOrganizationCode, bstrCommerceRegisterCode, bstrWritePinCode)
{
	return $_$CurrentObj.WriteEnterpriseBusinessInfo(bstrEnterpriseName, bstrComputerCode, bstrTaxRegisterCode, bstrOrganizationCode, bstrCommerceRegisterCode, bstrWritePinCode);
}

function ReadEnterpriseCategoryInfo(cFieldType)
{
	return $_$CurrentObj.ReadEnterpriseCategoryInfo(cFieldType);
}

//check browser, ie: return true, other return false
function $checkBrowserISIE() {
	if (!!window.ActiveXObject || 'ActiveXObject' in window) {
		return true;
	} else {
		return false;
	}
	//return navigator.userAgent.toLowerCase().search(/(msie\s|trident.*rv:)([\w.]+)/)!= -1;
}

//RfidAppCOM class
function CreateWebSignObject(objectIDString, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString) {	
	var bOK = $LoadControl("820390E5-1C07-483D-AEED-6A0EDF640AA2", objectIDString, null, true, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString);
	if (!bOK) {
		//alert("创建签章对象异常！");
		return null;
	}

	var o = new Object();
	
	var clt = eval(objectIDString)
	o.Sign = function(plainstring) {
		
		return clt.Sign(plainstring);
	};
	o.Verify = function(plainstring, signDataString) {
		
		return clt.Verify(plainstring, signDataString);
	};
	o.ConvertSampleSeal = function() {
		
		return clt.RemoveSign();
	};
	
	o.SetCtrlPos = function(x ,y ) {
		return clt.SetCtrlPos(x,y );
	};
	
	o.SetOffsetPos = function(posRelativeElementIDString, x ,y ) {
		return clt.SetOffsetPos(posRelativeElementIDString, x,y );
	};
	
	o.SetDisplayRect = function(left,top,width,height) {
		return clt.SetDisplayRect(left,top,width,height);
	};
	
	o.GetXPos = function(x ,y ) {
		return clt.GetXPos();
	};

	o.GetYPos = function(x ,y ) {
		return clt.GetYPos();
	};
	
	o.ShowLastVerifyResult = function() {
		return clt.ShowLastVerifyResult();
	};
	
	o.GetSignature = function() {		
		return clt.GetSignature();
	};
	
	o.SetSignature = function(signValue) {		
		return clt.SetSignature(signValue);
	};
	
	o.IsSigned = function() {		
		return clt.IsSigned();
	};
	o.SetVisible = function(bVisible) {
		return clt.SetVisible(bVisible);
	};
	
	o.GetVisible = function() {
		return clt.GetVisible();
	};
	
	o.GetCerOID = function() {
		return clt.GetCerOID();
	};
	
	o.GetCerInfo = function(iType) {
		return clt.GetCerInfo(iType);
	};
	
	o.IsKeyReady = function() {
		return clt.IsKeyReady();
	};
	
	o.SignFormFields = function(formname, elementname, bsilence) {
		return clt.SignFormFields(formname, elementname, bsilence);
	};	
	
	o.VerifyFormFields = function() {
		return clt.VerifyFormFields();
	};
	
	o.GetSignTime = function() {
		return clt.GetSignTime();
	};
	
	o.GetStampPicAfterVerified = function() {
		return clt.GetStampPicAfterVerified();
	};	
	
	o.SetWebServiceURL = function(strData) {
		
		return clt.SetWebServiceURL(strData);
	};

	o.ShowSignerCertInfo = function() {
		
		return clt.ShowSignerCertInfo();
	};
	
	return o;
}

// IE11下注册监听函数
function $AttachForIE11Event(strObjName, eventName, callbackFunName) {
	var handler = document.createElement("script");
	handler.setAttribute("for", strObjName);
	handler.setAttribute("event", eventName);
	handler.appendChild(document.createTextNode(callbackFunName));
	document.body.appendChild(handler);
}

//加载一个控件
function $LoadControl(CLSID, ctlName, testFuncName, addEvent, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString) {
	var pluginDiv = document.getElementById("pluginDiv" + ctlName);
	if (pluginDiv) {
		//return true;
		document.body.removeChild(pluginDiv);
		pluginDiv.innerHTML = "";
		pluginDiv = null;
	}
	pluginDiv = document.createElement("div");
	pluginDiv.id = "pluginDiv" + ctlName;
	document.body.appendChild(pluginDiv);
	
	try {
		if ($checkBrowserISIE()) {	// IE
			if(window.navigator.platform == "Win32")   //codeBase="BJCAWebSign.CAB#version=4,1,0,0"
				pluginDiv.innerHTML = '<object id="' + ctlName + '" classid="CLSID:'+ CLSID +'" codeBase="BJCAWebSign.CAB#version=4,2,1,2" style="POSITION: absolute; TOP: 10px; LEFT: 10px;"> <PARAM NAME="Visible" VALUE="true"> </object>';
			else
				pluginDiv.innerHTML = '<object id="' + ctlName + '" classid="CLSID:'+ CLSID +'" codeBase="BJCAWebSignX64.CAB#version=4,2,1,2" style="POSITION: absolute; TOP: 10px; LEFT: 10px;"> <PARAM NAME="Visible" VALUE="true"> </object>';
			if (addEvent) {
				var clt = eval(ctlName);
				if (clt.attachEvent) { 
					clt.attachEvent("OnSign", OnSignCallbackFun);
					clt.attachEvent("OnVerify", OnVerifyCallbackFun);
					clt.attachEvent("OnSignRemoved", OnSignRemovedCallbackFun);
				} else {// IE11 not support attachEvent, and addEventListener do not work well, so addEvent ourself
					$AttachForIE11Event(ctlName, "OnSign", OnSignCallbackFunString);
					$AttachForIE11Event(ctlName, "OnVerify", OnVerifyCallbackFunString);
					$AttachForIE11Event(ctlName, "OnSignRemoved", OnSignRemovedCallbackFunString);					
					//clt.addEventListener("OnUsbKeyChange", $OnUsbKeyChange, false);
				}	
			}
		} else {
			if (addEvent) {
			pluginDiv.innerHTML = '<embed id=' + ctlName + ' type=application/x-xtx-axhost clsid={' + CLSID + '} event_OnUsbkeyChange=$OnUsbKeyChange width=0 height=0 />' ;
			} else {
				pluginDiv.innerHTML = '<embed id=' + ctlName + ' type=application/x-xtx-axhost clsid={' + CLSID + '} width=0 height=0 />' ;
			}	
		}
		if (testFuncName != null && testFuncName != "") {
			if(eval(ctlName + "." + testFuncName) == undefined) {
				document.body.removeChild(pluginDiv);
				pluginDiv.innerHTML = "";
				pluginDiv = null;
				return false;
			} 
		}
		return true;
	} catch (e) {
		document.body.removeChild(pluginDiv);
		pluginDiv.innerHTML = "";
		pluginDiv = null;
		return false;
	}
}

//Load BJCA Controls
function $LoadBJCACOM() {
	var $_$XTXAppObj = null;    
	$_$XTXAppObj = CreateRfidAppObject();
	if ($_$XTXAppObj != null) {
		$_$CurrentObj = $_$XTXAppObj;
		return;
	}
	
	alert("检查非接卡COM出错!");
	return;
}

//add onLoad callback function
function AddOnLoadEvent(func) {
	var oldOnLoad = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		oldOnLoad();
		func();
	}
	return;
}

//$LoadBJCACOM();
// add onload function 
//AddOnLoadEvent($onLoadFunc);
//AddOnLoadEvent($LoadBJCACOM);





//获取已插入key列表 
//梁华荣
function getKeyInfo(){	

	//异常处理
    try {
		XTXAPP.SOF_GetUserList();
　　 } catch(e) {
		//alert("初始化数字证书控件异常！");
		return false;
　　 } finally {
		//
　　 }

	//当前时间串
	var theDate = new Date();
	var dateY = parseInt(theDate.getFullYear()),
		dateM = parseInt(theDate.getMonth()) + 1,
		dateD = parseInt(theDate.getDate()),
		dateH = parseInt(theDate.getHours()),
		dateMin = parseInt(theDate.getMinutes());
	var dateText = dateY +""+ (dateM < 10 ? "0" + dateM : dateM) +""+ (dateD < 10 ? "0" + dateD : dateD);
	var timeText = (dateH < 10 ? "0" + dateH : dateH) +""+ (dateMin < 10 ? "0" + dateMin : dateMin) + "00";
	var dateTime = dateText+""+timeText;
	
	var certUserList = [];
	var usrlst = XTXAPP.SOF_GetUserList();
	usrlst = usrlst.replace(/\（/ig,"(");
	usrlst = usrlst.replace(/\）/ig,")");
	while (usrlst != "") {
		var i = usrlst.indexOf("&&&");
		if (i <= 0 ) {	break; }
		var left = usrlst.substring(0, i);
		left = left.replace("(测试)","");
		var right = usrlst.substring(i+3, usrlst.length);
		
		var x = left.indexOf("||");
		var y = left.indexOf("(");
		var z = left.indexOf(")");
		var certUserInfo = {};
		certUserInfo.id = left.substring(x+2, i);
		certUserInfo.num = left.substring(y+1,z);
		certUserInfo.name = left.substring(0, y);
		certUserInfo.verify = "Y";
		certUserInfo.verifytext = "key正常";
		
		//获取key证书
		var certId = left.substring(x+2, i);
		var cert = XTXAPP.SOF_ExportUserCert(certId);
		if (cert == "") {
			certUserInfo.verify = "N";
			certUserInfo.verifytext = "key不可用，数字证书为空";
			//alert("key不可用，数字证书为空。");
		} else {
			var stime = XTXAPP.SOF_GetCertInfo(cert, 11).substring(0, 14);
			var etime = XTXAPP.SOF_GetCertInfo(cert, 12).substring(0, 14);
			if(parseInt(stime)>parseInt(dateTime) || parseInt(etime)<parseInt(dateTime)){
				certUserInfo.verify = "N";
				certUserInfo.verifytext = "key不可用，数字证书不在有效使用期。";
				//alert("key不可用，数字证书不在有效使用期。");
			}else{
				certUserInfo.stime = stime;
				certUserInfo.etime = etime;
				certUserInfo.cert  = cert;
			}
		}
		certUserList.push(certUserInfo);
		usrlst = right;
	}
	return certUserList?certUserList:[];
}//end function

//新建OBJECT对象 
//梁华荣
var isIE = navigator.userAgent.toLowerCase().search(/(msie\s|trident.*rv:)([\w.]+)/)!= -1;
if (isIE) {
	var XTXAPPDOM = document.getElementById("XTXAPP");
	if(!XTXAPPDOM){
		document.writeln("<OBJECT classid=\"CLSID:3F367B74-92D9-4C5E-AB93-234F8A91D5E6\" height=1 id=XTXAPP  style=\"HEIGHT: 1px; LEFT: 10px; TOP: 28px; WIDTH: 1px\" width=1 VIEWASTEXT>");
		document.writeln("</OBJECT>");
		XTXAPP.SOF_GetVersion(); 
		XTXAPP.EnableSoftDevice(true, "");
	}
} else {
	//alert("请使用IE8及以上版本的IE浏览器访问此模块");
	//document.writeln("<embed id=XTXAPP type=application/x-xtx-axhost clsid={3F367B74-92D9-4C5E-AB93-234F8A91D6} event_OnUsbkeyChange=OnUsbKeyChange width=1 height=1 />");
	//XTXAPP.SOF_GetVersion(); 
	//XTXAPP.EnableSoftDevice(true, "");
}
