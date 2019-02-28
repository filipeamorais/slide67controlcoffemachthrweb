const colors = require ('colors')
const mqtt = require ('mqtt')
const express = require('express')

const client = mqtt.connect('mqtt://127.0.0.1')
app = express()

var state = 'off'
console.log(state.yellow)

client.on('connect', ()=>{
    console.log('Coffee Maker connected to MQTT Broker'.green)
    client.subscribe('controller')
    client.publish('coffeemaker/connected', 'true',{'retain':true})
    client.publish('coffeemaker/state', state,{'retain':true})
})

client.on('message', (topic, message)=>{
    console.log(("received"+message).red)
    if (topic=='controller'){
        if(message=='turn on')
        turnOnRequest()
        else if(message=='turn off')
        turnOffRequest()
        else if(message=='status')
        client.publish('coffeemaker/state',state)
    }
})

function turnOnRequest(){
    if (state=='on'||state=='starting up') return
    else{
        state = 'starting up'
        console.log('(Starting Up)'.yellow)
        client.publish('coffeemaker/state', state)
        setTimeout(()=>{
            state='on'
            console.log('(ON)'.yellow)
            client.publish('coffeemaker/state', state)
        },3000)
    }
}

function turnOffRequest(){
    if (state=='off'||state=='shutting down') return
    else{
        state = 'shutting down'
        console.log('(Shutting Down)'.yellow)
        client.publish('coffeemaker/state', state)
        setTimeout(()=>{
            state='off'
            console.log('(OFF)'.yellow)
            client.publish('coffeemaker/state', state)
        },3000)
    }
}