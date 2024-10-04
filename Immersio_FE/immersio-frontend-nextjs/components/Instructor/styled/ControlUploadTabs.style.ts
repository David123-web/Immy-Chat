import css from 'styled-jsx/css'

export const ControlUploadTabsStyle = css.global`
  .control-upload-tabs.ant-tabs-card .ant-tabs-nav-wrap {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav { margin-bottom: 30px }
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav:before { display: none }
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
    border: 0 none;
    padding-top: 0;
    background-color: transparent;
  }
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
    border-bottom: 2px solid var(--tp-new_theme-4);
  }
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab:hover,
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active > div,
  .control-upload-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active > div:hover {
    color: var(--tp-new_theme-4);
  }
  .control-upload-tabs-btn {
    border: 0 none;
    width: 100%;
    background-color: var(--tp-new_theme-4);
    border-radius: 20px;
    color: var(--tp-new_theme-7);
    margin-top: 30px;
    min-height: 40px;
  }
  .control-upload-tabs-placeholder .input-placeholder {
    display: flex;
    align-items: center;
    background-color: var(--tp-new_theme-6);
    border-radius: 6px;
    padding: 5px;
    margin-bottom: 2px;
  }
  .control-upload-tabs-placeholder .input-placeholder div {
    background: var(--tp-new_theme-7);
    padding: 5px 15px;
    border-radius: 6px;
    margin-right: 10px;
  }
  .control-upload-tabs-placeholder .input-placeholder .name {
    padding: 5px 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .generate-audio {
    width: 100%;
    background-color: var(--tp-new_theme-3);
    color: var(--tp-new_theme-7);
    margin-bottom: 20px;
  }
  .control-upload-tabs-upload {
    width: 320px;
    min-width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .control-upload-tabs-upload > .ant-upload,
  .control-upload-tabs-upload > .ant-upload > span,
  .control-upload-tabs-upload > .ant-upload > span .mt-20 {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .control-upload-tabs-upload > .ant-upload > span .mt-20 .control-upload-tabs-placeholder {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .control-upload-tabs-upload > .ant-upload > span .mt-20 .control-upload-tabs-placeholder .input-placeholder {
    display: flex;
    width: 100%;
  }
`
