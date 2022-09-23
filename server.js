const express = require("express");
const path = require("path")
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server)
const fs = require("fs");

let recipeDictionary = {}

fs.readFile(__dirname + '\\' + "recipe.json", "utf8", function(err,data){
    //console.log(data);
    recipeDictionary = JSON.parse(data);
    let bracket = Object.keys(recipeDictionary)[0]
    //let name = Object.keys( recipeDictionary[bracket])[0]
    
    console.log(recipeDictionary[bracket]);
});

app.get("/", function(req,res) {
    res.sendFile(
        path.join(__dirname, '\\public\\', 'index.html')
        
    );
    
});

app.use('/public', express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
    console.log("connected");
    io.emit("recipe_json_to_client", recipeDictionary);
    socket.on("disconnect", () => {
        console.log('disconnected')
    })

    socket.on("new_recipe", rec => {
        //console.log(rec);
    
        let recipe = {
            id: rec.id,
            ingredienti: rec.ingredienti,
            img : rec.img
              }

        recipeDictionary[rec.naslov] = recipe
        fs.writeFile('./recipe.json', JSON.stringify(recipeDictionary, null, 2), err => {
            if(err) {
                console.log(err);
            }else{
                console.log("success");
                console.log(recipeDictionary);
            }
        })
        
    })

    socket.on("delete_recipe", rec_delete => {


        delete recipeDictionary[rec_delete];
        fs.writeFile('./recipe.json', JSON.stringify(recipeDictionary, null, 2), err => {
            if(err) {
                console.log(err);
            }else{
                console.log("success");
                console.log(recipeDictionary);
            }
        })
        console.log(recipeDictionary);
    }); 

  });



server.listen(3000, () => {
    console.log('started server')
    console.log(path.join(__dirname, 'index.html'));
});