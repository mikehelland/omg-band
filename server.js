module.exports = (app, path) => {

    var db = app.get("db")

    var find = {}
    find.status = "CONFIRMED"
    find.promote = true

    find = {}
    find["body ->> 'type'"] = "GIG";
    find["body ->> 'status'"] = "CONFIRMED";
    find["body ->> 'promote'"] = true;
    find["body ->> 'draft'"]  = null
    find["deleted"] = "false"
    
    var options = {order : "body ->> 'when'"};
    
    app.get("/" + path + "promoted", function (req, res) {

        db.things.find(find, {}, (err,results) => {
            res.send(err || results)
        })
        
        //db.things.findDoc(find, options, (err,results) => {
        //    res.send(err || results)
        //})
        
    });
}