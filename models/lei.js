var mongoose = require('mongoose');


var typeSchema = new mongoose.Schema({
    CategoryID:Number,
    CategoryName : String,
    Area : String,
    Bed : String,
    Breakfast : String,
    Net : String,
    TV : String,
    Price : String,
    RoomAmount : String,
    LAmount : String
});


// 添加 成功
typeSchema.statics.addStudent = function(json,callback){
    Type.checkSid(json.CategoryID,function(torf){
        if(torf){
            var s = new Type(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            });
        }else{
            callback(-1);
        }
    });
}


typeSchema.statics.checkSid = function(sid,callback){
    this.find({"CategoryID" : sid} , function(err,results){
        callback(results.length == 0);
    });
}

typeSchema.statics.showNumber = function(callback){
    this.find({} , function(err,results){
        callback(err,results);
    });
}

typeSchema.statics.getAlls = function(callback){
    this.find({},function(err,results){
        callback(err,results)
    });
}





var Type = mongoose.model("Type",typeSchema);
module.exports = Type;
