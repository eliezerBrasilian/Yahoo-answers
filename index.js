const express = require('express');
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.text())
app.set('view engine', 'ejs');
app.use(express.static('public'));
const connection = require('./database/database')
connection.authenticate().then(()=>{
  console.log("conexao feita com o banco de dados")
})
.catch((error)=>{
  console.log("falha ao se conectar com o db" + error)
})
const Question = require('./database/Question')
app.listen(3000, (e) => {
  let msg = e ? 'error on open connection' : 'server running';
  console.log(msg);
});
app.get('/', (req, res) => {
  Question.findAll({raw:true}).then((questions)=>{
    console.log('data brought to the front end')
    res.render('index',{
      questions: questions
    });
  })
  
});
app.get('/question/:id',(req,res)=>{
 
  res.render('question')
})
app.post('/save_question',(req,res)=>{
  let title = req.body.title;
  let description = req.body.description;
  if(title.trim() !== '' && description.trim()!== ''){
    Question.create({
      title: title,
      description:description
    }).then(()=>{
      console.log('data inserted!')
      res.redirect('/')
    }).catch((e)=>{
      console.log('error on inserting - '+e)
    })
  }
 
  
})
