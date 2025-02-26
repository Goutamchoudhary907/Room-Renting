"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const dotenv_1 = __importDefault(require("dotenv"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
function sendEmail(emailData) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = {
            to: emailData.to,
            from: emailData.from,
            subject: emailData.subject,
            html: emailData.html,
        };
        try {
            const response = yield mail_1.default.send(msg);
            console.log('Email sent successfully to ', emailData.to);
            if (response && response[0]) {
                console.log("SendGrid Response:", response[0].statusCode);
            }
        }
        catch (error) {
            console.error("Error sending email: ", error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    });
}
