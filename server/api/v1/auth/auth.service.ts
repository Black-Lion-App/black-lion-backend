import { User } from "../../../models";
import jwt from "jsonwebtoken";
import { IloginResponse } from '../../../../types/auth';
import { MailDataRequired } from "@sendgrid/mail";
import { MailService } from "../../../services/mail.service";

export class AuthService {

    constructor() { }

    login(credentials): Promise<IloginResponse> {
        return new Promise(async (resolve, reject) => {
            const { email, password } = credentials;
            try {

                let user = null;
                user = await User.findOne({ email });
                if (!user) {
                    user = await User.findOne({ username: email });
                    if(!user) {
                        user = await User.findOne({ phone: email });
                        if(!user) {
                            return reject({ message: 'User not exists', code: 401 });
                        }
                    }
                }
                const passwordIsValid = (user as any).authenticate(password);
                if (!passwordIsValid) {
                    return reject({ message: 'Email or Password invalid!', code: 401 });
                }
                const token = jwt.sign({ id: user.id }, 'bezkoder-secret-key', {
                    expiresIn: 604800, // 1 week hours
                    algorithm: 'HS256'
                });
                resolve({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    phone: user.phone,
                    accessToken: token,
                    date: user.date
                })
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async forgotPassword({ email }, host) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return reject({ message: 'No user found with that email address', code: 401 });
                }
                const token = jwt.sign({ id: user.id }, 'bezkoder-secret-key', {
                    expiresIn: 7200, // 2 hours
                    algorithm: 'HS256'
                });
                user.resetPasswordToken = token;
                user.save();
                // TODO: send email to the user
                const mailOptions: MailDataRequired = {
                    to: user.email,
                    from: 'bezkoder-secret-key',
                    subject: 'Password Reset',
                    html: '<h3>You are receiving this because you (or someone else) have requested the reset of the password for your account.</h3>' +
                        '<h3>Please click on the following link, or paste this into your browser to complete the process:</h3> <br/>' +
                        `<a href="${host}/reset-password?token=${token}">Click Here !!!</a> <br/> <br/>` +
                        '<h3>If you did not request this, please ignore this email and your password will remain unchanged.</h3> <br/>'
                };
                const mailService = new MailService();
                mailService.sendEmail(mailOptions)
                    .then((success) => {
                        resolve(success);
                    })
                    .catch((error) => {
                        reject(error)
                    });
            } catch (err) {
                reject(err);
            }
        })
    }

    resetPassword(token, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ resetPasswordToken: token });
                if (!user) {
                    return reject({ message: 'Unauthorized reset password request', code: 401 });
                }
                user.password = password;
                user.resetPasswordToken = undefined;
                user.save();
                const mailOptions: MailDataRequired = {
                    to: user.email,
                    from: '',
                    subject: 'Password Reset',
                    html: '<h3>Hello,</h3>' +
                        '<h3>This is a confirmation that the password for your account ' + user.email + ' has just been changed.</h3>'
                };
                const mailService = new MailService();
                mailService.sendEmail(mailOptions)
                    .then((success) => {
                        resolve(success);
                    })
                    .catch((error) => {
                        reject(error)
                    });
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default new AuthService();
