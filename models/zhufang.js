var mongoose = require('mongoose');


var ruzhuSchema = new mongoose.Schema({
    sid:String,
    comeday  : String ,
    goday : String,
    name : String,
    rename:String,
    zhengjianhao:String,
    sex:String,
    fanghao:String,
    leixing : String,
    zhuangtai : String,
    xiaofei:String,
    zjleixing:String,
    riqi:String,
    jiage:String,
    yushuliang:String,
});

ruzhuSchema.statics.addStudent = function(json,callback){
    // ruzhu.checkSid(json.sid,function(torf){
    // if(torf){
    var s = new ruzhu(json);
    s.save(function(err){
        if(err){
            callback(-1);
            return;
        }
        callback(1);
    });
    // }else{
    //     callback(-1);
    // }
    // });
}


// ruzhuSchema.statics.checkSid = function(sid,callback){
//     this.find({"sid" : sid} , function(err,results){
//         callback(results.length == 0);
//     });
// }


var ruzhu = mongoose.model("ruzhu",ruzhuSchema);
module.exports = ruzhu;