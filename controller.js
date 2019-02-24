const colors = require ('colors')
const mqtt = require ('mqtt')
const express = require ('express')

const client = mqtt.connect('mqtt://127.0.0.1')
app = express()

var state = '' //state of the coffeemaker is unknwon
var connected = false //coffeemaker is assumed not to be connected

app.get('/coffeeMaker/on', (req,res)=>{
    if (!connected){
        res.end('Coffee Maker not connected')
        return}

    //client.publish('controller', 'status')
    if(state='on'){
        res.end('Coffee maker is already on')
        return}

    res.write('Turning on Coffeemaker')
    client.publish('controller', 'turn on')
    res.end('Coffee Maker on')
})

app.get('/coffeeMaker/off', (req, res)=>{
    if(!connected){
        res.end('Coffee Maker not connected')
        return}

    if(state='off'){
        res.end('Coffee maker is already off')
        return}

    res.write('Turning off Coffeemaker')
    client.publish('controller', 'turn off')
    res.end('Coffee Maker off')
})

app.listen(3000, function(){
    console.log("App listening on port 3000")
})

client.on('connect', ()=>{
    console.log('Controller connected'.green)
    client.subscribe('coffeemaker/connected')
    client.subscribe('coffeemaker/state')
})

client.on('message', ()=>{
    if(topic=='coffeemaker/connected'){
        if (message=='true')connected=true
        else connected=false
        console.log('Coffee Maker connected:'+connected)
    }

    else if(topic=='coffeemaker/state'){
        state=message
        console.log('Coffee Maker'+state)
    }else
    console.log('No message handler for'+topic)
})
