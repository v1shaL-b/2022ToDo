const expVar = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

// let ejs = require('ejs');

const app = expVar();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(expVar.static("public"));

const items = ["Go Out","Buy Food","Cook Food","Eat Food"];
const workItems = [];

app.get("/",function(req,res){

    const day = date.getDate();
    //let day = date.getDay;
    res.render("list",{
        listTitle:day,
        listEjsVar:items
    });

    //Error : [ERR_INVALID_ARG_TYPE] 
    // res.render()
});

app.post("/",function(req,res){
    var item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work",function(req,res){

    res.render("list",
        {
            listTitle : "Work List",
            listEjsVar : workItems
        }
    )
});

app.get("/about",function(req,res){

    res.render("about")
});

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});



app.listen(3000,function(){
    console.log("Server started on 3000 port !");
})