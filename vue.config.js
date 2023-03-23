
module.exports = {
    pluginOptions: {
        i18n: {
            locale: ['en','fa'],
            fallbackLocale: '',
            localeDir: 'locales',
            enableInSFC: true,
            enableBridge: false,
            detectBrowserLanguage:{
                useCookie:true,
                cookieKey:'lang',
                onlyOnRoot:true
            },
        },
    }
}
