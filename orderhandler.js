//const moltinClient = require('@moltin/request')
const MoltinGateway= require ('@moltin/sdk').gateway
const config = require('./credentials.js')

const postmark=require('postmark');
var postmarkClient=new postmark.ServerClient(config.postmark.apiKey);

const Moltin = MoltinGateway({
    client_id: config.ep.clientId,
    client_secret: config.ep.clientSecret
  })

let orders;
let incompleteOrders=[];

Moltin.Orders.Filter({eq: {status: 'incomplete'}})
.All().then(orders=> {
    orders.data.forEach(order=>{
        console.log("order id " +order.id);
        incompleteOrders.push(order.id);
    })
    //console.log(orders.data[0].id)
    postmarkClient.sendEmail({
        "From": config.postmark.fromEmailAddress,
        "To": "janani.ganesan@elasticpath.com",
        "Subject": "Incomplete order list",
        "HtmlBody": "<strong>Hello</strong> user, <br/> These orders are incomplete in your store! <br/> <br/>"+incompleteOrders,
        "TextBody": "These orders are incomplete in your store!"+orders.data[0].id,
        "MessageStream": "outbound"
    })
})
console.log(config.ep.clientId)

