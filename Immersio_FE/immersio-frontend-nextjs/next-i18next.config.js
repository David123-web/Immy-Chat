const { resolve } = require('path')

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en'

/**
 * @type {import("next/dist/server/config-shared").I18NConfig}
 */
const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vn', 'fr', 'es'],
    localeDetection: false
  },
  trailingSlash: true,
  fallbackLng: {
    default: [DEFAULT_LOCALE]
  },
  localePath: resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development'
}

module.exports = config
