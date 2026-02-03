import nodemailer from 'nodemailer';

// Create ZeptoMail SMTP transport
const createTransport = () => {
  if (!process.env.ZEPTOMAIL_SMTP_USER || !process.env.ZEPTOMAIL_SMTP_PASS) {
    console.error('ZeptoMail SMTP credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.zeptomail.com',
    port: 587,
    secure: false, // use STARTTLS
    requireTLS: true, // force TLS
    auth: {
      user: process.env.ZEPTOMAIL_SMTP_USER,
      pass: process.env.ZEPTOMAIL_SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false, // accept self-signed certificates
    },
  });
};

export async function sendValentineEmail({ to, fromName, toName, pageUrl }) {
  const transport = createTransport();
  
  if (!transport) {
    console.error('Email transport not configured. Missing SMTP credentials');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    // Dynamic import of email template
    const { render } = await import('@react-email/components');
    const ValentineEmail = (await import('@/emails/ValentineEmail')).default;
    
    const emailHtml = await render(
      ValentineEmail({ pageUrl, fromName, toName })
    );

    const mailOptions = {
      from: `"Valentine Link Generator" <${process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@valink.app'}>`,
      to: to,
      subject: `Your Valentine page for ${toName} is ready! 💘`,
      html: emailHtml,
    };

    const info = await transport.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}
