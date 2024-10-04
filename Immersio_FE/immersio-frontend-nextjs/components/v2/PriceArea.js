import Link from 'next/link';
import SignUp from '../Register/SignUp';
import { useTranslation } from 'next-i18next';

const CheckedSquareIcon = ({ size = 18, color = "#6C6B6B"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 18 18" version="1.1">
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Outlined" transform="translate(-103.000000, -4323.000000)">
      <g id="Toggle" transform="translate(100.000000, 4266.000000)">
        <g id="Outlined-/-Toggle-/-check_box" transform="translate(0.000000, 54.000000)">
          <g>
            <polygon id="Path" points="0 0 24 0 24 24 0 24" />
              <path d="M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z M19,19 L5,19 L5,5 L19,5 L19,19 Z M17.99,9 L16.58,7.58 L9.99,14.17 L7.41,11.6 L5.99,13.01 L9.99,17 L17.99,9 Z" id="🔹-Icon-Color" fill={color} />
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>);

const PriceArea = ({ step }) => {
  const { t } = useTranslation();

  return (
    <section className="price-section tw-pt-[60px] md:tw-pt-[140px] tw-pb-10 tw-bg-transparent">
      <div className="container tw-px-5 md:tw-px-0">
        {step === 1 ? (
          <>
            <div className="md:tw-flex tw-mb-[30px]">
              <div className="tw-flex-1 md:tw-pr-10">
                <h1 className="tw-text-[20px] md:tw-text-[30px] tw-text-center md:tw-text-left tw-m-0 tw-p-0">
                  {t('price.title')}
                </h1>
                <p className="tw-py-[20px] tw-text-base md:tw-text-[20px] tw-text-center md:tw-text-left">
                  {t('price.content')}
                </p>
              </div>
              <div className="price-deals tw-flex md:tw-w-1/2">
                <div className="deal">
                  <div className="deal-title">{t('price.plan.basic.title')}</div>
                  <div className="deal-price">{t('price.plan.basic.price')}</div>
                  <div className="deal-price-sub">{t('price.plan.basic.paid')}</div>
                  <div className="deal-action hidden md:tw-block">
                    <div className="genius-btn gradient-bg text-center text-uppercase ul-li-block bold-font my-4 disabled">
                      <Link className="navbar-brand text-uppercase" href="/price-register">
                        {t('price.plan.basic.btn')}
                      </Link>
                    </div>
                  </div>
                  <div className="deal-benefit">
                    <div>{t('price.plan.basic.content_01')}</div>
                    <div>{t('price.plan.basic.content_02')}</div>
                    <div>{t('price.plan.basic.content_03')}</div>
                    <div>{t('price.plan.basic.content_04')}</div>
                  </div>
                  <div className="deal-action md:tw-hidden">
                    <div className="genius-btn gradient-bg text-center text-uppercase ul-li-block bold-font my-4 disabled">
                      <Link className="navbar-brand text-uppercase" href="/price-register">
                        {t('price.plan.basic.btn')}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="deal active">
                  <div className="deal-title">{t('price.plan.pro.title')}</div>
                  <div className="deal-price">{t('price.plan.pro.price')}</div>
                  <div className="deal-price-sub">{t('price.plan.pro.paid')}</div>
                  <div className="deal-action tw-hidden md:tw-block">
                    <div className="genius-btn gradient-bg text-center text-uppercase ul-li-block bold-font my-4">
                      <Link className="navbar-brand text-uppercase" href="/price/register">
                        {t('price.plan.pro.btn')} 
                      </Link>
                    </div>
                  </div>
                  <div className="deal-benefit">
                    <div>{t('price.plan.pro.content_01')}</div>
                    <div>{t('price.plan.pro.content_02')}</div>
                    <div>{t('price.plan.pro.content_03')}</div>
                    <div>{t('price.plan.pro.content_04')}</div>
                    <div>{t('price.plan.pro.content_05')}</div>
                  </div>
                  <div className="deal-action md:tw-hidden">
                    <div className="genius-btn gradient-bg text-center text-uppercase ul-li-block bold-font my-4">
                      <Link className="navbar-brand text-uppercase" href="/price/register">
                        {t('price.plan.pro.btn')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul>
              <li className="tw-flex tw-items-center mb-8">
                <div className="tw-mr-2.5"><CheckedSquareIcon /></div>
                <div className="tw-text-[15px] leading-[18px] tw-text-[#6C6B6B]">{t('price.cancel')}</div>
              </li>
              <li className="tw-flex tw-items-center">
                <div className="tw-mr-2.5"><CheckedSquareIcon /></div>
                <div className="tw-text-[15px] leading-[18px] tw-text-[#6C6B6B]">{t('price.cancel_time')}</div>
              </li>
            </ul>
          </>
        ) : null}

        {step === 2 ? (
          <SignUp />
        ) : null}
      </div>
    </section>
  );
}

export default PriceArea;