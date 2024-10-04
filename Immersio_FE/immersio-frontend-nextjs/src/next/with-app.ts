import { GetServerSidePropsContext } from 'next'
import { withTranslationProps } from './with-translation'

const DEFAULT_OPTIONS = {
  redirectPath: '/',
  locale: 'en',
  localeNamespaces: []
}

/**
 * @description A server props pipe to deny access to auth pages while logged in
 * For example, this is to be used in pages where logged-in users are not
 * supposes to see, like the sign in page
 * @param ctx
 * @param options
 */
export async function withTranslationsProps(
  ctx: GetServerSidePropsContext,
  options: Partial<typeof DEFAULT_OPTIONS> = DEFAULT_OPTIONS
) {
  const mergedOptions = getAppPropsOptions(ctx.locale, options)
  const { props: translationProps } = await withTranslationProps(mergedOptions)

  return {
    props: {
      ...translationProps
    }
  }
}

function getAppPropsOptions(
  locale: string | undefined,
  options: Partial<typeof DEFAULT_OPTIONS>
) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  return {
    ...mergedOptions,
    locale: locale ?? mergedOptions.locale
  }
}
