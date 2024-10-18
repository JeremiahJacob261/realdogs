const TelegramBot = require('node-telegram-bot-api');

const admintoken = '8172210694:AAFlCzfuhq31bwxFkxoKYQMXKpltuW0nb6A';
const vbot = new TelegramBot(admintoken, { polling: true });

const notifyadmin = async (user, address) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ DONE', callback_data: 'accept_withdrawal' },
                    { text: '❌ DECLINE', callback_data: 'decline_withdrawal' },
                    { text: '🔍 VIEW USER INFO', callback_data: 'see_user' }
                ]
            ]
        }, parse_mode: 'HTML'
    };

    vbot.sendMessage("6351462493", `${user} has placed a withdrawal\n\n The ton address is ${address}`, options)
    vbot.sendMessage("1819258518", `${user} has placed a withdrawal\n\n The ton address is ${address}`, options)

    
}


const starters = async () => {

    //start
    vbot.onText(/\/start$/, (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username;
   try {
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['USERS', 'WITHDRAWAL REQUEST', 'ANALYTICS', 'TASKS'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    }
    vbot.sendMessage(chatId, "HELLO Admin", mainMenuOptions);
    console.log("start admin")
   } catch (error) {
    console.log(error)
   }
    });


    //find user
    vbot.onText("USERS", (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username;
        const mainMenuOptions = {
            reply_markup: {
                keyboard: [
                    ['USERS', 'WITHDRAWAL REQUEST', 'ANALYTICS', 'TASKS'],
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
            , parse_mode: 'HTML'
        }
        vbot.sendMessage(chatId, "FIND USERS HERE", mainMenuOptions)
    });

    //tasks
    vbot.onText("TASKS", (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username;
        const mainMenuOptions = {
            reply_markup: {
                keyboard: [
                    ['MAIN MENU','ADD TASKS', 'DELETE TASKS', 'VIEW TASK'],
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
            , parse_mode: 'HTML'
        }
        vbot.sendMessage(chatId, "FIND USERS HERE", mainMenuOptions)
    });

}

module.exports = {
    notifyadmin, starters
};