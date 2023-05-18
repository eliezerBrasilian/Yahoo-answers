const Sequelize = require('sequelize')
const connection = require("./database")
//criando estrutura da tabela 
const Answer = connection.define('tb_answer',{
    question_id:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull:false
    }
})
//criando tabela no banco uma única só vez
Answer.sync({force:false}).then(()=>{
    console.log("tb_answer created")
})
.catch((e)=>{
    console.log("erro ao criar tabela: "+ e)
})

module.exports = Answer