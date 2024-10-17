const TelegramBot = require('node-telegram-bot-api');

const admintoken = '8172210694:AAFlCzfuhq31bwxFkxoKYQMXKpltuW0nb6A';
const vbot = new TelegramBot(admintoken, { polling: true });

const notifyadmin = async (user, address) =>{
        vbot.sendMessage("6351462493",`${user} has placed a withdrawal\n\n The ton address is ${address}`)
}


const starters = async () => {
    
vbot.onText(/\/start$/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    vbot.sendMessage("1819258518", "HELLO Admin")
          
});
}

module.exports = {
    notifyadmin,starters
};