import Link from "next/link"

const SideBarMobile = ({ t, show }) => {
  return show ? (
    <div className="md:tw-hidden tw-fixed tw-z-10 tw-top-[44px] tw-w-full tw-h-full bg-theme-7 tw-pt-4 tw-pl-7">
      <Link href={'/'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.home')}</a>
      </Link>
      <Link href={'/features'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.features')}</a>
      </Link>
      <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium tw-opacity-50">{t('header.menu.tutor_match')}</a>
      <Link href={'/pricing'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.pricing')}</a>
      </Link>
      <Link href={'/teach'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.become')}</a>
      </Link>
      <Link href={'/blog'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.blog')}</a>
      </Link>
      <Link href={'/contact'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.contact')}</a>
      </Link>
      <Link href={'/faq'}>
        <a className="tw-text-base color-theme-1 tw-block tw-mb-4 tw-font-medium">{t('header.menu.faq')}</a>
      </Link>
    </div>
  ) : null
}

export default SideBarMobile