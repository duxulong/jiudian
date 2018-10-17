var mongoose = require('mongoose');


var typefhSchema = new mongoose.Schema({
    RID:Number,
    RCategory : String,
    RLocation : String,
    RoomRemarks : String,
    RoomStatus : String
});


typefhSchema.statics.addStudent = function(json,callback){
    // Typefh.checkSid(json.sid,function(torf){
    //     if(torf){
    var s = new Typefh(json);
    s.save(function(err){
        if(err){
            callback(-2);
            return;
        }
        callback(1);
    });
    //     }else{
    //         callback(-1);
    //     }
    // });
}






var Typefh = mongoose.model("Typefh",typefhSchema);
module.exports = Typefh;