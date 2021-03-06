'use strict'

const datetime = require('datetime')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 4000;

const mapStorage = new Map();

// helper functions
const saveKeyValue = function(key, value, ttl){
	mapStorage.set(key, {value, ttl: ttl + (Date.now())/1000});
};

const getValue = function(key){
	return mapStorage.get(key);
};

const deleteValue = function(key){
	mapStorage.delete(key);
};

// set endpoint
app.post('/set', (req, res) => {
  let { key, value, ttl } = req.body
  key = key.toString();
  value = value.toString();
  ttl = parseInt(ttl);
  saveKeyValue(key, value, ttl);
  return res.status(200).json({ key, value, ttl });
})   

// get endpoint
app.get('/get', (req, res) => {
  let { key } = req.query;
  if (!key) {
    return res.status(400).json({ message: "Your GET request doesn't include a key" })
  }
  if (!mapStorage.has(key)) {
    return res.status(200).json({ message: "Key doesn't exist" });
  }
  const {value, ttl} = getValue(key);
  if (ttl && Date.now()/1000 > ttl) {
    mapStorage.delete(key)
  }
  return res.status(200).json({ key, value });
});

// delete endpoint
app.post('/delete', (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ error: "Your DELETE request doesn't include parameters" })
  }
  let { key } = req.body
  if (!mapStorage.has(key)) {
    return res.status(200).json({ message: "Key doesn't exist" });
  }

  // delete from storage
  deleteValue(key);
  return res.status(200).json( {message: "Successfully deleted key-value pair with key \'" + key + "\' from database."} );
})

// error handling
app.get('*', (req, res, next) => {
  const err = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  ); 
  err.statusCode = 404;
  next(err);
})

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  // if (err.statusCode === 404) {
  //   return res.status(404).redirect('/not-found');
  // }
  return res.status(err.statusCode).json({ err: err.toString() });
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
