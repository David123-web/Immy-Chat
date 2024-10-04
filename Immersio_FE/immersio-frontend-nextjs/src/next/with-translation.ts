import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Options = {
  locale: string | undefined
  localeNamespaces: string[]
}

// by default, we provide all the translations available
// if they get very big, you could pick only the ones actually used on the page
// we recommend to always pick at least "common" by default
const DEFAULT_OPTIONS: Options = {
  locale: 'en',
  localeNamespaces: [
    'common',
  ]
}

/**
 * @name withTranslationProps
 * @param options
 * @description This server side props pipe is to be used for any page that
 * is using i18n; otherwise, the translation strings won't be loaded
 */
export async function withTranslationProps(options?: Partial<Options>) {
  const { localeNamespaces, locale } = mergeOptions(options)
  const translation = await serverSideTranslations(locale, localeNamespaces)

  return {
    props: {
      ...translation
    }
  }
}

function mergeOptions(options?: Partial<Options>) {
  return {
    locale: options?.locale ?? (DEFAULT_OPTIONS.locale as string),
    localeNamespaces: [
      ...(options?.localeNamespaces ?? []),
      ...DEFAULT_OPTIONS.localeNamespaces
    ]
  }
}
