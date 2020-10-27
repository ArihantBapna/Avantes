// This line MUST be first, for discord.js to read the process envs!
require('dotenv').config(); 
const Discord = require("discord.js");
const client = new Discord.Client();

const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: "postgres://zmetwwifeybftf:5eb6e48ba17ac2aa3cfb0063c133ea8a0e14fbaf6755426caaa4fa63d2850930@ec2-3-91-139-25.compute-1.amazonaws.com:5432/df049esj9d4bgk"
});



client.on("ready", () => {
  pool.connect((err, client, release) => { 
    if (err) { 
        return console.error( 
            'Error acquiring client', err.stack) 
    } 
    client.query('SELECT NOW()', (err, result) => { 
        release() 
        if (err) { 
            return console.error( 
                'Error executing query', err.stack) 
        } 
        console.log("Connected to Database !") 
    }); 
  });
  console.log("I am ready!"); 
});

client.on("message", message => {
  if (message.author.bot) return;
  // The process.env.PREFIX is your bot's prefix in this case.
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // This is the usual argument parsing we love to use.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  // And our 2 real basic commands!
  
  if(message.channel.type === 'dm'){
    if(command === 'ask'){
        const channel = client.channels.cache.get('770295487198527518');
        var arrayLength = args.length;
        var type = args[0];
        var question = "";
        for (var i = 1; i < arrayLength; i++) {
          question += args[i] + " ";
      }
      if(type === "em"){
          const channel = client.channels.cache.get('770332770148155392');
          channel.send(question);
      }else{
          message.channel.send('Subject not found');
      }
    }else
    if(command === 'dbtest'){
      var question = "";
        for (var i = 1; i < arrayLength; i++) {
          question += args[i] + " ";
      }
      var type = args[0];
      var data = {
        user : message.author.id,
        question : question,
        subject :  type,
      }
      var sql = 'INSERT INTO questions (subject, question, user) VALUES ($1,$2,$3)'
      var values = [data.subject,data.question,data.user]
      pool.query(sql,values, (err,results) => {
        if (err){
          message.channel.send("error" +err.message)
          return;
        }
        message.channel.send("Uploaded your question successfully");
      });

    }else
    if(command === 'help'){
        message.channel.send('Syntax: +ask <subject> <question> \n Your question will be posted in the relevant channel by me completely anonymously');
    }else
    if(command === 'dbget'){
      pool.query('Select * from answered') 
      .then(testData => { 
          console.log(testData); 
          message.channel.send(testData.rows); 
      }); 
    }else{
        message.channel.send('Command not found. Use +help for more info');
    }
  }
  else{
      message.channel.send('I\'m sorry, thats not very anon of you');
  }
});

client.login(process.env.CLIENT_TOKEN);