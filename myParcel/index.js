const Moment = require('moment')
const { PiServer, say, getShipmentsCount} = require("./lib/common")

let date = Moment().format('YYYY-MM-DD')

exports.handler = async (event, context) => {
  try {
    await PiServer().then(async axios => {
      switch (event.request.type) {

        case "LaunchRequest": console.log('LaunchRequest')
          await getShipmentsCount(axios, date)
            .then(resp => 
              say(context, `Hello, welcome to MyParcel.com. You have ${resp.data} shipment${parseInt(resp.data) > 1 ? 's' : ''} on today's list`))
            .catch(err => 
              say(context, `I'm sorry, I could not connect to the server`))
          break;        
        
        case "IntentRequest": console.log('IntentRequest')

          switch (event.request.intent.name) {
            case "PrintIntent": console.log('PrintIntent')

            axios.get(`/labels/print/${date}`)

            await getShipmentsCount(axios, date)
            .then(resp => 
              say(context, `I have sent ${resp.data} label${parseInt(resp.data) > 1 ? 's' : ''} to the printer`))
            .catch(err => 
              say(context, `I'm sorry, I could not connect to the server`))
            break;
  
            case "PrintByDateIntent":
              date = event.request.intent.slots.timePeriod.value
  
              axios.get(`/labels/print/${date}`)
  
              await getShipmentsCount(axios, date)
              .then(resp => 
                say(context, `I have sent ${resp.data} label${parseInt(resp.data) > 1 ? 's' : ''} to the printer`))
              .catch(err => 
                say(context, `I'm sorry, I could not connect to the server`))
              break;

            case "OrderCountIntent": console.log('OrderCountIntent')
              date = event.request.intent.slots.timePeriod.value
  
              await getShipmentsCount(axios, date)
              .then(resp => 
                say(context, `You have ${resp.data} order${parseInt(resp.data) > 1 ? 's' : ''} for ${ date === Moment().format('YYYY-MM-DD') ? 'today' : 'that day'}`))
              .catch(err => 
                say(context, `I'm sorry, I could not connect to the server`))
              break;

            case "StopPrintIntent": console.log("StopPrintIntent")

                // Insert here the code for prionter to stop
                say(context, "I am stopping the printer")
                break;
  
            default:
              throw "Invalid intent"
          }
  
        default:
          context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)
       
      }
    }).catch(err => say(context, "There was a problem connecting to the response server"))
  } catch(error) { context.fail(`Exception: ${error}`) }
}