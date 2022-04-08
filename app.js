const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');

const db = mysql.createConnection({
  host        : 'localhost',
  user        : 'root',
  password    : 'root',
  database    : 'wsa_transactions',
  port        : '8889'
});

const port = process.env.PORT || 3000
db.connect((error) => {
  if(error){
    throw error;
  }
  console.log('mysql connected')
})

const app = express();

app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.post('/api/add-transaction', (req, res) => {
  const hasToken = req.headers.authorization === 'Bearer 5eebbc6cb757adb04e4e778d55526ec30fd00c71fb8537041f56444c0660a617e50b4c2e4f1de358a26e5ea3693c8ecd18c20d1b8df163c491102e18f7f17625';

  if(hasToken){
    const {
      buyer_logo,
      buyer_country,
      seller_logo,
      seller_country,
      type_of_transaction,
      industry_sector,
      detailed_business_desc,
      transaction_size,
      member_name,
      member_country,
      deal_manager,
      tombstone_title,
      transaction_excerpt,
      keyphrase,
      meta_description,
      created_by,
      orbit_id,
      updated_at
    } = req.body
    console.log({req: req})
    const sqlInsert = "INSERT INTO transactions VALUES ?";
    db.query(sqlInsert, [[[
      null,
      buyer_logo,
      buyer_country,
      seller_logo,
      seller_country,
      type_of_transaction,
      industry_sector,
      detailed_business_desc,
      transaction_size,
      member_name,
      member_country,
      deal_manager,
      tombstone_title,
      transaction_excerpt,
      keyphrase,
      meta_description,
      new Date(),
      created_by,
      orbit_id,
    ]]], (err, result) => {
      if(err){
          console.log(err);
          return
      }
      console.log(result)
      console.log('Inserted new transaction: ', result.insertId)
      res.end();
    })} else{
      res.status(401)
      res.send('Token Missing')
    }
    res.end();
})

app.get('/api/get-transactions', (req, res) => {
  let sql = 'SELECT * FROM transactions ';
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    res.send(results)
  })
})


app.listen(port, () => {
  console.log('server started')
})

