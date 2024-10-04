export const verifyEmailTemplateInit = `
    Hi {{ first_name }} {{ last_name }}, <br/>
    Thank you for signing up with {{ website_title }}. Please click the link below to verify your email address. <br/>

    Link: {{ verification_link }} <br/>

    Thanks, <br/>
    {{ website_title }}
`;
