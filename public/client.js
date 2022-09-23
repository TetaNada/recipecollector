const socket = io();
var amountic = document.getElementById('amount').value;

let sastojci = []
let dictionary = {}




function pushData()
{
    let naslovinput = document.getElementById('sastojak').value;
    let amountinput = document.getElementById('amount').value;
    let unitsi = document.getElementById('unitsi').value;
   
    var inputText = 
    {
        amount: amountinput,
        imesastojka: naslovinput,
        unit: unitsi,
        rank: false 
    }
    sastojci.push(inputText);
    document.getElementById('confirmed').innerHTML = 'dodano ' + naslovinput;
    
    
} 

function pushMainIngredient() {
    let naslovinput = document.getElementById('sastojak').value;
    let amountinput = document.getElementById('amount').value;
    let unitsi = document.getElementById('unitsi').value;
   
    var inputText = 
    {
        amount: amountinput,
        imesastojka: naslovinput,
        unit: unitsi,
        rank: true
    }
    sastojci.push(inputText);
    document.getElementById('confirmed').innerHTML = 'dodano ' + naslovinput;
}

function spremirecept() 
{

    
    
    let imgurl = document.getElementById('imgurl').value;
    let titel = document.getElementById('naslov').value;

    let array = {

    id: Date.now(),
    naslov: titel,
    ingredienti: sastojci,
    img : imgurl
      }
    let id = array.id;
    console.log(array.id);
    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", id);
    socket.emit('new_recipe', array)
    array.length=0;
    sastojci.length=0;
    location.reload();
}

socket.on('recipe_json_to_client', (jsonRecived) => {
console.log("alo",Object.keys(jsonRecived).length);


    for (var i = 0; i < Object.keys(jsonRecived).length; i++) {
        dictionary = jsonRecived;
        let key = Object.keys(jsonRecived)[i];
        let novikurac = jsonRecived[key];

        let newElement = document.createElement('div');
        newElement.setAttribute("id",novikurac.id);
        newElement.setAttribute("class",'objekt');
        document.getElementById('pokazi').appendChild(newElement);
            
        document.getElementById(novikurac.id).innerHTML = '<button class='+novikurac.id +' onclick="obrisirecept()">DELETE</button>'+ '<h1>' + key  + '</h1>'+ '<br>' + '<img src="'+novikurac.img+'">' + '<h2> ingredienti </h2>' ;
           
            
            
        console.log(novikurac.id);

        console.log(novikurac);
            
        for (j=0; j<novikurac.ingredienti.length; j++){
            let idingri= novikurac.id;
            console.log(novikurac.ingredienti[j]);
            let newingri = document.createElement('div');
            newingri.setAttribute("id",idingri + novikurac.ingredienti[j].imesastojka);
            newingri.setAttribute("class",'sastojak');
            document.getElementById(idingri).appendChild(newingri);
            document.getElementById(idingri + novikurac.ingredienti[j].imesastojka).innerHTML = novikurac.ingredienti[j].amount+ ' '+ novikurac.ingredienti[j].unit+ ' ' + novikurac.ingredienti[j].imesastojka;;
                
                
        }
        
    } 
});

function obrisirecept(){
    console.log("ude u obrisi recept");
    var cl = event.target.className;
            
    document.getElementById(cl).remove();
            
    for (var i = 0; i < Object.keys(dictionary).length; i++) {
                    
        let key = Object.keys(dictionary)[i];
                    
        let novikurac2=dictionary[key];
        let novikurac3= novikurac2.id;
        let novikurac4= key;
        console.log(novikurac3);            
        if(novikurac3==cl){
            socket.emit("delete_recipe", novikurac4)
        }
            
    }
} 

const search = document.getElementById("sastojak");
const searchIngredients = async searchText =>  {
    const res = await fetch('public/ingredients.json');
    const rezultatidict = await res.json();
    const rezultatidictimena= Object.keys(rezultatidict);
            
    let matchevi = rezultatidictimena.filter(ingri => {
        const regex= new RegExp(`^${searchText}`,'gi');
        return ingri.match(regex); 
        
    })
        
    let placeholder = document.getElementById("autocomplete");
    let out="";
    for(let product of matchevi){ 
        document.getElementById("autocomplete").style.visibility = 'visible';
        out+= 
        `   
        <br>
        <div onclick="unesiuinput()" id="${product}" class="SearchedIng">
        ${product}
        </div>
        `;
    }
    if (searchText==''){
        product=[];
        out='';
    }
    placeholder.innerHTML=out;
        
    };
search.addEventListener('input', ()=> searchIngredients(search.value));
        
function unesiuinput(){
    
    var dajclass = event.target.id;
    document.getElementById('autocomplete').style.visibility = 'hidden'
    document.getElementById(dajclass).style.backgroundColor = 'blue';
    setTimeout(() => {  document.getElementById(dajclass).style.backgroundColor = 'white'; }, 100);
    document.getElementById(dajclass).style.color = 'white';
    setTimeout(() => {  document.getElementById(dajclass).style.color = 'black'; }, 100);
    search.value = dajclass;
}        

      



 
