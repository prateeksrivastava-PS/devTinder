
const { SendEmailCommand } = require("@aws-sdk/client-sesv2");
const sesClient = require("../config/aws");

const sendEmail = async ({ to, subject, body }) => {
    if (process.env.ENABLE_EMAIL !== "true") {
        console.log("Email sending is disabled");
        return { skipped: true };
    }

    try {
        const command = new SendEmailCommand({
            FromEmailAddress: process.env.SES_FROM_EMAIL,
            Destination: {
                ToAddresses: [to]
            },
            Content: {
                Simple: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF-8"
                    },
                    Body: {
                        Text: {
                            Data: body,
                            Charset: "UTF-8"
                        }
                    }
                }
            }
        });

        const response = await sesClient.send(command);

        console.log("Email sent successfully:", response.MessageId);

        return response;

    } catch (error) {
        console.error("SES Error:", error);
        throw error;
    }
};

module.exports = sendEmail;
