var mongoose = require("mongoose");
var crypto = require("crypto");
//创建schema
var adminSchema = mongoose.Schema({
    "username" : String,
    "password" : String
});


//静态方法，通过用户名查询
adminSchema.statics.findNames=function(name,callback){
    Admin.findOne({"username":name},function(err,doc){
        callback(err,doc);
    })
}


adminSchema.statics.findName = function(name,pw,callback){
    Admin.findOne({"username" : name},function(err,results){
        console.log(results);
        if(err){
            callback("服务器错误！请检查输入的内容！");
            return;
        }
        if(results.length == 0){
            //-1表示你要更改的学生学号，我没有找到
            callback("没有找到这个学号");
        }else{
            thestudent= results;
            console.log(thestudent);
            //加密字符串，digest表示进一步处理为hex十六进制
            thestudent.password = crypto.createHmac("sha256",pw).digest("hex");
            console.log(thestudent.password);
            // crypto.createHmac('sha256',password).digest('hex');
            thestudent.save();
            callback(err,"成功修改！");
        }
    });
}

adminSchema.statics.addUser=function(uname,mima,callback){
    var jiami= crypto.createHmac('sha256',mima).digest('hex');
    Admin.create({"username":uname,"password":jiami},function(err,doc){
        callback(err,doc);
    })
}


//创建模型
var Admin = mongoose.model("Admin",adminSchema);

//整个模块向外暴露一个东西
module.exports = Admin;