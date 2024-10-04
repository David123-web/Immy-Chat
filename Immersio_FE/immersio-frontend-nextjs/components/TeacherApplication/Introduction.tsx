import React from "react";

const Paragraph = (props: any) => (
  <div className="tw-mb-4">{props.children}</div>
);

const ParagraphHighlight = (props: any) => (
  <span className="tw-font-bold color-theme-3">{props.children}</span>
);

const IntroductionTeacherRegister = () => {
  return (
    <div className="tw-px-4 tw-font-medium tw-text-lg">
      <Paragraph>Thank you for registering with us.</Paragraph>
      <Paragraph>
        At IMMERSIO we believe that{" "}
        <ParagraphHighlight>
          "Any Language Can Be Learned And Spoken By Anyone".
        </ParagraphHighlight>
        <div></div>
      </Paragraph>
      <Paragraph>
        Our vision is to enable the language of every culture to be brought to life and easily accessible so that its knowledge and wisdom can always be learned and shared.
      </Paragraph>
      <Paragraph>
        To this end we are launching a digital all-in-one language learning platform that allows any instructor to:
        <div>
          {`1) quickly and simply create "interactive, contextual, conversational learning experiences"`}
        </div>
        <div>
          {`2) connect interested learners with qualified instructors worldwide`}
        </div>
        <div>
          {`3) foster opportunities for speakers to engage with language communities in meaningful ways, online or offline`}
        </div>
      </Paragraph>
      <Paragraph>
        <span className="tw-font-bold color-theme-3">
          What’s in it for you?
        </span>
      </Paragraph>
      <Paragraph>
        To this end, IMMERSIO is formally on-boarding a growing list of qualified language instructors and tutors who will have an insider opportunity to both generate a revenue stream for themselves and promote their expertise through our platform.
      </Paragraph>
      <Paragraph>
        In particular, qualified instructors will benefit from the ability to participate in the following:
        <div>
          {`1) Earn more income for personally tutoring interested language learners using our Tutor Match feature. `}
        </div>
        <div>
          {`2) Access to a growing knowledge base and community for teaching languages, which includes fellow instructors as well as other creators and power learners`}
        </div>
        <div>
          {`3) On occasion the opportunity to receive paid commission to further develop specific course or lessons you are qualified to teach, depending on creator needs and mutually agreed-upon expectations`}
        </div>
      </Paragraph>
      <Paragraph>
        If this sounds like you, please answer the following questions as succinctly as possible, and we will contact you shortly to follow up with next steps.
      </Paragraph>
    </div>
  );
};

export default IntroductionTeacherRegister;
