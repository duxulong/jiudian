//引用模块
var express = require("express");
var session = require('express-session')
var mongoose = require("mongoose");
var crypto=require("crypto");

// 路由
var common_router=require("./router/comm-router.js");
var admin_router=require("./router/admin_router.js");
// 创建app
var app = express();

mongoose.connect('mongodb://localhost:27017/jiudian');


app.set("view engine","ejs");

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'jiudian', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));


app.use(express.static("public"));
app.get("/",   admin_router.showUser)   // 首页
app.get("/yuding",   admin_router.yuding)   // 首页
app.post('/yuding', admin_router.addYuding);//客户预定
app.get("/chaxun",admin_router.showDchaxun);//展示前端订单查询页面
app.get("/yudingchaxun",admin_router.yudingchaxun);//查找前端订单
app.delete('/yudingtuifang/:sid', common_router.yudingdelete);  //删除订单

app.get("/dingdianruzhu" , admin_router.dingdanruzhu)    // 订单入住
app.post    ('/typedx/:sid'	, common_router.updateTypedx);//更改
app.get     ('/typedx/:sid'	, common_router.showUpdatedx);  //查询

app.get ("/sign"                                ,common_router.showIndex);
app.get ("/zu"                              ,common_router.update);          //注册页
app.post('/add'			                    ,common_router.tijiao);          //注册一个
         //首页
app.post("/checklogin"                      ,common_router.checklogin);         //Ajax接口，检查登录是否成功，能够返回{result:-2}
         //管理员管理面板
app.get ("/admin"                           ,admin_router.showAdmin);    // 显示主页
app.get("/updatemima" ,  admin_router.showmima);            //显示更改页面
app.post("/updatemima" ,  admin_router.updatemima);     //监听



// 房类
app.get("/Room"   ,    admin_router.showRoom);       // 房类管理
app.post('/doadd',     admin_router.doAdd);   // 增加房间类型
app.get('/doadd',      admin_router.getAll);  //查找所有的数据
app.get     ('/rtype/:sid'	, admin_router.showUpdate);   //获取更改的一行内容
app.post    ('/rtype/:sid'	, admin_router.updateType);//更改信息
app.delete('/doadd/:sid',     admin_router.delete);       //删除
app.post("/fangshu",       admin_router.fangshu )

// 房间
app.get("/RoomAmount" , admin_router.showRoomAmount)  //显示房间管理页面
app.get('/leibief', admin_router.leibiefj);  //获取房间类型
app.post('/doaddfh', admin_router.doAddfh);    //添加房间
app.get("/doaddfh",   admin_router.getAllfh)   //查询所有房间
// app.get("/getalls",   admin_router.getalls)   // 无条件 查询所有房间

app.get("/getalls",   admin_router.showlei)   // 无条件 查询所有房间
app.get     ('/fhtype/:sid'	, admin_router.showUpdatefh);  // 获取所有房间信息
app.post    ('/fhtype/:sid'	, admin_router.updateTypefh);//更改房间
app.delete('/doaddfh/:sid', admin_router.deletefh);//删除 房间

// 大堂入住
app.get("/datang"  ,common_router.showdatang)   // 显示大堂页面

// app.get('/leibief', common_router.leibiefj);//获取房间类别


app.get('/fanghao', common_router.fanghao);//得到房间号
app.get("/jiagef",   common_router.jiagef);   //获取类别相应价格
app.post('/ruzhu', common_router.addRuzhu);//提交订单办理入住
app.post ('/fanghaotype/:sid',common_router.updateFangHao);//修改房间状态  已入住



app.get("/showRecord",   common_router.showRecord);//显示查询信息页面
app.get("/record",   common_router.recorddata);//查询信息


app.get("/checkroom",   common_router.showCheck);//显示查询信息页面
app.get("/tuifangcx",   common_router.recorddata);//退房查询
app.delete('/tuifang/:sid', common_router.showTFdelete);//删除订单

app.get("/fang",   common_router.showfang);//显示房间状态


app.listen(3001);