import dbConnect from '@/lib/mongodb';
import ValentinePageModel from '@/models/ValentinePage';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { pageId, response } = await request.json();

    if (!pageId || !response) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get page data to get creator's email
    await dbConnect();
    const page = await ValentinePageModel.findOne({ pageId });

    if (!page) {
      return Response.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    // Create email transport
    const transport = nodemailer.createTransport({
      host: 'smtp.zeptomail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.ZEPTOMAIL_SMTP_USER,
        pass: process.env.ZEPTOMAIL_SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    // Determine email content based on response
    const responseEmojis = {
      yes: '🎉💕',
      no: '😢💔',
      maybe: '🤔💭',
    };

    const responseMessages = {
      yes: `${page.toName} said YES! 🎉`,
      no: `${page.toName} declined... 😢`,
      maybe: `${page.toName} needs more time to think 🤔`,
    };

    const responseSubjects = {
      yes: `Great news! ${page.toName} said YES to your Valentine request! 💕`,
      no: `Update: ${page.toName} responded to your Valentine request`,
      maybe: `${page.toName} is thinking about your Valentine request`,
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Valentine Response</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); min-height: 100vh;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: white; font-size: 32px;">
                        ${responseEmojis[response]}
                      </h1>
                      <p style="margin: 10px 0 0; color: white; font-size: 18px; font-weight: bold;">
                        Valentine Response Notification
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #333; font-size: 24px; text-align: center;">
                        ${responseMessages[response]}
                      </h2>
                      
                      <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                        Hi ${page.fromName},
                      </p>
                      
                      <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                        ${
                          response === 'yes'
                            ? `Amazing news! ${page.toName} has accepted your Valentine request! 💖 They clicked YES on your special page. Time to celebrate! 🎊`
                            : response === 'maybe'
                            ? `${page.toName} has responded to your Valentine page and said they need some time to think about it. Don't worry, sometimes the best things are worth waiting for! 💕`
                            : `${page.toName} has responded to your Valentine page. While this might not be the answer you were hoping for, remember that expressing your feelings takes courage and that's something to be proud of. 💪`
                        }
                      </p>
                      
                      ${
                        page.message
                          ? `
                      <div style="background: #ffeef8; border-left: 4px solid #ff69b4; padding: 20px; margin: 20px 0; border-radius: 8px;">
                        <p style="margin: 0; color: #666; font-size: 14px; font-style: italic;">
                          Your message to them:
                        </p>
                        <p style="margin: 10px 0 0; color: #333; font-size: 16px;">
                          "${page.message}"
                        </p>
                      </div>
                      `
                          : ''
                      }
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://valink.app'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                          Create Another Valentine Page
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                      <p style="margin: 0; color: #999; font-size: 12px;">
                        This email was sent because someone responded to your Valentine page on Valentine Link Generator
                      </p>
                      <p style="margin: 10px 0 0; color: #999; font-size: 12px;">
                        ${new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send notification email to creator
    await transport.sendMail({
      from: `"Valentine Link Generator" <${process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@valink.app'}>`,
      to: page.email,
      subject: responseSubjects[response],
      html: emailHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Notification email error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
