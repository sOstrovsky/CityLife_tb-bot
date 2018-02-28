export const constants = {
    FETCH_URL: 'https://alpha-profile.cl.world/api/v3.1',
    GQL_QUERY:
        `query docs {
            companyDocuments {
                contacts {
                    phone
                    email
                    telegram
                }
                about {
                    title
                    link
                }
                materials {
                    marketing {
                        title
                        link
                    }
                    video {
                        title
                        link
                    }
                    actions {
                        title
                        link
                    }
                    franchise {
                        title
                        link
                    }
                }
                faq {
                    user {
                        question
                        answer
                    }
                    partner {
                        question
                        answer
                    }
                }
            }
        }`,
    CHOOSE_ONE_OF: 'Выберите один из пунктов меню:',
    REPAIR: 'Раздел в разработке \u{1F527}',
    MAIN_BACK: '< Основное меню',
    BASE_BACK: '< База знаний',
    MATERIALS_BACK: '< Материалы',
    DOCUMENT_UNAVAILABLE: 'Документ временно недоступен. Мы уже работаем над этой проблемой \u{1F527}',
    VIDEO_UNAVAILABLE: 'Видео временно недоступно. Мы уже работаем над этой проблемой \u{1F527}',
    SUPPORT_TITLE: 'По всем вопросам обращайтесь в поддержку проекта:',
    SUPPORT_PHONE: 'Наш телефон:',
    SUPPORT_EMAIL: 'Наш email:',
    SUPPORT_TELEGRAM: 'Чат поддержки:',
};