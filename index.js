// This line MUST be first, for discord.js to read the process envs!
require('dotenv').config(); 
const Discord = require("discord.js");
const client = new Discord.Client();

let connectionString = {
  connectionString: process.env.DATABASE_URL,
  };

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  // The process.env.PREFIX is your bot's prefix in this case.
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // This is the usual argument parsing we love to use.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const pool = new Pool(connectionString);

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
    }
    else if(command === 'dbTest'){
      pool.query("SELECT * from some_table", (err, res) => {
        message.channel.send(res);
        pool.end();
      });
    }
    else if(command === 'help'){
        message.channel.send('Syntax: +ask <subject> <question> \n Your question will be posted in the relevant channel by me completely anonymously');
    }else{
        message.channel.send('Command not found. Use +help for more info');
    }
  }
  else{
      message.channel.send('I\'m sorry, thats not very anon of you');
  }
});

client.login(process.env.CLIENT_TOKEN);