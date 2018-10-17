var mongoose = require('mongoose');


var yudingSchema = new mongoose.Schema({
    comeday  : String ,
    goday : String,
    leixing : String,
    shuliang : String,
    name : String,
    rename:String,
    phone:String,
    liuyan:String
});

yudingSchema.statics.addStudent = function(json,callback){
    // yuding.checkSid(json.sid,function(torf){
    // if(torf){
    var s = new yuding(json);
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


// yudingSchema.statics.checkSid = function(sid,callback){
//     this.find({"sid" : sid} , function(err,results){
//         callback(results.length == 0);
//     });
// }


var yuding = mongoose.model("yuding",yudingSchema);
module.exports = yuding;