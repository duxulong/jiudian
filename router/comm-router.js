var  path = require("path");
var formidable = require("formidable");
var Admin=require("../models/Admin.js");
var crypto=require("crypto");
var  Type=require("../models/lei.js")
var  Typefh=require("../models/typefh.js")

var ruzhu=require('../models/zhufang.js');
var yuding=require("../models/yuding.js")

// 显示首页
exports.showIndex=function(req,res){
    if(req.session.login&&req.session.type=="student"){
        res.render("guke",{

        })
    }else{
        res.render("index");
    }
}

// 注册页面
exports.update=function(req,res){
    res.render("zu")
};

exports.showdatang=function(req,res){
    var name=req.session.username
    res.render("datang",{
        "username":name
    })
}
// 显示查询信息页面
exports.showRecord=function(req,res){
    var name=req.session.username
    res.render("record",{
        "username":name
    })
}
// 显示查询信息页面
exports.showCheck=function(req,res){
    var name=req.session.username
    res.render("check",{
        "username":name
    })
}

// 显示房间状态的
exports.showfang=function(req,res){
    var name=req.session.username
    res.render("fang",{
        "username":name
    })
}

exports.tijiao=function(req,res){
    // console.log("成功");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var username=fields.username;
        var password=fields.password;
        Admin.findNames(username,function(err,doc){
            if(doc){
                res.json({"result":doc});
                return;
            }
            console.log(doc);
            Admin.addUser(username,password,function(err,doc){
                console.log(doc);
                if(err){
                    res.json({"result":-2});
                    return;
                }
                req.session.login=1;
                req.session.username=fields.username;
                res.json({"result":1});
            });
        });
    });
};

// 验证登录
exports.checklogin = function(req,res){
    var form = new formidable.IncomingForm();
    // 表单
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var username = fields.username;
        var password = fields.password;

        if(err){
            //-1表示数据库错误
            res.json({"result":-1});
            return;
        }

        if(!username || !password){
            console.log(-4);
            //-4表示没有填写
            res.json({"result":-4});
            return;
        }
        //根据用户输入的用户名是数字还是字母来判断是学生还是管理员
        if(Number.isInteger(Number(username))){
            //是一个数字，我们倾向于他是一个学生
            console.log("学生",username,password);
            Student.findNames(username,function(err,results){
                if(err){
                    res.json({"result" : -1});
                    return;
                }
                //用户名不存在
                if(results.length == 0){
                    res.json({"result" : -2});
                    return;
                }
                //判断密码是否正确，将用户输入的密码加密只有和results[0].password进行比较即可
                var sha256 = crypto.createHash("sha256");
                password = sha256.update(password).digest("hex").toString();
                // crypto.createHmac('sha256', mima).digest('hex');
                if(password == results[0].password){
                    //1就是登陆成功
                    //登录成功，下发session
                    req.session.xuehao = username;
                    req.session.xingming = results[0].name;
                    req.session.type = "student";
                    req.session.login = true;
                    req.session.grade = results[0].grade;

                    res.json({"result":1 , "type" : "student"});
                }else{
                    //-3就是密码错误！
                    res.json({"result":-3});
                }
            });
        }else{
            //用户名不是一个数字，此时我们倾向于他是管理员
            //首先检查这个人是不是存在
            Admin.findNames(username,function(err,results){
                if(err){
                    //-1表示数据库错误
                    res.json({"result":-1});
                    return;
                }
                if(results.length == 0){
                    //用户名不存在！
                    res.json({"result":-2});
                    return;
                }
                //直接检查密码是否输入正确！！
                var theadmin = results;
                //加密密码
                // var sha256 = crypto.createHash("sha256");
                // password = sha256.update(password).digest("hex").toString();
                password=crypto.createHmac('sha256',password).digest('hex');
                // crypto.createHmac('sha256',mima).digest('hex');
                if(theadmin.password == password){
                    //登录成功，下发session
                    req.session.username = username;
                    req.session.type = "admin";
                    req.session.login = true;
                    res.json({"username":req.session.username,"result":1 , "type" : "admin"});
                    // res.render("admin",{
                    //     "username":req.session.username
                    // })
                }else{
                    res.json({"result":-3});
                }
            });
        }
    });
}


// 大堂入住 获取所有 房间 类别

exports.leibiefj=function (req, res) {
    Type.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
// 获取 不同类型的房子
exports.jiagef=function (req, res) {
    Type.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
// 查找房号
exports.fanghao=function (req, res) {
    Typefh.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
// 客户入住
exports.addRuzhu = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        ruzhu.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
// 更改房间状态
exports.updateFangHao = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(fields.zhuangtai);
        Typefh.update({"RID":sid},{$set:{"RoomStatus":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

// 查询入住信息
exports.recorddata=function (req, res) {
    ruzhu.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
// 当退房的时候  入住信息 删除房间
exports.showTFdelete=function(req,res){
    var sid= req.params.sid;
    // ruzhu.find({'sid':sid},function (err, results) {
    //     console.log(results);
    //     if (err||results.length==0){
    //         res.json({"result":-2});
    //         return;
    //     }
    //     results[0].remove(function (err) {
    //         if (err){
    //             res.json({'result':-1});
    //             return;
    //         }
    //         res.json({'result':1})
    //     })
    // })
    yuding.find({'name':sid},function (err, results) {
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

exports.yudingdelete=function(req,res){
    var sid= req.params.sid;
    yuding.find({'name':sid},function (err, results) {
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

// 更改所选项
exports.updateTypedx = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        yuding.update({"name":sid},{$set:{"comeday":fields.comeday,"goday":fields.goday,"leixing":fields.leixing,"shuliang":fields.shuliang,"name":fields.name,"rename":fields.rename,"phone":fields.phone,"liuyan":fields.liuyan}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

// 查找 所选项
exports.showUpdatedx = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    yuding.find({"name" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}




