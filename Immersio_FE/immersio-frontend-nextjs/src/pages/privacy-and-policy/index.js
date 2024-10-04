import Head from 'next/head';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '../../next/with-app';

function PrivacyAndPolicyPage() {
  const html = `
    <p class="ql-align-center">
      <span style="font-size: 26pt; background-color: transparent;">PRIVACY POLICY&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Last Updated on …</span>
    </p>
    <p class="ql-align-center">
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;"><b>IMPORTANT: PLEASE READ THIS PRIVACY POLICY CAREFULLY BEFORE USING THIS WEBSITE!</b></span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">This Privacy Policy (“Policy”) governs how we at Demo Learning Inc. (“we”, “our” or “us”) collect, use, share and protect the personal information you provide to us when you access our website and/or mobile app (collectively, “Site”), purchase, access
      and/or download any products, courses, digital guides, and content (collectively, “Services”), or engage with us on social media. This Privacy Policy also sets out your rights with respect to your personal information that we collect. In this
      Privacy Policy “you” or “your” refers to any individual who accesses our Site or Services, or engages with us on social media.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">This Policy is legally binding. We reserve the right to update and change this Policy and will make our best effort to update the date “Last Updated” above each time we make changes. You can review our most recent changes by visiting this page. By
      continuing to use our Site, you waive specific notice of, and accept all changes to our Policy made from time to time. We encourage you to return to this page each time you access our Site or engage with us on social media, to ensure you have
      read our most recent Policy.&nbsp;</span>
    </p>
    <p class="ql-align-center">
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;"><b>INFORMATION WE COLLECT&nbsp;</b></span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We collect certain types of information from you when you visit our Site, access our Services, subscribe to our newsletter, fill out a form, download resources, make purchases, take a survey, or interact with us on social media. By accepting this
      Policy, you are specifically consenting to (i) our collection of information as described below; (ii) our use of the information collected (iii) the processing of this information; and (iv) our sharing of data with third-party processors as needed
      to run our business.</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Here are some examples of the data we collect. However, this may not be a complete list of information we collect:</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Personal Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Personally identifying information such as your name, billing and/or shipping address, telephone numbers, email addresses, and other demographic information, such as your age and gender.</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Financial Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Financial information (such as credit card and/or bank account numbers) in connection with any transaction you make on our Site. We store limited financial data, as most financial data is transferred to third-party payment processors we use. We strongly
      encourage you to review the privacy policy of Stripe, the third-party payment processor we use to process payment when you purchase anything from our Site. You can also email us at hello@demolearning.com and request a list of all third-parties
      with whom we share your information in order to run our Site and Services.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">User Account Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">In order to purchase or access certain Services, we may require you to create a user account and provide your name and/or email address and create a unique password. We collect data from our user accounts regarding products/services purchased, courses
      completed, and accounts created on the platform in order to personalize your experience, track your use and for other legitimate business reasons. For your security, we do not have access or knowledge of your password and it is your sole responsibility
      to keep the password confidential and not share your account details with any other people, including us.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Computer, Browser and Mobile Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Computer and connection information such as statistics on your page views, traffic to and from the Site, your unique resource locator (“URL”), advertisement data, your internet protocol (“IP”) address, your browsing history, and your Site log information.
      If you access our Site via your mobile phone, we may collect information about your device such as but not limited to, the model, manufacturer, device identification and your location information.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Social Media Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Information from any social media networking platforms and applications (“apps”) including, but not limited to, Instagram, Facebook, LinkedIn, YouTube, Twitter, Snapchat and Tik Tok, which may include your name, username on any of these platforms,
      location, email, age, gender, profile picture and any other public information you have included on any of your social media profiles. If you want to limit this data, you should review the policies and security settings of each social media service
      respectively.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Other Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">From time to time, you may voluntarily give us other information in order to complete a form, enter a contest or giveaway or to participate in a survey.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Sensitive Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We will not request sensitive information from you at any time. Please do not submit any sensitive data to us, whether via public postings, email correspondence with us, or any other method, including your social security number, health data, genetic
      data, or information related to your ethnic origin, religious beliefs, or criminal history. If you do send us this information, then by doing so you are consenting to our use, storage, and processing of this information in accordance with this
      Policy.&nbsp;</span>
    </p>
    <p class="ql-align-center">
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">HOW WE COLLECT YOUR INFORMATION&nbsp;</b>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Information You Voluntarily Provide</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We collect information you voluntarily and manually provide when you use our Site, such as when you purchase or access Services or certain content on our Site, sign up for our newsletter, submit a form, send us questions, or interact with us through
      this Site or on social media. Some of the information you manually provide may be personal information, such as your name or email address.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Information from Your Website Browser or Mobile Device</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We collect information that is sent to us automatically from your website browser or mobile device, such as your IP address, the name of your operating system, the name and version of your browser, date and time of your visit, page(s) you visit and
      length of time you spent on each page. The information we receive may depend on your browser or device settings. Information received from your website browser and mobile device typically is not, in and of itself, personally identifiable. However,
      we may combine it with other information in an attempt to identify you, or we may combine it with information that does identify you.</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Tracking Technologies</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We collect information when you visit our Site and through our email communications, by using cookies, pixels, website beacons, tags, and other tracking technologies to collect information about your engagement, as well as your browsing and purchasing
      behaviour. These tracking technologies include:</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Clickstream Data: Through Site access logs we collect your URL, clickstream data and HTTP protocol elements, which generate certain kinds of non-identifying Site usage data, such as the number of hits and visits to the Site.
      This information is used for internal purposes for research and development, user analysis and business decision making, all of which provides better services to our users. The statistics garnered, which contain no personal information and cannot
      be used to gather such information, may also be provided to third-parties for data processing and analyzing.</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Cookies: Cookies collect data sent to us by your computer about (i) the way you interact with our Site, such as when you use certain features or download attachments; (ii) collect data to assess and improve our marketing and
      advertising; (iii) allow partners and third-parties to use these tracking technologies to track your use of our Site, including on multiple devices; (iv) collect statistical data such as how long you stay on a certain webpage on our Site and the
      location from where you access our Site. All of this information helps us to improve the Services, provide content based on the interests of our users and improve the functionality of our Site. Most browsers are set to accept cookies by default.
      In addition, when you first encounter our Site, you will be asked to “consent to cookies.” If you wish to disable cookies, you may do so through your individual browser options. However, this may affect your ability to use or make purchases from
      our Site. More detailed information about cookie management with specific website browsers can be found at the browsers’ respective websites.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Website Beacons or Pixels. These are small graphics that help us understand browsing activity and provide a better user experience. Unlike cookies, website beacons and pixels are non-identifiable when you visit a website page.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Social Widgets. These buttons are provided by third-party social media providers that allow you to interact and access certain social media services when you view a page on our Site. These widgets may collect browsing data, which
      may be sent to the respective third-party social media provider.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Third Party Software. We may use third-party software to post advertisements on our Site to oversee marketing or email campaigns, or manage other business initiatives. These third-party softwares may use cookies or similar tracking
      technology. We have no control over these third-parties or their use of cookies. For more information on opting out of interest-based advertisements, you may visit the Digital Advertising Alliance of Canada Opt-Out Tool.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Website Analytics</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">From time to time, we may use third party analytic tools operated by third-party companies, such as but not limited to, Google Analytics. These analytic companies may also use cookies or other tracking technologies to analyze visitors’ use of our
      Site to determine the popularity of the content and better understand online activity. We do not transfer personal information to these third-party vendors. However, in order to access our Site, you are consenting to the collection and use of
      your information by these third-party analytic companies. We recommend that you review their respective privacy policies and contact them directly with any questions or requests to delete your information. If you do not want any of your information
      to be collected and used by tracking technologies, visit Digital Advertising Alliance of Canada Opt-Out Tool.</span>
    </p>
    <p class="ql-align-center">
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">USE AND DISCLOSURE OF YOUR INFORMATION&nbsp;</b>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Use of Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Generally, the purpose of collecting your information through this Site is to:</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Provide the information, content and Services you request;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Better understand your needs and interests;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Enter into a contract with you or carry out our contractual obligations to you;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Improve our Services;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Deliver any Services you request and/or purchase from our Site;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Process payments or refunds, where applicable;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Improve our marketing, advertising and promotional efforts;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Contact you with special offers, newsletters, information and content we believe will be of interest to you;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Correspond and request feedback from you;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Interact with you through our Site and social media;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Keep you updated as to new content, products, Services, or other changes on our Site;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Administer surveys, contests or giveaways;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Deliver a tailored and personalized experience for you when you visit our Site;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Prevent fraudulent activities and security breaches;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Improve the content, functionality and useability of this Site;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Collect statistical data and analyze trends for our use and for use by third-parties;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Resolve disputes and assist law enforcement when necessary;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Troubleshoot issues on our Site; and</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Comply in good faith with the law or court-order.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Retention of Information</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We generally retain your information only as long as is reasonably necessary to provide you with the Services, comply with our legal obligations or until you request that we delete your information. Any information we no longer need will be permanently
      deleted.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Processing Your Information</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Generally, we do not process or hold your information but instead we use third-party processors to process your data. In order to carry out our business, it is necessary for us to transmit certain information to third-parties. For instance, when you
      purchase a Service from our Site, your payment information may be collected by a third party, such as but not limited to, Stripe.&nbsp;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">In some instances, however, we may process your information internally. When you agree to be bound by our Policy, you consent to our processing of your information for such purposes to carry out our business interests.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Disclosure of Your Information</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We will not sell your information to any third-party. We may share your information with third-parties from time to time in certain situations and in order to carry out the following business operations:</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Administering our Site and various tasks such as payment processing, hosting services, email delivery, communications and customer service;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Delivery of our Services;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Administering your account;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Entering into agreements with you;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Communicating with you;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Analyzing data and trends, including partnering with third-party analytic companies such as but not limited to, Google Analytics;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Protecting the security of our business and Site;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Promoting and marketing the Site and Services;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; To protect our business, including to investigate and remedy any breach of any of our rights or policies, or as needed to obtain and maintain insurance coverage, manage risks, obtain financial or legal advice;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; In the event of sale or transfer of our business;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Comply with any requirements to disclose by law, such as to initiate or respond to any legal action or to protect the rights, property and safety of others. This includes sharing information with other parties to prevent security
      breaches, fraud or credit risks; and</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Any other reason necessary to comply with any legal obligation, to protect your interests, the interests of others or our business.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Third-Party Apps</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">The following is a list of Third-Party Applications we currently use on our Site and in delivering our Services:</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">· &nbsp; &nbsp; &nbsp; Google Analytics&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We confirm the above list may not be exhaustive, and we reserve the right to add, change, or stop using any Third-Party Applications at any time, without notice.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Information Storage</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">While our business is a Canadian business, our Site is hosted with servers located primarily in the United States. Accordingly, we may transmit your information outside of the province and/or country where you live and transferred data may be subject
      to the laws of those countries. If you reside in the European Union (“EU”), your information will be transferred internationally to those servers. We have taken all reasonable measures to ensure that we use website hosting servers and third-party
      processors located in Canada and the United States which have put in place appropriate safeguards to protect data once it is transferred to that country, however we make no guarantees. It is your responsibility to review all third-party applications’
      terms and policies, and to review website policies that you may be redirected to when using our Site.&nbsp;&nbsp;</span>
    </p>
    <p class="ql-align-center">
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">YOUR RIGHTS</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We respect your rights to your personal information and data. You have the right to access, correct, request restriction or deletion of your information, or request how we use your personal information and data collected, as required by applicable
      law. Upon receipt of any request relating to your privacy, we reserve the right to request that you first provide us with evidence of your identity before we take any action.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">After verification of identity, you have the right to:</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Confirm what information we have collected, and for what purposes;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Update or change any information you have provided to us;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Confirm whether we deliver your data to third-party processors, and for what purpose we deliver your data;&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Request a copy of your personal information in a structured, commonly used and machine-readable format;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">●&nbsp; &nbsp; &nbsp; Request we delete or restrict the processing of your information. Note that in the event you request us to delete your information, this may result in a termination of any user account you may have with us, and you may have limited
      or no use of our Site. Please also note that there are exceptions to this right, such as when we must keep your data if required by law or for our compliance with a legal obligation.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">If you wish to have any third-parties, including those to whom we’ve transmitted your information, delete your information, you will need to contact those third-parties directly to do so. Upon request, we will provide a list of all third parties to
      whom we have transmitted your information.</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Complaints</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">If you are an EU resident, you have the right to complain to a supervising authority if you believe we are misusing your information or have violated any of your rights under this Privacy Policy or applicable law. You may do so in the EU member state
      in which you reside or have your place of business or in which the alleged infringement took place. If you are located outside the EU, you may have rights under privacy laws in the jurisdiction where you live.</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Data Protection Plan&nbsp;</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We take steps to protect your data, however we provide no guarantee that your data is secure.&nbsp;</span>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We take all reasonable precautions to protect your information. When you submit information through our Site, your information is protected both online and offline. Wherever we collect information, that information is encrypted and transmitted to
      us by secure servers. We have included common indications of such secured features when appropriate, such as but not limited to a closed lock icon in your website browser. While we use encryption to protect sensitive information transmitted online,
      we also protect your information offline. Only our personnel who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computers/servers in which
      we store personally identifiable information are kept in a secure environment.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Opting out of Communication</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">At any time, you may opt out of communication from us, such as email newsletters, simply by clicking on the “unsubscribe” link in any email you receive from us. We reserve the right to maintain a database of past email subscribers and to use this
      information as reasonably necessary in our business and as provided by law. Your information will be shared with reasonably necessary parties for the ordinary course of conducting our business, such as through Facebook ads or other marketing campaigns.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Children’s Privacy</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">You must be at least 18 years old to use our Site, or the age of majority in the province and/or country that you reside. We do not knowingly collect, use or disclose personal information about visitors under 18 years of age. If you are under 18 years
      of age or the age of majority in the province and/or country where you reside, please do not use our Site. If you become aware that we have collected information from anyone under the age of 18 or the age of majority in their province and/or country
      where they reside please contact us at hello@demolearning.com so we may delete that information.&nbsp;</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Security of Your Information</b>
    </p>
    <p>
      <span style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">We take all reasonable steps to protect all information we collect and to keep it secure. We use recognized online secure payment systems, reputable third-party processors and implement generally accepted standards of security to protect against personal
      data loss or misuse. However, no security measure or method of data transmission can be guaranteed against interception or misuse. We do not guarantee complete security of any information you transmit to us. By consenting to this Privacy Policy,
      you acknowledge that your personal data may be available, via the internet, around the world. We cannot prevent the use or misuse of your data by other parties and you understand and accept this risk. We will notify you promptly of any known breach
      of our security systems or your information which might expose you to serious risk.</span>
    </p>
    <p>
      <b style="font-size: 10pt; color: rgb(25, 25, 25); background-color: transparent;">Contact us</b>
    </p>
    <ul>
      <li>
        <span style="font-size: 10pt; color: rgb(25, 25, 25);">If you have any questions about our Privacy Policy or wish to exercise any of your rights as set out in this Privacy Policy, please contact our dedicated data manager at</span>
        <span style="font-size: 10pt; color: rgb(220, 161, 13);">hello@demolearning.com</span>
        <span style="font-size: 10pt; color: rgb(25, 25, 25);">.</span>
      </li>
    </ul>
    </div>
  `
  return (
    <>
      <style jsx global>{`
        .ql-align-center { text-align: center }
      `}</style>
      <Head>
        <title>Privacy And Policy</title>
      </Head>

      <DefaultLayout hideSidebar>
        <>
          <div className="pt-150 pb-80">
            <div className="container">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </>
      </DefaultLayout>
    </>
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default PrivacyAndPolicyPage