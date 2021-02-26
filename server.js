'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 4000;

const dictStorage = {};

// helper functions
const saveKeyValue = function(key, value){
	dictStorage[key] = value;
};

const getValue = function(key){
	return dictStorage[key];
};

const deleteValue = function(key){
	delete dictStorage[key];
};

// set endpoint
app.post('/set', (req, res) => {
  // pull out key, value from req.body
  let { key, value } = req.body
  // ensure key, value are strings
  key = key.toString();
  value = value.toString();
  // save to local memory
  saveKeyValue(key, value);
  // send response
  return res.status(200).json({ key, value });
})   

// get endpoint
app.get('/get', (req, res) => {
  // pull out key from req.query
  let { key } = req.query;
  // if no key, send error
  if (!key) {
    return res.status(400).json({ message: "Your GET request doesn't include a key" })
  }
  // if key not in storage, send message
  if (!dictStorage[key]) {
    return res.status(200).json({ message: "Key doesn't exist" });
  }
  // get value of valid key
  const value = getValue(key);
  // send response
  return res.status(200).json({ key, value });
});

// delete endpoint
app.post('/delete', (req, res) => {
  // return error if no params
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ error: "Your DELETE request doesn't include parameters" })
  }
  // pull out key from req.body
  let { key } = req.body
  // if key not in storage, send message
  if (!dictStorage[key]) {
    return res.status(200).json({ message: "Key doesn't exist" });
  }
  // delete from storage
  deleteValue(key);
  // send response
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
