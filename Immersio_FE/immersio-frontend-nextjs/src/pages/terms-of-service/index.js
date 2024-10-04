import Head from 'next/head';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '../../next/with-app';

function TermsOfServicePage() {
  const html = `
  <p class="ql-align-center">
  <strong style="font-size: 26pt; background-color: transparent;">TERMS AND CONDITIONS OF USE</strong>
</p>
<p class="ql-align-center">
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Last updated on&nbsp;</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">IMPORTANT: PLEASE READ THESE TERM AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS WEBSITE!</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">This website (“Site”) is owned and operated by Demo Learning Inc., a business operating under the laws of … province, Canada. In these Terms and Conditions of Use (“Terms”), “we”, “us” and “our” refer to Demo Learning Inc. the terms “you” or “your”
      refer to any individual user of our Site.&nbsp;</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">It is your responsibility to carefully read these Terms prior to using our Site or purchasing or accessing any of our services, products, content, webinars, courses, resources, members platforms, ebooks, or digital guides (collectively, “Services”).
      These Terms govern and define your use of the Site and Services and are legally binding on you.&nbsp;</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We reserve the right to update and change these Terms at any time and it is your responsibility to review these Terms periodically. You can review the most current version of our Terms at any time by visiting this page. Your continued use of or access
      to the Site and/or Services affirms your acceptance of any changes to our Terms.&nbsp;</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>USE OF OUR SITE AND SERVICES</u>
  </strong>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Acknowledgement and Consent to Terms</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">When you accessed our Site, you were given reasonable notice that these Terms existed. By accessing and continuing to use our Site and/or Services, and by actively clicking the acknowledgement box agreeing to these Terms and our Privacy Policy, you
      are legally bound to these Terms and our Privacy Policy whether or not you have read them.&nbsp; If you do not agree with any of our Terms, please discontinue use of our Site and Services immediately. If you wish to have any of your personal information
      and/or access to our Site removed, you may email us at hello@demolearning.com and we will make reasonable efforts to do so. More information about how we collect, process and store your personal information can be found in our Privacy Policy</span>
  <span
  style="font-size: 11.5pt; color: rgb(74, 134, 232); background-color: transparent;">demo.immersio.io/pages/privacy.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Minimum Age&nbsp;</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You warrant to us that you are at least 18 years old or the minimum legal age of majority in your province and/or country of residence to use our Site and/or Services. Using our Site and Services if you are under 18 years old or the minimum age in
      your province and/or country is a violation of use, and we reserve the right to terminate your access if it is discovered you are a minor.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Prohibited Behaviour</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">By using our Site, you agree not to misuse or tamper with our Site or Services, including but not limited to hacking, introducing viruses, trojans, worms, logic bombs or other technologically harmful material that would harm the functionality of,
      or jeopardize the security of our Site. We will immediately report any such breach or what we deem in our discretion to be harmful activities to the relevant law enforcement authorities. You agree to indemnify, defend and hold us harmless from
      any and all third-party claims, liability, damages and/or costs arising from your use and misuse of our Site and/or your breach of these Terms.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Updates and Changes to Site</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">While we aim to keep this Site as up-to-date as possible, we cannot guarantee that all content on our Site is entirely accurate, complete, or up to date. We reserve the right at any time to modify or discontinue, in whole or in part, any Services
      offered, or prices for Services on our Site, without notice, at any time. We are not liable to you or any third-party for any modification, price change, suspension or discontinuation of any Services.&nbsp;</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>FEES AND REFUNDS&nbsp;</u>
  </strong>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Fees</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Fees for our Services are as listed on our Site and are in US dollars. We reserve the right to change our Fees at any time and without notice.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Refunds</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We do not provide refunds. Any refunds issued will be in our sole discretion and determined on a case-by-case basis.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">No Chargebacks</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You acknowledge and agree that these Terms supersede the terms of use and refund policies of any third-party payment processor or platform used by us to administer the Services. You further agree to be responsible for any fees, including legal fees,
      incurred by us as a result of recouping payments owing to us as a result of your initiation of any chargeback.&nbsp;</span>
</p>
<p>
  <br>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>INTELLECTUAL PROPERTY AND OWNERSHIP OF RIGHTS</u>
  </strong>
</p>
<p class="ql-align-center">
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Intellectual Property Rights</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">All images, text, designs, graphics, page layouts, icons, videos, logos, taglines, trademarks, copyright and service marks (collectively, “Intellectual Property”) are owned by us, unless attributed otherwise. All content on the Site is proprietary
      to us.&nbsp;</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You are strictly prohibited, under any circumstance, to use our Intellectual Property in any way including re-posting or republishing any of our Intellectual Property to any third-party website or social media platform for any purpose whatsoever.&nbsp;&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Use of Materials&nbsp;&nbsp;</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">When as part of our Services, you are provided with certain materials for your personal use such as course workbooks and, downloadable templates, you acknowledge that you do not obtain any ownership interest or other rights to the materials and all
      copyrights and intellectual property remain with us. As a condition of your use of any materials provided to you through this Site or Services, you may not, under any circumstances, reproduce, copy, modify, sell or use such materials except as
      it was originally intended when it was provided by us to you.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Course, Guide or Program Use and License</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Subject to and in accordance with these Terms and any additional guidelines provided by us, upon purchasing a Course, Guide or Program (collectively, “Course”), we grant you a limited, non-transferable, non-assignable, non-exclusive, revocable license
      (“License”) to make individual use of the Course, including any Course updates. This License provides you the ability to view the Course in accordance with this License. Specifically, you may not modify, copy, reproduce, republish, upload, post,
      transmit, translate, sell, create derivative works, exploit or distribute in any manner or by any means (including by email, on any social media platform or other electronic means) any materials or content provided by us as part of the Course.
      You may however, from time to time, download and/or print the Course materials as needed for your personal and individual use only, and provided that you keep intact all copyright and other proprietary notices. You may not assign or transfer your
      obligations or rights granted under this section to any person at any time. We reserve the right at any time to revoke the License and terminate your access to the Course at any time if we, in our sole discretion, discover or determine that you
      have violated these Terms. We will make reasonable efforts to notify you of any violation of the Terms and the opportunity to remedy your violation. If, however, you fail to remedy the violation or continue to violate these Terms, we will terminate
      your access to the Course and you will not be entitled to any refund of fees.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Violations and Indemnity</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We take violations and infringement of our Intellectual Property rights seriously. We expressly reserve the right to take whatever legal steps necessary to protect and defend our Intellectual Property, and violators will be prosecuted to the fullest
      extent permissible by law. You agree to indemnify, defend and hold us harmless for any and all damages, costs and expenses, including legal fees, arising from your use of our Intellectual Property and our enforcement of our rights.&nbsp;</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>SECURITY&nbsp;</u>
  </strong>
</p>
<p class="ql-align-center">
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Security</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">If at any time you are required to create a username and password to access any Services, it is your responsibility to protect your username and password from theft or any other means of unauthorized use that would violate these Terms. If you become
      aware that your password has been compromised or your account has been breached, it is your responsibility to notify us immediately by sending an email to hello@demolearning.com.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Use of Third-Party Applications</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">In order to run our Site and provide our Services, we use a number of third-party applications for processing payment, delivering electronic newsletters, booking systems, delivering content, and tracking analytics. For more information as to how your
      personal information is collected, stored and processed, please refer to our Privacy Policy</span>
  <span style="font-size: 11.5pt; color: rgb(0, 0, 255); background-color: transparent;">demo.immersio.io/pages/privacy</span>
  <span style="font-size: 11.5pt; background-color: transparent;">. You understand that it is your responsibility to review the terms of use for any such third-party applications. If you do not agree with the terms of use for any third-party application used by our Site, please discontinue use of our Site and Services
      immediately.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Confidentiality</strong>
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You acknowledge that we have no duty of confidentiality to you, unless otherwise explicitly stated, such as in a subsequent client agreement, or as may be mandated by law or fiduciary duty.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Your Communication with Us</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Any communications made through our ‘contact’, blog, blog comments, newsletter sign up, or other related pages, or directly to our phone(s), mailing or email addresses, is not held privileged or confidential and may be subject to viewing and/or distribution
      by third-parties. We own any and all communications displayed on our Site, servers, comments, emails, social media, or other media as permitted under law and will not give credit or pay royalties for unsolicited user-generated content such as
      blog comments or emails. For more information on when and how we store and use your communications or any information provided by you in those communications, please refer to our Privacy Policy on this page demo.immersio.io/pages/privacy.&nbsp;&nbsp;</span>
</p>
<p>
  <br>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We maintain the right to republish any communication or submission, in whole or in part, as reasonably necessary in the course of our business. You agree not to submit any content or communications that contain sensitive information or that could
      be illegal or serve an unlawful purpose, including, but not limited to communications that are potentially libelous or maliciously false, obscene, abusive, negligent, or otherwise harmful or inappropriate. We reserve the right, in our sole discretion,
      to block your access to our Site and Services as a result of any such behaviour that we deem inappropriate.&nbsp;</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>ASSUMPTION OF RISK AND DISCLAIMERS&nbsp;</u>
  </strong>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Assumption of Risk</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You expressly acknowledge and assume all risk associated with your access to the Site and Services and any subsequent actions you choose to take, or not to take, as a result of the information, influence or educational materials provided to you.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Warranties Disclaimer</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We make no warranties as to our Site, the Services or any related materials. You agree that all Services and related materials are provided “as is” and without warranty of any kind either express or implied. To the fullest extent permissible pursuant
      to applicable law, we expressly disclaim all warranties, including, but not limited to, warranties of merchantability, fitness for a particular purpose and non-infringement.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">General</strong>
  <span style="font-size: 11.5pt; background-color: transparent;"></span>
  <strong style="font-size: 11.5pt; background-color: transparent;">Disclaimer</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">To the fullest extent permitted by law, we expressly exclude any liability for any direct, indirect, or consequential loss or damage incurred by you or others in connection with the use of our Site or the Services, including without limitation any
      liability for any accidents, delays, injuries, harm, loss, damage, death, lost profits, personal or business interruptions, misapplication of information, physical, mental, emotional, or spiritual injury or harm, loss of income or revenue, loss
      of business, loss of profits or contracts, anticipated savings, loss of data, loss of goodwill, and for any other loss or damage of any kind, however and whether caused by negligence, breach of contract, or otherwise, and whether foreseeable or
      unforeseeable.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Earnings Disclaimer</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You agree that you understand individual outcomes will vary. Case studies or testimonials are not indicative of guaranteed results. Each individual user approaches our Services with different backgrounds, disposable income levels, motivation, and
      other factors that are outside of our control. We cannot guarantee your success, business growth or financial gain, or increased social media following merely upon access of our Site or your use of Services.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Third Party Disclaimer</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You acknowledge and agree that we are not liable for any defamatory, offensive, or illegal conduct of any other participant or user, including you.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Technology Disclaimer&nbsp;</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We make reasonable efforts to provide you with modern, reliable technology, software, and platforms from which to access our Site and Services. In the event of a technological failure, you accept and acknowledge that we are not in any way responsible
      or liable for said failure and any resulting damages to you or your business. While we will make reasonable efforts to support you, some technological issues are outside our control and you may need to access support from a third-party provider.
      We do not warrant that the Site or Services will be functional, uninterrupted, correct, complete, appropriate, or error-free, that defects will be corrected, or that any part of the Site or Services are free of viruses or other harmful components.
      We do not warrant or make any representations regarding the use or the results of the use of our Site, Services or related materials, or on third-party websites in terms of their correctness, accuracy, timeliness, reliability, or otherwise.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">No Guarantees</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">While we may reference certain results, outcomes or situations on this Site or Services, you understand and acknowledge that we make no guarantee as to the accuracy of any third-party statements or the likelihood of success for you as a result of
      any statements or testimonials contained on our Site or as part of the Services.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Not Professional Advice</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We are not medical, legal, financial, or other government regulated professionals, or if we are, your use of our Site does not mean we are providing our professional services to you.&nbsp; You expressly acknowledge and agree that we are not acting
      in any professional capacity, including medical, legal, financial, or otherwise during the course of any Service. No part of our Site, the Service or any related content or materials are to be construed as medical, legal or financial advice. We
      expressly disclaim any and all responsibility for any actions or omissions you choose to make as a result of using this Site and/or Services.&nbsp;</span>
</p>
<p>
  <br>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">By visiting our Site, no registered dietitian – patient/client relationship is formed. We owe you no duty of confidentiality or other professional duty as a result of your use of our Site and/or Services, unless we have expressly agreed to enter into
      a registered dietitian – patient/client&nbsp; relationship with you.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Third-Party Contributors</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We may provide content to you written or presented by third-party contributors on our Site. While we make our best effort to ensure all of our writers or contributors are qualified in their industry and reflect our values, we make no guarantees of
      quality or accuracy.&nbsp; All written or visual content on the Site are opinion pieces and must not be interpreted as our opinion or as specific advice. We are not liable for any third-party contributors’ content or opinions. You must not rely
      on Site content or third-party contributors’ opinions and always seek the appropriate professional advice.</span>
</p>
<p class="ql-align-center">
  <strong style="font-size: 11.5pt; background-color: transparent;">
      <u>INDEMNIFICATION, LIMITATION OF LIABILITY, AND RELEASE OF CLAIMS</u>
  </strong>
</p>
<p class="ql-align-center">
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Release, Indemnity and Waiver</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Our Site and related materials are provided for educational and informational use only. You agree to indemnify release and save harmless Demo Learning Inc. and its agents, employees, contractors, volunteers, heirs, executors, administrators, successors,
      and assigns (collectively, “Released Parties”) for any direct or indirect loss or damage incurred as a result of your use of our Site, Services or any related communications, including as a result of any consequences incurred from technological
      failures such as a payment processor errors or technological malfunctions. You further waive any right you may have against the Released Parties and any legal recourse for any damages, costs, losses or expenses you may incur as a result of your
      use of the Site or Services. You acknowledge this release of liability is binding on your heirs, executors and anyone else who may be able to bring a legal action on your behalf in the future.</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Limitation of Liability</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We will not be held responsible or liable in any way for the information, products, or materials that you request or receive through or in relation to our Site or the Services. We do not assume liability for any third-party conduct, accidents, delays,
      harm, or other detrimental or negative outcomes as a result of your access of our Site and Services.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Affiliates</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">We may use affiliate links to sell certain products or services on our Site. In doing so, we disclaim any and all liability as a result of your purchase through one of the links, including but not limited to, the delivery, quality and safety of the
      purchased product or service. We will use reasonable efforts to notify you when and where we have placed affiliate links in addition to this disclaimer located in these Terms. You accept express liability for any and all consequences or benefits
      of clicking the affiliate links contained on our Site or related communications. You agree it is your obligation to read the terms and conditions for any affiliate site, services or products.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Termination of Your Use</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">If at any time we believe that you have violated these Terms, we shall immediately terminate your use of our Site, the Services and any related communications as we deem appropriate and in our sole discretion. At any time, we may block or revoke your
      access of our Site and Services without notice, and if necessary, block your IP address from further visits to our Site.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Full Agreement</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">You acknowledge that these Terms, together with our Privacy Policy constitute the full agreement relating to your use of the Site and Services.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Governing Law and Jurisdiction</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">These Terms as well as our Privacy Policy are governed by and interpreted in accordance with the laws of British Columbia and the federal laws of Canada where applicable. Any disputes arising directly or indirectly from this Agreement will be submitted
      and heard exclusively in the courts of British Columbia, Canada.&nbsp;</span>
</p>
<p>
  <br>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Dispute Resolution</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">If we are unable to resolve any dispute related to these Terms by informal negotiations, then any resolution of this dispute will be conducted by mediation prior to pursuing any other available remedy in relation to the dispute. The Parties may agree
      to virtual mediation, when available.</span>
</p>
<p>
  <br>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Severability</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">If any of the provisions of these Terms are found to be invalid, illegal or unenforceable, the validity, legality and enforceability of the remaining provisions will not, to the extent permitted by law, in any way be affected and will remain enforceable.</span>
</p>
<p class="ql-align-justify">
  <strong style="font-size: 11.5pt; background-color: transparent;">Survival</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">These Terms shall survive and will continue to be in full force and effect notwithstanding your decision to discontinue your use of our Site.&nbsp;</span>
</p>
<p class="ql-align-justify">
  <span style="font-size: 11.5pt; background-color: transparent;">&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">Waiver of Breach</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">The waiver by us of any breach of these Terms by you will not be taken to be a waiver of any of your future breaches. We reserve the right to exercise or enforce our rights at a later date.&nbsp;</span>
</p>
<p>
  <strong style="font-size: 11.5pt; background-color: transparent;">All Rights Reserved</strong>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">All rights not expressly set out and granted in these Terms and/or our Privacy Policy are reserved by Demo Learning Inc..</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">Contact</span>
</p>
<p>
  <span style="font-size: 11.5pt; background-color: transparent;">If you have any questions about these Terms, please send an email to:</span>
  <span style="font-size: 11.5pt; color: rgb(128, 0, 128); background-color: transparent;">hello@demolearning.com</span>
</p>
  `
  return (
    <>
      <style jsx global>{`
        .ql-align-center { text-align: center }
      `}</style>
      <Head>
        <title>Terms Of Service</title>
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

export default TermsOfServicePage