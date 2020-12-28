require('dotenv').config(); 
const Discord = require("discord.js");
var fs = require('fs');
const client = new Discord.Client();

const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // This is the usual argument parsing we love to use.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  //If a question is dm'd to the bot
  if(message.channel.type === 'dm'){

    //The command is ask (for us +ask)
    if(command === 'ask'){

        //Set values

        var arrayLength = args.length;
        //If you don't have atleast 2 arguments do nothing
        if(!arrayLength >= 2){
          message.channel.send("Not enough arguments");
          return;
        }
        var type = args[0];
        var question = "";
        //Iterate over the arguments to form the question string
        for (var i = 1; i < arrayLength; i++) {
          question += args[i] + " ";
        }
        //Store our values in a data object
        var data = {  
          userid : message.author.id,
          question : question,
          subject :  type,
        }
      
      //Attempt to find the room the user wants to send the message to
      if(type === "em"){
        //Send the message to that room
          const channel = client.channels.cache.get('766400711596048474');
          channel.send(question);
        //Start the upload process
          var sql = 'INSERT INTO questions (subject, question, userid) VALUES ($1,$2,$3)'
          var values = [data.subject,data.question,data.userid]
        //upload the message into the db
          pool.query(sql,values, (err,results) => {
            if (err){
              message.channel.send("error" +err.message)
            }
            message.channel.send("Your message was sent succesfully");
          });
      }else if(type === "mech"){
        const channel = client.channels.cache.get('766431944946483260');
        channel.send(question);
        var sql = 'INSERT INTO questions (subject, question, userid) VALUES ($1,$2,$3)'
        var values = [data.subject,data.question,data.userid]
        pool.query(sql,values, (err,results) => {
          if (err){
            message.channel.send("error" +err.message)
          }
          message.channel.send("Your message was sent succesfully");
        });
      }else if(type === "p1"){
        const channel = client.channels.cache.get('766401742514028584');
        channel.send(question);
        var sql = 'INSERT INTO questions (subject, question, userid) VALUES ($1,$2,$3)'
        var values = [data.subject,data.question,data.userid]
        pool.query(sql,values, (err,results) => {
          if (err){
            message.channel.send("error" +err.message)
          }
          message.channel.send("Your message was sent succesfully");
        });
      }else if(type === "bot"){
        const channel = client.channels.cache.get('781548324628463617');
        channel.send(question);
        var sql = 'INSERT INTO questions (subject, question, userid) VALUES ($1,$2,$3)'
        var values = [data.subject,data.question,data.userid]
        pool.query(sql,values, (err,results) => {
          if (err){
            message.channel.send("error" +err.message)
          }
          message.channel.send("Your message was sent succesfully");
        });
      }
      else{
          message.channel.send('Subject not found');
      }
    }else if(command=='help'){
      message.channel.send('Usage:' +process.env.PREFIX  +'ask <subject> <question>');
    }
    else{
        message.channel.send('Command not found. Use' +process.env.PREFIX +'help for more info');
    }
  }
  else{
    if(command==='lockdown'){

      var data = fs.readFileSync('./config.json');
      var myObj;
      try{
        myObj = JSON.parse(data);
        console.dir(myObj);
      }catch(err){
        console.log('There has been an error parsing your JSON');
        console.log(err);
      }
      var myOpt = {
        status: Math.abs(myObj.status - 1)
      };
      var dat = JSON.stringify(myOpt);
      fs.writeFile('./config.json', data, function (err) {
        if (err) {
          console.log('There has been an error saving your configuration data.');
          console.log(err.message);
          return;
        }
        console.log('Configuration saved successfully.')
      });
    }else{
      message.channel.send('I\'m sorry, thats not very anon of you');
    }
    
  }
});
client.login(process.env.CLIENT_TOKEN);