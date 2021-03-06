var selectSetExamData;
var getClassID="ALL";


//设置教师名单
table.render({
    elem:"#setTeacherTable",
	cols:[[
		{type: 'checkbox', fixed: 'left'},
		{field:"teacherId",title:"教师账号",width:"20%",sort:true},
		{field:"teacherName",title:"教师姓名",width:"50%",sort:true},
		{fixed: 'right', title: '重置密码', toolbar: '#teacherListToolBar', width:"25%" ,unresize:true}
	]],
	url:"/api/getTeacherList",
	method:"POST",
	contentType:'application/json',
	parseData: function(res){ //res 即为原始返回的数据
		//console.log(res);
		res =(res);
		var data = {
			"code": 0, //解析接口状态
			"msg": res.message, //解析提示文本
			"count": res.total, //解析数据长度
		};
		data.data=res;
		//console.log(data);
		return data; 
	},
	toolbar:  '#teacherListBar' , //开启头部工具栏，并为其绑定左侧模板
    defaultToolbar: ['filter', 'exports', 'print'],
	title:"教师名单",
	height: 'full-240',
});

//监听教师名单的表头的按钮
table.on('toolbar(teacherTable)', function(obj){
	var checkStatus = table.checkStatus(obj.config.id);
	var data =checkStatus.data;
	var ndata=new Array();
	for(i=0;i<data.length;i++){
		ndata.push(data[i].teacherId);
	}
	console.log(ndata);
	var layEvent = obj.event;
	if(layEvent=="teacherSub"){
		layer.confirm('确认删除教师?', {icon: 3, title:'提示'}, function(index){
			var len = data.length;
			sendData("/api/deleteTeacher", ndata);
			layer.close(index);
		});
	}else if(layEvent=="teacherAdd"){
		displayUploadWindow();
	}
});

//监听教师名单的每行的按钮
table.on("tool(teacherTable)",function(obj){
	var data =[obj.data];
	var ndata= new Array();
	for( i=0;i<data.length;i++ ){
		ndata.push(data[i].teacherId);
	}
	console.log(ndata);
	var layEvent = obj.event;
	if(layEvent=="teacherReset"){
		layer.confirm('确认重置为初始密码?', {icon: 3, title:'提示'}, function(index){
			sendData("/api/resetPassword",ndata);			//
			layer.close(index);
		});
	}
})

//提交
function sendData(url,data){
	data = JSON.stringify(data);
	console.log(url);
	$.ajax({
		type:"POST",
		url:url,
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		data:data,
		async:false,
		success:function(Jresp){
			var resp = (Jresp);
			//console.log(resp);
			if(resp.status==0){
				layer.msg("设置失败",{
					shade:0.3,
					time:500
				});
			}else{
				layer.msg("设置成功",{
					shade:0.3,
					time:500
				});
				setTimeout(function(){
					location.reload();
				},500);
			}
		},
		error:function(){
			layer.msg("服务器出错",{
				shade:0.3,
				time:500
			});
		}
	})
}

//教师名单上传窗口
function displayUploadWindow(){
	var thisWindow = $("#uploadWindow");
	layer.open({
		type:1,
		title:"上传教师名单文件",
		content:thisWindow,
		area:["400px","320px"],
		resize:false,
		success:function(){
			thisWindow.removeClass("layui-hide");
		},
		cancel: function(){ 
			thisWindow.addClass("layui-hide");
		}    
	})
}

//上传教师名单文件
upload.render({
	elem: '#uploadSpace',
	url: "/api/doImportTeacherExcel", //改成您自己的上传接口
	auto: false,
	accept:"file",
	acceptMime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
	exts:"xls|xlsx",
	field:"file",
	size:10000,
	bindAction:"#startUpload",
	choose:function(obj){
		obj.preview(function(index,file,result){
			$("#uploadSpace i").removeClass("layui-icon-upload-drag");
			$("#uploadSpace i").addClass("layui-icon-file");
			$("#uploadFileName").removeClass("layui-hide");
			$("#uploadFileName p").text(file.name);
		})
	},
	before: function(obj){
		//console.log(obj);
		layer.load(1);
	},
	done: function(res, index, upload){
		layer.closeAll('loading');
		//console.log(res);
		if(res.status==0){
			layer.msg("上传失败",{
				shade:0.3,
				time:500
			});
		}else if(res.status==1){
			layer.msg("上传成功",{
				shade:0.3,
				time:500
			});
		}
		setTimeout(function(){
			location.reload();
		},500);
	},
	error:function(index,upload){
		layer.closeAll('loading');
		layer.msg("服务器出错",{
			shade:0.3,
			time:500
		});
	},
});

//设置学生名单
table.render({
    elem:"#studentTable",
	cols:[[
		// {type: 'checkbox', fixed: 'left'},
		{field:"studentNo",title:"学生账号",width:"20%",sort:true},
		{field:"studentName",title:"学生姓名",width:"50%",sort:true},
		{fixed: 'right', title: '重置密码', toolbar: '#studentResetToolBar', width:"25%" ,unresize:true}
	]],
	url:"/api/getStudentInfo",
	method:"POST",
	contentType:'application/json',
	where:{
		classId:"ALL"
	},
	parseData: function(res){ //res 即为原始返回的数据
		//console.log(res);
		res =(res);
		var data = {
			"code": 0, //解析接口状态
			"msg": res.message, //解析提示文本
			"count": res.total, //解析数据长度
		};
		data.data=res;
		return data; 
	},
	toolbar:  '#studentListBar' , //开启头部工具栏，并为其绑定左侧模板
    defaultToolbar: ['filter', 'exports', 'print'],
	title:"班级考表",
	height: 'full-240',
});

//监听学生名单的每行的按钮
table.on("tool(studentTable)",function(obj){
	var data =[obj.data];
	var ndata = new Array();
	for(i=0;i<data.length;i++){
		ndata.push(""+data[i].studentNo);
	}
	console.log(ndata);
	var layEvent = obj.event;
	if(layEvent=="studentReset"){
		layer.confirm('确认重置为初始密码?', {icon: 3, title:'提示'}, function(index){
			

			sendData("/api/resetPassword",ndata);			//
			layer.close(index);
		});
	}
})

//题库上传窗口
function displayQuestionUploadWindow(){
	var thisWindow = $("#uploadQuestionWindow");
	layer.open({
		type:1,
		title:"上传题库文件",
		content:thisWindow,
		area:["400px","320px"],
		resize:false,
		success:function(){
			thisWindow.removeClass("layui-hide");
		},
		cancel: function(){ 
			thisWindow.addClass("layui-hide");
		}    
	})
}

//上传题库文件文件
upload.render({
	elem: '#uploadQuestionSpace',
	url: "/api/doImportQuestionExcel", //改成您自己的上传接口
	auto: false,
	accept:"file",
	acceptMime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
	exts:"xls|xlsx",
	field:"file",
	size:10000,
	bindAction:"#startQuestionUpload",
	choose:function(obj){
		obj.preview(function(index,file,result){
			$("#uploadQuestionSpace i").removeClass("layui-icon-upload-drag");
			$("#uploadQuestionSpace i").addClass("layui-icon-file");
			$("#uploadQuestionFileName").removeClass("layui-hide");
			$("#uploadQuestionFileName p").text(file.name);
		})
	},
	before: function(obj){
		//console.log(obj);
		layer.load(1);
	},
	done: function(res, index, upload){
		layer.closeAll('loading');
		//console.log(res);
		if(res.status==0){
			layer.msg("上传失败",{
				shade:0.3,
				time:500
			});
		}else if(res.status==1){
			layer.msg("上传成功",{
				shade:0.3,
				time:500
			});
		}
		setTimeout(function(){
			location.reload();
		},500);
	},
	error:function(index,upload){
		layer.closeAll('loading');
		layer.msg("服务器出错",{
			shade:0.3,
			time:500
		});
	},
});

//显示选择正式考试时间的窗口
function displaySelectExamWindow(){
	var thisWindow = $("#selectExamWindow");
	layer.open({
		type:1,
		title:"设置考试时间",
		content:thisWindow,
		area:["500px","200px"],
		success:function(){
			thisWindow.removeClass("layui-hide");
		},
		cancel: function(){ 
			thisWindow.addClass("layui-hide");
		}    
	})
}

//监听设置正式考试提交
form.on('submit(submitSetExam)', function(data){
	var examTime = data.field.examTime;
	var ndata={
		examTime:examTime
	};
	sendData("/api/setOfficialExam",ndata);
	return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});

form.on('submit(stopExam)', function(data){
	var ndata=1;
	sendData("/api/closeOfficialExam",ndata);
	return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});


form.on('submit(cleanAll)', function(data){
	layer.confirm('确认清空数据库?', {icon: 3, title:'提示'}, function(index){
		var ndata=1;
		sendData("/api/cleanAll",ndata);
		layer.close(index);
	});
	return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});



