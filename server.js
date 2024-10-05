// Import some dependencies/ packages 

// HTTP framework for handling requests
const express = require('express');
//Instance of express framework
const app = express(); 
// DBMS Mysql 
const mysql = require('mysql2');
// Cross Origin Resourse Sharing 
const cors = require('cors');
// Environment variable doc 
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, //
  password: process.env.DB_PASSWORD, // 
  database: process.env.DB_NAME, // 
});

// Connect to the database
db.connect((err) => {
  // If no connection 
  if(err) return console.log("Error connecting to MYSQL", err);

  //If connect works successfully
  console.log("Connected to MYSQL as id: ", db.threadId); 
})


// Set EJS as the view engine and set views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1 goes here

// Data is a file found in the Views folder 
app.get('/data', (req,res) => {

    // Retrieve data from database 
    db.query('SELECT * FROM patients', (err, results) =>{
      if (err){
          console.error(err);
          res.status(500).send('Error Retrieving data')
      }else {
          //Display the records to the browser 
          res.render('data', {results: results});
      }
  });
});

// Question 2 goes here

// New Route: Retrieve all providers with their first_name, last_name, and provider_specialty
app.get('/provider', (req, res) => {
  // SQL query to select the required columns from the providers table
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving providers');
    } else {
      // Respond with the list of providers
      res.render('provider', {results: results}); // Sends the results as JSON
    }
  });
});

// Question 3 goes here
// New Route: Filter patients by their first name
app.get('/patient_first', (req, res) => {
  const { first_name } = req.query; // Get the first_name from query parameters

  // If no first_name is provided, return all patients
  let query = 'SELECT patient_id, first_name, date_of_birth FROM patients';
  let queryParams = [];

  // If a first_name is provided, filter the results
  if (first_name) {
    query += ' WHERE first_name = ?'; // Use parameterized query to prevent SQL injection
    queryParams.push(first_name);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving patients');
    } else {
      // Respond with the filtered list of patients
      res.render('patient_first', {results: results});
    }
  });
});

// Question 4 goes here

// Route to filter providers by their specialty
app.get('/provider_first', (req, res) => {
  const { provider_specialty } = req.query; // Get the provider_specialty from query parameters

  // If no provider_specialty is provided, return all providers
  let query = 'SELECT provider_id, provider_specialty FROM providers';
  let queryParams = [];

  // If a provider_specialty is provided, filter the results
  if (provider_specialty) {
    query += ' WHERE provider_specialty = ?'; // Use parameterized query to prevent SQL injection
    queryParams.push(provider_specialty);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving providers');
    } else {
      // Respond with the filtered list of providers
      res.render('provider_first', {results: results});
    }
  });
});


// listen to the server
// Start the server 
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);

  // Sending a message to the browser 
  console.log('Sending message to browser...');
  app.get('/', (req,res) => {
      res.send('Server Started Successfully!');
  });

});