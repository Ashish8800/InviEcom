const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const generatePdf = require("./PDF.helper");
require("dotenv").config();

function createGmailTransporter() {
  try {
    return nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );
  } catch (error) {
    print(
      "function: createGmailTransporter, file:helpers/Mail.helper.js, " +
        error.message
    );
    return false;
  }
}

const getHtmlFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const sendMail = async (payload) => {
  const mailTransporter = createGmailTransporter();
  if (!mailTransporter) return false;

  payload.from =
    payload.from ?? `${process.env.APP_NAME} <${process.env.SMTP_USER}>`;

  if (!payload.to && !payload.subject && !payload.message) {
    print("Required payload data is missing");
    return false;
  }

  payload.html = payload.message;

  try {
    const data = await mailTransporter.sendMail(payload);

    return data;
  } catch (error) {
    return false;
  }
};

const sendTemplateMail = (template, emailConfig = {}, data = {}) => {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      `${__dirname}/../assets/templates/${template}`,

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);

        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: emailConfig.to,
            subject: emailConfig.subject,
            html: template(data),
          },
          function (error, response) {
            console.log ("SMTP logserror :",error)
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
};

const passwordEmail = async (email, subject, text) => {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );
    readHTMLFile(
      __dirname + "/../public/passwordInMail.html",
      function (err, html) {
        let template = handlebars.compile(html);
        let replacements = {
          verificationcode: text,
        };
        let htmlToSend = template(replacements);
        let mailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: subject,
          html: htmlToSend,
        };
        mailTransporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            print(error);
          }
        });
      }
    );
  } catch (error) {
    print(error);
  }
};
// Send OTP start here
function sendOTP(email, otp) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/otp_email.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "OTP for email verification",
            html: template({
              templateHeading: "Email verification",
              templateText:
                "Email verification is required while creating an account. Please find your OTP below.",
              otpTxt: otp,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function welcome(email) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/welcome.tamplate.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Welcome to Inevitable Infotech",
            html: template({
              dashboardLink: "#",
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function sendForgetOTP(email, otp) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/otp_email.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Email verification of change password",
            html: template({
              templateHeading: "Email Verification",
              templateText:
                "Email verification is required while changing your account password. Please find your OTP below.",
              otpTxt: otp,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function sendInvite(data) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/team_invite.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);

        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: data.email,
            subject: `${data.invitedby} has invited you to collaborate on ${data.organization}`,
            html: template({
              join_team_link: data.joinLink,
              invitor_name: data.invitedby,
              organization_name: data.organization,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function userAccountCreate(data) {
  // Admin side
  // {
  //   to:"",
  //   dashboardLink:"",
  //   userName:"",
  //   userEmail:"",
  //   password:""
  // }

  let to = data.to;
  delete data.to;
  print(process.env.DASHBOARD_LINK);
  sendTemplateMail(
    "user_temp_password.template.html",
    {
      to,
      subject: `You are added as a member.`,
    },
    {
      dashboardLink: process.env.DASHBOARD_LINK ?? "",
      ...data,
    }
  );
}

function sendRestLinkToUser(data) {
  let to = data.to;
  delete data.to;

  sendTemplateMail(
    "rest_password.template.html",
    {
      to,
      subject: `Reset you password for InviEcom`,
    },
    {
      buttonLink: `${process.env.RESET_PAGE_LINK ?? ""}/${data.token}`,
      ...data,
    }
  );
}

module.exports = {
  sendMail,
  passwordEmail,
  sendOTP,
  welcome,
  sendForgetOTP,
  sendInvite,
  userAccountCreate,
  sendRestLinkToUser,
};
