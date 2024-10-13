const TelegramBot = require('node-telegram-bot-api');

const token = '7711556525:AAHdIjUVJTYh0xXYYqpRSBnJVy_4R8xK55g';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

function sendUpdate(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, "🔝 Main Menu", mainMenuOptions)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
});


//refer dawgs

bot.onText("👥REFER DAWGS👥", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '\n🧧WITHDRAW🧧'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, `Hello ${username}!!\n

Referring friends is the fastest way to gather $DOGS tokens \n

Your referral link: https://t.me/RealDogsTokenAirdropbot?start=r04851732445\n

You have referred 0 Dawgs!\n

If you refer bots, you risk being BANNED‼️`, mainMenuOptions)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
});


//dogs balance

bot.onText("💰DOGS BALANCE💰", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, `Welcome ${username}\n

Your $DOGS Balance is 0`, mainMenuOptions)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
});


//withdraw
bot.onText("🧧WITHDRAW🧧", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
          keyboard: [
            ['👥REFER DAWGS👥', '💰DOGS BALANCE💰','🧧WITHDRAW🧧'],
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
        ,parse_mode: 'HTML'
      };
      
    bot.sendMessage(chatId, "Insufficent balance\n Minimum withdrawal is 600 DOGS$",mainMenuOptions)
    .then(() => {
        console.log('Message sent successfully');
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
});



bot.onText("checkmainmenu", (msg) => {
    const chatId = msg.chat.id;

    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['Option 1', 'Option 2'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, 'Click the button to check if you are subscribed:<a href="https://www.anthropic.com">Anthropic\'s website</a>', mainMenuOptions);
});