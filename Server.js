const express = require('express'); //includes express

const app = express(); //creates server

const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Inventory', (err,database) => 
{
    if(err) return console/log(err);
    db=database.db('Inventory')
    console.log(db.collection("Televisions").find());
    app.listen(3000, ()=> 
    {
        console.log("listening at port number 3000")
    })
} )

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get("/",(req,res)=>{
    db.collection('Televisions').find().toArray((err,result)=>{
        if(err) return console.log(err)
        console.log(result);
        res.render('homepage.ejs',{data:result})
    })
})

app.get("/stockupdate", (req,res)=>{
    res.render('update.ejs')
})

app.get('/adddata',(req,res)=>{
    res.render('add.ejs')
})

app.get('/deletestock',(req,res)=>{
    res.render('delete.ejs')
})

app.post("/update" , (req,res)=>{
    db.collection('Televisions').find().toArray((err,result)=>{
        
        if(err) return console.log(err)
        console.log(typeof(result))
        var s="";
        for(var i=0;i<result.length;i++)
        {
            console.log(typeof(result[i].pid)+' '+typeof(req.body.pid))
            if((result[i].pid).localeCompare(req.body.pid)==0)
            {
                console.log(result[i].stock);
                s=result[i].stock;
                break;
            }
        }
        db.collection('Televisions').findOneAndUpdate({pid : req.body.pid},
            {$set :{stock :req.body.stock}},(err,result)=>{
                console.log(s+'  '+req.body.stock)

                if(err) return console.log(err)
                console.log(req.body.pid+' stock updated')
                res.redirect('/')
        })
    })
})

app.post('/AddData',(req,res)=>{
    db.collection('Televisions').save(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/')
    })
})

app.post('/Deleteproduct',(req,res)=>
{
    console.log(req.body.pid)
    db.collection('Televisions').deleteOne({pid:req.body.pid},(err,result)=>{
        if(err) return console.log(err);
        console.log("item with product id "+req.body.pid+" is deleted")
        res.redirect('/')
    })
})