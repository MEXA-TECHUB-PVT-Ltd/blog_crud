const { Client } = require('pg');

const client = new Client({
   host: "143.110.156.91",
   user: "test_user",
   port: "5432",
   password: "mtechub123",
   database: "blog_crud"
  
});

module.exports = client;