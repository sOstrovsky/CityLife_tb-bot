import TelegramBot from 'node-telegram-bot-api';
import config from 'config';
import { constants } from './constants';
import { postQuery } from './helpers';
import { find } from 'lodash'
import moment from 'moment';
import './web';
import https from 'https';
//refresh every 5 minutes
setInterval(() => {
    console.log('im still alive!');
    https.get("https://citylife-tb-bot.herokuapp.com/");
}, 300000);
const TOKEN = config.get('token');

const bot = new TelegramBot(TOKEN, {polling: true});
let aboutUrl = '';
let emailSupport = '';
let phoneSupport = '';
let telegramSupport = '';
let marketing = [];
let video = [];
let faqUser = [];
let faqPartner = [];
let promo = [];
let franchise = [];

let current = 'root';
let documentsDownloadDate = moment();

const mainMenu = [["О компании", "Материалы"], ["Поддержка", "База знаний"], ["Стикеры CityLife"]];
const materials = [["Маркетинг", "Видео"], ["Акции", "Мини-франшиза"], [constants.MAIN_BACK] ];
const faqMenu = [["Для пользователей", "Для ТСП"], [constants.MAIN_BACK] ];

bot.onText(/\/start/, async (msg) => {
    console.log('---', documentsDownloadDate);
    try {
        let response = await postQuery(constants.FETCH_URL, constants.GQL_QUERY);
        const { contacts, about, materials, faq } = response.data.data.companyDocuments;

        documentsDownloadDate = moment();

        emailSupport = contacts.email;
        phoneSupport = contacts.phone;
        telegramSupport = contacts.telegram;
        aboutUrl = about.link;
        marketing = materials.marketing;
        video = materials.video;
        promo = materials.actions;
        franchise = materials.franchise;
        faqUser = faq.user;
        faqPartner = faq.partner;

        const {chat: {id, first_name, last_name}} = msg;
        const name = first_name ? first_name + (last_name ? ' ' + last_name : '' ) : '';

        bot.sendMessage(id, `Привет${Boolean(name) ? ', ' + name : ''}!`, {
            "reply_markup": {
                "keyboard": mainMenu,
                "resize_keyboard": true
            }
        }).catch(err => console.warn(err));
    } catch (err) {
        console.log('-error-', err);
    }
});

bot.on('message', async (msg) => {
    const { id } = msg.chat;
    console.log('---', msg);
    if (moment(documentsDownloadDate).add(1, 'd') < moment()) {
        try {
            let response = await postQuery(constants.FETCH_URL, constants.GQL_QUERY);
            const { contacts, about, materials, faq } = response.data.data.companyDocuments;

            documentsDownloadDate = moment();

            emailSupport = contacts.email;
            phoneSupport = contacts.phone;
            telegramSupport = contacts.telegram;
            aboutUrl = about.link;
            marketing = materials.marketing;
            video = materials.video;
            promo = materials.actions;
            franchise = materials.franchise;
            faqUser = faq.user;
            faqPartner = faq.partner;
        } catch (err) {
            console.log('-error-', err);
        }
    }

    if (current === 'marketing') {

        const materialsMenu = marketing.map(v => ([v.title]));
        materialsMenu.push([constants.MATERIALS_BACK]);

        let obj = find(marketing, {'title': msg.text});

        if (obj) {
            bot.sendDocument(id, obj.link, {
                "reply_markup": {
                    "keyboard": materialsMenu,
                    "resize_keyboard": true
                }
            }).catch(err => {
                bot.sendMessage(id, constants.DOCUMENT_UNAVAILABLE, {
                    "reply_markup": {
                        "keyboard": materialsMenu,
                        "resize_keyboard": true
                    }
                }).catch(err => console.warn(err));
                console.warn(err);
            });
        }
    } else if (current === 'video') {

        const menu = video.map(v => ([v.title]));
        menu.push([constants.MATERIALS_BACK]);

        let obj = find(video, {'title': msg.text});

        if (obj) {

            bot.sendMessage(id, obj.link, {
                "reply_markup": {
                    "keyboard": menu,
                    "resize_keyboard": true
                }
            }).catch(err => {
                bot.sendMessage(id, constants.VIDEO_UNAVAILABLE, {
                    "reply_markup": {
                        "keyboard": menu,
                        "resize_keyboard": true
                    }
                }).catch(err => console.warn(err));
                console.warn(err);
            });
        }
    } else if (current === 'faqU') {

        const menuUser = faqUser.map(v => ([v.question]));
        menuUser.push([constants.BASE_BACK]);

        let obj = find(faqUser, {'question': msg.text});

        if (obj) {
            bot.sendMessage(id, obj.answer, {
                "reply_markup": {
                    "keyboard": menuUser,
                    "resize_keyboard": true
                }
            }).catch(err => {
                console.log(err);
            });
        }
    } else if (current === 'faqP') {

        const menuPartner = faqPartner.map(v => ([v.question]));
        menuPartner.push([constants.BASE_BACK]);

        let obj = find(faqPartner, {'question': msg.text});

        if (obj) {
            bot.sendMessage(id, obj.answer, {
                "reply_markup": {
                    "keyboard": menuPartner,
                    "resize_keyboard": true
                }
            }).catch(err => {
                console.log(err);
            });
        }
    } else if (current === 'promo') {

        const menuPromo = promo.map(v => ([v.title]));
        menuPromo.push([constants.MATERIALS_BACK]);

        let obj = find(promo, {'title': msg.text});

        if (obj) {
            bot.sendDocument(id, obj.link, {
                "reply_markup": {
                    "keyboard": menuPromo,
                    "resize_keyboard": true
                }
            }).catch(err => {
                bot.sendMessage(id, constants.DOCUMENT_UNAVAILABLE, {
                    "reply_markup": {
                        "keyboard": menuPromo,
                        "resize_keyboard": true
                    }
                }).catch(err => console.warn(err));
                console.warn(err);
            });
        }
    } else if (current === 'franchise') {

        const menuFranchise = franchise.map(v => ([v.title]));
        menuFranchise.push([constants.MATERIALS_BACK]);

        let obj = find(franchise, {'title': msg.text});

        if (obj) {
            bot.sendDocument(id, obj.link, {
                "reply_markup": {
                    "keyboard": menuFranchise,
                    "resize_keyboard": true
                }
            }).catch(err => {
                bot.sendMessage(id, constants.DOCUMENT_UNAVAILABLE, {
                    "reply_markup": {
                        "keyboard": menuFranchise,
                        "resize_keyboard": true
                    }
                }).catch(err => console.warn(err));
                console.warn(err);
            });
        }
    }
});

/**
 * First screen
 */
bot.onText(/^О компании/, (msg) => {
    const { id } = msg.chat;

    current = 'root';
    bot.sendDocument(id, aboutUrl, {
        "reply_markup": {
            "keyboard": mainMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Материалы/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    current = 'materials';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": materials,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});
bot.onText(/^Поддержка/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    bot.sendMessage(id, `${constants.SUPPORT_TITLE}\n${constants.SUPPORT_PHONE} ${phoneSupport}\n${constants.SUPPORT_EMAIL} ${emailSupport}\n${constants.SUPPORT_TELEGRAM} ${telegramSupport}`, {
            "reply_markup": {
            "keyboard": mainMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^База знаний/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": faqMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Стикеры CityLife/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    bot.sendMessage(id,
        "<b>Добавляй себе </b><a href='https://t.me/addstickers/CityLife_emoji'>наши фирменные стикеры!</a>",
        { parse_mode: "HTML" },
        {
            "reply_markup": {
                "keyboard": mainMenu,
                "resize_keyboard": true
            }
        }).catch(err => console.warn(err));
});


/**
 *  База знаний
 */

bot.onText(/^Для пользователей/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let faqMenu = faqUser.map(v => ([v.question]));
    faqMenu.push([constants.BASE_BACK]);

    current = 'faqU';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": faqMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Для ТСП/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let faqMenu = faqPartner.map(v => ([v.question]));
    faqMenu.push([constants.BASE_BACK]);

    current = 'faqP';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": faqMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

/**
 *  Материалы
 */

bot.onText(/^Маркетинг/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let marketingMenu = marketing.map(v => ([v.title]));
    marketingMenu.push([constants.MATERIALS_BACK]);

    current = 'marketing';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": marketingMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Видео/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let videoMenu = video.map(v => ([v.title]));
    videoMenu.push([constants.MATERIALS_BACK]);

    current = 'video';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": videoMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Акции/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let promoMenu = promo.map(v => ([v.title]));
    promoMenu.push([constants.MATERIALS_BACK]);

    current = 'promo';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": promoMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^Мини-франшиза/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    let franchiseMenu = franchise.map(v => ([v.title]));
    franchiseMenu.push([constants.MATERIALS_BACK]);

    current = 'franchise';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": franchiseMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});


/**
 *  Материалы > Маркетинг
 */

bot.onText(/^< Материалы/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    current = 'materials';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": materials,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^< Основное меню/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    current = 'root';

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": mainMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});

bot.onText(/^< База знаний/, (msg) => {
    const { id } = msg.chat;

    console.log(msg);

    bot.sendMessage(id, constants.CHOOSE_ONE_OF, {
        "reply_markup": {
            "keyboard": faqMenu,
            "resize_keyboard": true
        }
    }).catch(err => console.warn(err));
});
