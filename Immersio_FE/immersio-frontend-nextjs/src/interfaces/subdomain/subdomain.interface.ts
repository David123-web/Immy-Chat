export interface IGetSubdomainConfigResponse {
  name:                 string;
  id:                   string;
  isActive:             boolean;
  expiredAt:            null;
  subdomainTheme:       SubdomainTheme;
  title:                string;
  description:          string;
  keyword:              string;
  setting:              Setting;
  subdomainSocialLinks: SubdomainSocialLink[];
}

export interface Setting {
  address:       string;
  contactNumber: string;
  email:         string;
  socialLinks:   null;
  supportLinks:  null;
}

export interface SubdomainSocialLink {
  id:          string;
  order:       number;
  icon:        string;
  url:         string;
  subdomainId: string;
}

export interface SubdomainTheme {
  id:              number;
  primaryColor:    string;
  secondaryColor:  string;
  accentColor:     string;
  backgroundColor: string;
  textColor:       string;
  logoUrl:         string;
  faviconUrl:      string;
  linkColor:       string;
}
