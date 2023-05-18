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
const Answer = require('./database/Answer')
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
 let id = req.params.id;
 let amount_answers = 0;
 Question.findOne({where: {id : id}}).then((q)=>{
  
  if(q !== null){
    Answer.count().then((c)=>{
      console.log("amount: "+ c);
      amount_answers = c;
     })
    Answer.findAll({
      raw:true,
      where:{question_id: id},
      order:[['id','desc']]
    }).then((i)=>{
     console.log(i)
      res.render('question',{
        question: q,
        answers:i,
        amount_answers:amount_answers
      })
    }).catch((e)=>{
      res.render('question',{
        question: q,
        amount_answers:0
      })
    })
   
  }
  else res.redirect('/')
 })
 
  
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

app.post('/question/answer',(req,res)=>{
  let description = req.body.description;
  let question_id = req.body.question_id;

  if(description.trim() !== ''){
    Answer.create({
      question_id:question_id,
      description:description
  }).then(()=>{
    console.log('data inserted at tb_answer')
    res.redirect(`/question/${question_id}`)
  }).catch((e)=>{
    console.log('error on inserting at tb_answer - '+e)
  })
  }
  
})