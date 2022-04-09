module.exports = (app, path) => {

    var db = app.get("db")

    var find = {}
    //find["body ->> 'status'"] = "CONFIRMED";
    //find["body ->> 'promote'"] = true;
    find.status = "CONFIRMED"
    find.promote = true

    var options = {order : "body ->> 'when'"};
    
    app.get("/" + path + "promoted", function (req, res) {

        db.things.findDoc(find, options, (err,results) => {
            res.send(err || results)
        })
        
    });
}