const { SESv2Client } = require("@aws-sdk/client-sesv2");

const sesClient = new SESv2Client({
    region: process.env.AWS_REGION || "ap-southeast-2"
});

module.exports = sesClient;