var session=require("express-session");
var path=require("path");
var formidable=require("formidable")
var Admin=require("../models/Admin.js");
var  Type=require("../models/lei.js")
var  Typefh=require("../models/typefh.js")
var url=require("url");
var yuding=require("../models/yuding.js")
// 首页
exports.showUser=function(req,res){
    res.render("user");
}

// 预订
exports.yuding=function(req,res){
    res.render("yuding");
}
// 显示管理员页面


exports.showAdmin = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/sign>登录</a>");
        return;
    }
    var name=req.session.username
   res.render("admin",{
       "username":name
   });
}


 // 显示更改密码页面
exports.showmima=function(req,res){
    // var name= req.params.username;
    var name=req.session.username
    res.render("mima",{
        "username":name
    });
}

exports.dingdanruzhu=function(req,res){
    // var name= req.params.username;
    var name=req.session.username
    res.render("dingdanruzhu",{
        "username":name
    });
}

// 显示房间管理页面
exports.showRoomAmount=function(req,res){
    // var name= req.params.username;
    var name=req.session.username
    res.render("RoomAmount",{
        "username":name
    });
}

// 更改管理员密码
exports.updatemima=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var name=fields.username;
        var parseword=fields.parseword;

        Admin.findName(name,parseword,function(err,data){
            res.json({"result":data})
        })
    });
}


// 显示房间类页面  房类管理

exports.showRoom=function(req,res){
    var name=req.session.username
    res.render("Room",{
        "username":name
    })
}

// 添加 房间类别
exports.doAdd = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Type.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
// 获取 所有的 数据
exports.getAll=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize =5;
    Type.count({},function(err,count){
        Type.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}


// 获取所有的房间类型
exports.leibiefj=function (req, res) {
    Type.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}

// 添加一个房间
exports.doAddfh = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Typefh.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
// 无条件查找所有房间
exports.getalls=function(req,res){
    Typefh.find({},function(err,results){
        res.json({"results":results})
    })
}

// 查询所有房间
exports.getAllfh=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize =5;
    Typefh.count({},function(err,count){
        Typefh.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}

// 查询更改的房间信息

exports.showUpdate = function(req,res){
    var sid = req.params.sid;
    Type.find({"CategoryID" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}
// 信息更改

exports.updateType = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Type.update({"CategoryID":sid},{$set:{"CategoryName":fields.CategoryName,"Area":fields.Area,"Bed":fields.Bed,"Breakfast":fields.Breakfast,"Net":fields.Net,"TV":fields.TV,"Price":fields.Price,"RoomAmount":fields.RoomAmount,"LAmount":fields.LAmount}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

// 房类管理 删除
exports.delete=function(req,res){
    var sid= req.params.sid;
    Type.find({'CategoryID':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}

// 获取所有房间数据
exports.showUpdatefh = function(req,res){
    var sid = req.params.sid;
    Typefh.find({"RID" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}

// 更改房间信息

exports.updateTypefh = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Typefh.update({"RID":sid},{$set:{"RCategory":fields.RCategory,"RLocation":fields.RLocation,"RoomRemarks":fields.RoomRemarks,"RoomStatus":fields.RoomStatus}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

exports.fangshu = function(req,res){
    // var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        var CategoryName=fields.CategoryName;
        var RoomAmount=fields.RoomAmount;

        Type.update({"CategoryName":CategoryName},{$set:{"RoomAmount":RoomAmount}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}


exports.deletefh=function(req,res){
    var sid= req.params.sid;
    Typefh.find({'RID':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}


// 预订页面

exports.addYuding = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        yuding.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
// 查询页面
exports.showDchaxun=function (req, res) {
    res.render("chaxun");
}
// 预订查找
exports.yudingchaxun=function (req, res) {
    yuding.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}



// 更改数量

exports.showlei=function(req,res){
    Type.getAlls(function(err,datas){
        datas.forEach(function(item,index){
            console.log(item);
            Typefh.count({"RCategory":item.CategoryName},function(err,count){
                console.log(count);
                Typefh.count({"RCategory":item.CategoryName,"RoomStatus":"未入住"},function(err,count_a){
                    console.log(count_a);
                    item.LAmount=count_a;
                    item.RoomAmount=count;
                    item.save(function(err){

                    })
                })
            })
        })
    })
}

