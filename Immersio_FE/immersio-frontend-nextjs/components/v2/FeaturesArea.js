import { Tabs } from "antd";
import TabPane from "antd/lib/tabs/TabPane";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import CreatorTab from "./component/CreatorTab";
import ImmyTab from "./component/ImmyTab";
import TutorTab from "./component/TutorTab";

const FeatureArea = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('creator');

  return (
    <div className="feature-wrapper">
      <div className="feature-tabs">
        <div className="container">
          <div className="tw-hidden md:tw-block">
              <Tabs activeKey={active} onChange={(key) => setActive(key)}>
                <TabPane tab={t('features.tabs.content_library')} key="creator" />
                <TabPane tab={t('features.tabs.immy_chat')} key="immy" />
                <TabPane tab={t('features.tabs.tutor_match')} key="tutor" />
              </Tabs>
          </div>
          <div className="tw-flex md:tw-hidden tw-justify-center tw-pt-4">
            <a className={`tw-w-[30%] tw-text-sm ${active === 'creator' ? 'color-theme-3' : 'color-theme-2'} tw-text-center tw-py-2 
            tw-relative tw-mr-2`} onClick={() => setActive('creator')}>
              {t('features.tabs.content_library')}
              <div className={`tw-absolute tw-content-[''] tw-h-[3px] tw-w-full tw-rounded ${active === 'creator' ? 'bg-theme-3' : 'bg-theme-2'} tw-bottom-[-5px]`} />
            </a>
            <a className={`tw-w-[30%] tw-text-sm ${active === 'immy' ? 'color-theme-3' : 'color-theme-2'} tw-text-center tw-py-2 
            tw-relative tw-mr-2`} onClick={() => setActive('immy')}>
              {t('features.tabs.immy_chat')}
              <div className={`tw-absolute tw-content-[''] tw-h-[3px] tw-w-full tw-rounded ${active === 'immy' ? 'bg-theme-3' : 'bg-theme-2'} tw-bottom-[-5px]`} />
            </a>
            <a className={`tw-w-[30%] tw-text-sm ${active === 'tutor' ? 'color-theme-3' : 'color-theme-2'} tw-text-center tw-py-2 
            tw-relative tw-mr-2`} onClick={() => setActive('tutor')}>
              {t('features.tabs.tutor_match')}
              <div className={`tw-absolute tw-content-[''] tw-h-[3px] tw-w-full tw-rounded ${active === 'tutor' ? 'bg-theme-3' : 'bg-theme-2'} tw-bottom-[-5px]`} />
            </a>
          </div>
        </div>
      </div>

      {
        {
          "creator": <CreatorTab t={t} />,
          "immy": <ImmyTab t={t} />,
          "tutor": <TutorTab t={t} />
        }[active] || null
      }
    </div>
  )
}

export default FeatureArea