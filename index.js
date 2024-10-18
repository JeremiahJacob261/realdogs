const TelegramBot = require('node-telegram-bot-api');

const { notifyadmin, starters } = require("./admin.js")
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://anarkicbntrqfkbtzgmg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYXJraWNibnRycWZrYnR6Z21nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzEwMDkwNiwiZXhwIjoyMDQyNjc2OTA2fQ._t7EJdKJ3uUHwMIjpPd9Q5w5b6tsIswEFb28bgWozes'

const supabase = createClient(supabaseUrl, supabaseKey);

const token = '7711556525:AAHdIjUVJTYh0xXYYqpRSBnJVy_4R8xK55g';

let surewithdraw = {};
// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

function isTONAddress(address) {
    // Regular expression for TON address validation
    const tonAddressRegex = /^-?[0-9]:[\da-fA-F]{64}$/;

    // Test the address against the regex
    return tonAddressRegex.test(address);
}

// Example usage:

///end of nextmessage

starters();
function sendUpdate(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(() => {
            console.log('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

async function addAmountToUpline(chatId, amount) {
    try {
        // Step 1: Get the user's upline based on their chat_id
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('upline')
            .eq('chatid', chatId)
            .single();

        if (userError) {
            throw new Error(`Error fetching user with chat_id ${chatId}: ${userError.message}`);
        }

        const uplineReferId = user.upline;

        // Step 2: Get the upline user data based on referid
        const { data: uplineUser, error: uplineError } = await supabase
            .from('users')
            .select('balance')
            .eq('referid', uplineReferId)
            .single();

        if (uplineError) {
            throw new Error(`Error fetching upline with referid ${uplineReferId}: ${uplineError.message}`);
        }

        const newBalance = uplineUser.balance + amount;

        // Step 3: Update the upline's balance
        const { error: updateError } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('referid', uplineReferId);

        if (updateError) {
            throw new Error(`Error updating upline balance: ${updateError.message}`);
        }

        console.log(`Successfully added ${amount} to upline with referid ${uplineReferId}. New balance: ${newBalance}`);
    } catch (error) {
        console.error(error.message);
    }
}

function generateRandomNumberString(length = 11) {
    const digits = '0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
    }

    return "r" + result;
}

function uidderand(length = 11) {
    const digits = '0123abdje456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
    }

    return "u" + result;
}

bot.onText(/\/start$/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🔍 Joined', callback_data: 'check_subscription' }
                ]
            ]
        }, parse_mode: 'HTML'
    };

    const mandatory = async () => {
        const { data, error } = await supabase
            .from("mtasks")
            .select("*")
        if (data?.length < 1) {
            bot.sendMessage(chatId, "<i>SUBSCRIBE TO ALL CHANNELS AND SOCIALS BEFORE USING THE BOT</i>\n\nNo Task available‼️", options)
                .then(async () => {
                    const { data, error } = await supabase
                        .from('users')
                        .upsert({
                            "username": username,
                            "chatid": chatId,
                            "referid": generateRandomNumberString(),
                            "upline": "none"
                        }, { onConflict: 'chatid' })


                    console.log('Message sent successfully');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        } else {
            let stringer = "";

            data.map((d) => {
                let kk = `<a href="${d.link}">${d.title}</a>\n`;

                stringer += kk;
            });
            bot.sendMessage(chatId, `<i>SUBSCRIBE TO ALL CHANNELS AND SOCIALS BEFORE USING THE BOT</i>\n\n${stringer}\nClick the Joined to continue`, options)
                .then(async () => {
                    const { data, error } = await supabase
                        .from('users')
                        .upsert({
                            "username": username,
                            "chatid": chatId,
                            "referid": generateRandomNumberString(),
                            "upline": "none"
                        }, { onConflict: 'chatid' })


                    console.log('Message sent successfully');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        }
    }

    mandatory();



});

bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const startParam = match[1];
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🔍 Joined', callback_data: 'check_subscription' }
                ]
            ]
        }, parse_mode: 'HTML'
    };


    const mandatory = async () => {
        const { data, error } = await supabase
            .from("mtasks")
            .select("*")
        if (data?.length < 1) {
            bot.sendMessage(chatId, "<i>SUBSCRIBE TO ALL CHANNELS AND SOCIALS BEFORE USING THE BOT</i>\n\nNo Task available‼️", options)
                .then(async () => {
                    const { data, error } = await supabase
                        .from('users')
                        .upsert({
                            "username": username,
                            "chatid": chatId,
                            "referid": generateRandomNumberString(),
                            "upline": startParam
                        }, { onConflict: 'chatid' })


                    console.log('Message sent successfully');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        } else {
            let stringer = "";

            data.map((d) => {
                let kk = `<a href="${d.link}">${d.title}</a>\n`;

                stringer += kk;
            });
            bot.sendMessage(chatId, `<i>SUBSCRIBE TO ALL CHANNELS AND SOCIALS BEFORE USING THE BOT</i>\n\n${stringer}\nClick the Joined to continue`, options)
                .then(async () => {
                    const { data, error } = await supabase
                        .from('users')
                        .upsert({
                            "username": username,
                            "chatid": chatId,
                            "referid": generateRandomNumberString(),
                            "upline": startParam
                        }, { onConflict: 'chatid' })

                    if (error) {
                        console.log(error)
                    } else {

                    }
                    console.log('Message sent successfully');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        }
    }

    mandatory();
});


// Handle button click
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;

    const { data, error } = await supabase
        .from("mtasks")
        .select("*")
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };
    if (callbackQuery.data === 'check_subscription') {
        if (data?.length < 1) {
            bot.sendMessage(chatId, 'Welcome to RealDOGSBot🐶', mainMenuOptions);
            addAmountToUpline(chatId, 100);
        } else {
            try {
                addAmountToUpline(chatId, 100);
                // Check if the user is a member of the channel
                const chatMember = await bot.getChatMember("@StarCallsTG", userId);

                // Respond based on the user's subscription status
                if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
                    bot.sendMessage(chatId, 'Welcome to RealDOGSBot 🐶', mainMenuOptions);
                } else {
                    bot.sendMessage(chatId, 'You have not completed all the tasks ‼️.\n Please perform all tasks');
                }
            } catch (error) {
                console.error(error);
                bot.sendMessage(chatId, 'There was an error checking your subscription status.');
            }
        }

    }

    // Acknowledge the callback to avoid the "loading" circle animation
    bot.answerCallbackQuery(callbackQuery.id);
});
//refer dawgs

bot.onText("👥REFER DAWGS👥", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };
    try {

        async function getrefer() {
            const { data, error } = await supabase
                .from('users')
                .select('referid')
                .eq('chatid', chatId)
            console.log(data)
            const { data: number, error: nerror } = await supabase
                .from('users')
                .select('upline')
                .eq('upline', data[0].referid)
            try {
                bot.sendMessage(chatId, `Hello ${username}!!\n\n Referring friends is the fastest way to gather $DOGS tokens \n\nYour referral link: https://t.me/RealDogsTokenAirdropbot?start=${data[0]?.referid}\n\nYou have referred ${number?.length} Dawgs!\nIf you refer bots, you risk being BANNED‼️`, mainMenuOptions)
                    .then(() => {
                        console.log('Message sent successfully');
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error);
                    });
            } catch (error) {
                console.log(error)
            }
        }
        getrefer();
    } catch (e) {
        bot.sendMessage(chatId, `An error occured`, mainMenuOptions)
            .then(() => {
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }
});


//dogs balance

bot.onText("💰DOGS BALANCE💰", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

    async function getbalance() {
        const { data, error } = await supabase
            .from('users')
            .select('balance')
            .eq('chatid', chatId)
        if (error) {
            console.log(error)
        }
        bot.sendMessage(chatId, `Welcome ${username}\n\nYour $DOGS Balance is ${data[0]?.balance}`, mainMenuOptions)
            .then(() => {
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }
    getbalance();
});


//withdraw
bot.onText("🧧WITHDRAW🧧", async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        },
        parse_mode: 'HTML'
    };

    // Fetch the user's balance from the Supabase database
    const { data, error } = await supabase
        .from('users')
        .select('balance,username')
        .eq('chatid', chatId);

    // Check if there was an error or no data returned
    if (error || data.length === 0) {
        bot.sendMessage(chatId, "Error retrieving your balance. Please try again later.", mainMenuOptions);
        console.error("Error fetching balance:", error);
        return;
    }

    const balance = data[0]?.balance;
    const user = data[0]?.username;

    // Ensure the balance is sufficient
    if (balance > 299) {
        // Send message and wait for reply
        bot.sendMessage(chatId, "Please reply to this message with your TON address✅\n\nMinimum withdrawal is 300 DOGS$\n\nReferring fake users will lead to withdrawal failure, balance forfeit‼️", mainMenuOptions)
            .then((sentMsg) => {
                surewithdraw[chatId] = true;
                console.log("withdrawal")
                bot.on('text', (msg) => {
                    const chatId = msg.chat.id;
                    const messageText = msg.text;
                    const uidx = uidderand();
                    console.log(surewithdraw)
                    if (surewithdraw[chatId]) {

                        if (messageText.includes('REFER DAWGS') || messageText.includes('DOGS BALANCE') || messageText.includes('WITHDRAW') || messageText.includes('TASKS')) {
                            surewithdraw[chatId] = false;
                        } else {
                            console.log("commands")
                            if (messageText.length < 10) {
                                bot.sendMessage(chatId, `Invalid Ton Address\n\n <a href="https://t.me/StarCallsTG">StarCallsTG</a>`, mainMenuOptions);
                                surewithdraw[chatId] = false;
                            } else {
                                notifyadmin(user, messageText, chatId,uidx);
                                console.log(!messageText.includes('REFER DAWGS'))
                                surewithdraw[chatId] = false;

                                
                                const Depositing = async () => {
                                    try {
                                        const { error } = await supabase
                                            .from('users')
                                            .update({ balance: 0 })
                                            .eq('chatid', chatId)
                                        //send datat to the withdrawal tale
                                            const { error:werror } = await supabase
                                            .from('withdrawals')
                                            .insert({ 
                                                "name":user,
                                                "chatid":chatId,
                                                "amount":balance,
                                                "address":messageText,
                                                "uid":uidx
                                             });
                                    } catch (e) {
                                        console.log(error)
                                    }
                                }
                                Depositing();
                                bot.sendMessage(chatId, `You replied with TON address: ${messageText}\nYour withdrawal request has been received.\nPlease wait for the admin to process it.\n\n<a href="https://t.me/StarCallsTG">StarCallsTG</a>`, mainMenuOptions);

                            }

                        }

                    }



                })
            })
            .catch((err) => {
                console.error("Error sending message:", err);
            });
    } else {
        // If balance is insufficient
        bot.sendMessage(chatId, "Insufficient balance\n\nMinimum withdrawal is 300 DOGS$", mainMenuOptions)
            .then(() => {
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }
});


//tasks
bot.onText("🤖TASKS🤖", async (msg) => {
    const { data, error } = await supabase
        .from("task")
        .select("*")


    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['MAIN Menu🔝', '✅ FINISH TASK'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };


    let stringer = "";
    if (data.length < 1) {
        bot.sendMessage(chatId, "Task section is a section for non-referrals to earn✅\n\n <i> Check back later‼️ Tasks would be updated as soon as there are active tasks✅</i> \nDo you want your ad published on this bot?\n\n Join the channel and stay tuned for advertising opportunities‼️*", mainMenuOptions)
            .then(() => {
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    } else {
        data?.map((d) => {
            let kk = `<a href="${d.link}">${d.title}</a>\n\n<i>Reward: ${d.price} DOGS</i>`;

            stringer += kk;
        });
        bot.sendMessage(chatId, `<i>Tasks available for you to earn $DOGS</i>\n\n${stringer}\n\nDo you want your ad published on this bot?\n\n Join the channel and stay tuned for advertising opportunities‼️*`, mainMenuOptions)
    }
});


bot.onText("MAIN Menu🔝", (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const mainMenuOptions = {
        reply_markup: {
            keyboard: [
                ['👥REFER DAWGS👥', '💰DOGS BALANCE💰', '🧧WITHDRAW🧧', '🤖TASKS🤖'],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
        , parse_mode: 'HTML'
    };

        bot.sendMessage(chatId, `Main menu 🔝`, mainMenuOptions)
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