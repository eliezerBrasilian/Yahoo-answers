const Sequelize = require('sequelize')
const connection = require("./database")
//criando estrutura da tabela 
const Question = connection.define('tb_question',{
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull:false
    }
})
//criando tabela no banco uma única só vez
Question.sync({force:false}).then(()=>{
    console.log("tabela criada")
})
.catch((e)=>{
    console.log("erro ao criar tabela: "+ e)
})

module.exports = Question