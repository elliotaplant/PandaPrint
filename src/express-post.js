'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;

const environment = process.env.PWINTY_ENV;

const pwinty = require('pwinty')(
  process.env.PWINTY_MERCHANT_ID,
  process.env.PWINTY_API_KEY,
  `https://${environment || 'sandbox'}.pwinty.com/v2.5/`
);

// Stores current order state
let currentOrder = null;

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({extended: false}))

// Route that receives a POST request to /
app.post('/', function(req, res) {
  res.set('Content-Type', 'text/plain');
  if (reqIncludesSend(req)) {
    if (!currentOrder) {
      res.send(`It looks like we don't have any photos on file for you yet. Want to send some?`);
    } else {
      getPwintyOrderStatus(currentOrder.id)
        .then(() => updatePwintyOrderStatus(currentOrder.id))
        .then(() => {
          res.send(`Sending! We'll ship your photos to ${mailingAddress().address1}`);
        })
        .catch(error => {
          console.error(error);
          res.send(
            `Sorry, there was an issue submitting your order. I'll fix it if you shoot me an email at elliotaplant@gmail.com`
          );
        });
    }
  } else if (req.body.MediaUrl0) {
    createPwintyOrderIfNecessary()
      .then(() => addPhotoToPwintyOrder(req.body.MediaUrl0))
      .then(() => {
        res.send(
          `Got it! We added the photo to your order. Just say 'Send' and we'll send all the photos in the order to you.`
        );
      })
      .catch(error => {
        res.send(
          `I'm sorry, but something went wrong. Could you tell me more about the issue at  elliotaplant@mgail.com?`
        );
      });
  } else {
    res.send(`Hmm we couldn't find the picture in that message. Sorry!`);
  }
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<head></head>
    <body>
      <h1>Hi Elliot! Found you at ${new Date().toString()}</h1>
      <h3>Current Order:</h3>
      <pre>${JSON.stringify(currentOrder, null, 2)}</pre>
    </body>`
  )
});

app.use(express.static('/'));

// Tell our app to listen on port determined by environment
app.listen(port, function(err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3000')
});

function createPwintyOrderIfNecessary() {
  return new Promise((resolve, reject) => {
    if (currentOrder) {
      resolve(currentOrder);
    } else {
      pwinty.createOrder(mailingAddress(), function(err, order) {
        if (err) {
          reject(err);
        } else {
          currentOrder = order;
          resolve(currentOrder);
        }
      });
    }
  });
}

function addPhotoToPwintyOrder(photoUrl) {
  if (!currentOrder) {
    throw new Error('No order exists to add photo');
  }
  const photo = Object.assign({type: "4x6", url: photoUrl, copies: "1", sizing: "Crop"});

  return new Promise((resolve, reject) => {
    pwinty.addPhotoToOrder(currentOrder.id, photo, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(photo)
      }
    });
  });
}

function getPwintyOrderStatus(orderId) {
  return new Promise((resolve, reject) => {
    pwinty.getOrderStatus(orderId, (err, status) => {
      if (err || !status.isValid) {
        reject(err);
      } else {
        resolve(orderId);
      }
    })
  });
}

function updatePwintyOrderStatus(orderId) {
  return new Promise((resolve, reject) => {
    pwinty.updateOrderStatus({
      id: orderId,
      status: 'Submitted',
    }, (err, status) => {
      if (err) {
        reject(err);
      } else {
        currentOrder = null;
        resolve(status);
      }
    })
  });
}

function mailingAddress() {
  return {
    countryCode: 'US',
    qualityLevel: 'Standard',
    attributes: {
      finish: 'glossy',
    },
    recipientName: 'Amber Fearon',
    address1: '3705 Florida Ct. Unit E',
    addressTownOrCity: 'North Chicago',
    stateOrCounty: 'IL',
    postalOrZipCode: '60088'
  }
}

function reqIncludesSend(req) {
  try {
    return req
      .body
      .Body
      .toLowerCase()
      .includes('send');
  } catch (e) {
    return false;
  }
}
