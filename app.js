const expVar = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const favicon = require('serve-favicon')
// let ejs = require('ejs');
var path = require('path')
const app = expVar();
require('dotenv').config()

app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({extended:true}));
app.use(expVar.static("public"));

// Mongo DB Connection---------------------
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });
//-----------------------------------------

// Mongo DB Collection Schema--------------

const itemsSchema = new mongoose.Schema({
    name:{
        required:[true,"Name Is Required"],
        type:String
    }
});

const DefaultItemList = new mongoose.model("ListItem",itemsSchema);

const singleItem = new DefaultItemList({
    name:"Item 1"
})

const DefaultItems = [singleItem];

const dynamicItemSchema = new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});

const DynamicItem = new mongoose.model("List",dynamicItemSchema);

//-----------------------------------------

let items = [];

app.get("/:customListName", function(req,res){
    const customListName = req.params.customListName;

    const dynamicItem = new DynamicItem({
        name:customListName,
        items:DefaultItems
    })

    dynamicItem.save();

});

function insertIntoDb(item){
    DefaultItemList.insertMany([item],function(err,results){

        if(err){
            console.log(err)
        }else{
            console.log("Inserted Successfully !")
            // console.log(results);
        }
    
        
    });
}

function findItem(res){
    DefaultItemList.find({},function(err,results){

        if(err){
            console.log(err)
        }else{
            // console.log("All Items Fetched !")
            
            results.forEach(element => {
                // console.log(element);
                items.push(element);
            });
            
            const day = date.getDate();
            const year = date.getYear();
            
            res.render("list",{
                listTitle:day,
                listEjsVar:items,
                currYear:year
            });
        }
    });
}

app.post("/delete",function(req,res){

    const checkbox = req.body.checkbox;
    const val = checkbox;
    // console.log(checkbox)

    DefaultItemList.deleteOne({_id:val},function(err,results){
        if(err){
            console.log(err)
        }else{
            if(results){
                res.redirect("/")
            }
        }
    });
})

app.get("/",function(req,res){
    DefaultItemList.find({},function(err,results){

        if(results.length === 0){
            res.render("list",{
                listTitle:"Please Insert Items To Start !",
                listEjsVar:"",
                currYear:""
            });
        }else{
            items = [];
            findItem(res);
        }
    });
});

app.post("/",function(req,res){
    // var item = req.body.newItem;
    
    const item = new DefaultItemList({
        name:req.body.newItem
    });

    insertIntoDb(item);
    res.redirect("/");
    
})

app.use((req,res,next) => {
    console.log(req.path,req.method)
    next()
})

app.listen(process.env.PORT,function(){
    console.log("Server started on " + process.env.PORT + " port !");
})