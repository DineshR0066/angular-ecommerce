import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendSellerCredentials(to: string, username: string, password: string) {
        await this.transporter.sendMail({
            from: `<${process.env.MAIL_USER}>`, to, subject: 'Your Seller Account Created',
            html: `
        <h2>Welcome</h2>
        <p>Seller account has been created.</p>

        <b>Login Credentials:</b>
        <ul>
          <li>Email: ${to}</li>
          <li>Username: ${username}</li>
          <li>Password: ${password}</li>
        </ul>
      `,
        });
    }

    async sendPasswordReset(to: string, link: string) {
        await this.transporter.sendMail({
            from: `<${process.env.MAIL_USER}>`, to, subject: 'Reset Your Password',
            html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
        });
    }

    async sendOrderConfirmation(to: string, orderDetails: { orderId: string, totalAmount: number, items: any }) {
        let itemsHtml = '';
        if (orderDetails.items && orderDetails.items.length > 0) {
            for (const item of orderDetails.items) {
                itemsHtml += `
                <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                    <strong>Product:</strong> ${item.name || 'N/A'}<br>
                    <strong>Quantity:</strong> ${item.quantity} | <strong>Price:</strong> $${item.price}
                </div>`;
            }
        } else {
            itemsHtml = '<p>No items found.</p>';
        }
        await this.transporter.sendMail({
            from: `"Your Store" <${process.env.MAIL_USER}>`,
            to,
            subject: `Order Confirmation - #${orderDetails.orderId}`,
            html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                <h2>Thank you for your purchase!</h2>
                <p>We've received your order and are getting it ready for shipment.</p>
                <hr />
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p><strong>Items:</strong> ${itemsHtml}</p>
                <p><strong>Total Amount:</strong> $${orderDetails.totalAmount.toFixed(2)}</p>
                <hr />
                <p>You can track your order status in your profile dashboard.</p>
                <p>Cheers,<br>The Team</p>
            </div>
        `,
        });
    }
}