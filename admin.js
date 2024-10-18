const TelegramBot = require('node-telegram-bot-api');

const admintoken = '8172210694:AAFlCzfuhq31bwxFkxoKYQMXKpltuW0nb6A';
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://anarkicbntrqfkbtzgmg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYXJraWNibnRycWZrYnR6Z21nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzEwMDkwNiwiZXhwIjoyMDQyNjc2OTA2fQ._t7EJdKJ3uUHwMIjpPd9Q5w5b6tsIswEFb28bgWozes'

const supabase = createClient(supabaseUrl, supabaseKey);
const vbot = new TelegramBot(admintoken, { polling: true });

const notifyadmin = async (user, address, chat_id, uidx) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ DONE', callback_data: `accept_withdrawal:${chat_id}:${uidx}` },
                    { text: '❌ DECLINE', callback_data: `decline_withdrawal:${chat_id}:${uidx}` },
                    { text: '🔍 VIEW USER INFO', callback_data: `see_user:${chat_id}` }
                ]
            ]
        }, parse_mode: 'HTML'
    };

    vbot.sendMessage("6351462493", `${user} has placed a withdrawal\n\n The ton address is ${address}`, options)
    // vbot.sendMessage("1819258518", `${user} has placed a withdrawal\n\n The ton address is ${address}`, options);
}


const starters = async () => {
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

    vbot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        if (callbackQuery.data.includes('accept_withdrawal')) {
            const [command, chatid, uid] = callbackQuery.data.split(":");
            async function accept_withdrawal(){
                try{
                    const { data,error} = await supabase
                    .from('withdrawals')
                    .update({
                        "status":"accept"
                    })
                    .eq("uid",uid)
                    .select();
                    vbot.sendMessage(chatId, `${data[0]?.name} withdrawal successfully accepted ✅.\n\n `, mainMenuOptions);

                }catch(e){
                    console.log(e);
                }
            }
            accept_withdrawal();

            
        } else if (callbackQuery.data.includes('decline_withdrawal')) {
            const [command, chatid, uid] = callbackQuery.data.split(":");
            async function accept_withdrawal(){
                try{
                    const { data,error} = await supabase
                    .from('withdrawals')
                    .update({
                        "status":"declined"
                    })
                    .eq("uid",uid)
                    .select();
                    vbot.sendMessage(chatId, `${data[0]?.name} withdrawal declined ❌.\n\n 💰 Balance has been refunded `, mainMenuOptions);

                }catch(e){
                    console.log(e);
                }
            }
            accept_withdrawal();
        } else if (callbackQuery.data.includes('see_user')) {
            const [command,chat_id] = callbackQuery.data.split(":")
          async function getuserdata() {
            try {
                const { data,error } = await supabase
                .from('users')
                .select('*')
                .eq('chatid',chat_id)

                const { data:downs,error:derror} = await supabase
                .from('users')
                .select('chatid')
                .eq('upline',data[0]?.referid)  

                vbot.sendMessage(chatId, `${data[0]?.username}\nChatID: ${chat_id}\n\n Balance: ${data[0]?.balance}\nTotal Referals: ${downs?.length ?? 0} `, mainMenuOptions);

            } catch (error) {
                console.log(error)
            }
          }
          getuserdata()
         
        } else {

        }
        vbot.answerCallbackQuery(callbackQuery.id);
    });
    //start
    vbot.onText(/\/start$/, (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username;
        try {
         
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
                    ['MAIN MENU', 'ADD TASKS', 'DELETE TASKS', 'VIEW TASK'],
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