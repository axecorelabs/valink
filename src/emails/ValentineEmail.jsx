import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function ValentineEmail({ pageUrl, fromName, toName }) {
  return (
    <Html>
      <Head />
      <Preview>Your Valentine page is ready to share! 💘</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>💖</Heading>
            <Heading style={h2}>Your Valentine Page is Ready!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>
              Hi <strong>{fromName}</strong>! 👋
            </Text>
            
            <Text style={text}>
              Your special Valentine page for <strong>{toName}</strong> has been created
              and is ready to share! 🎉
            </Text>

            <Section style={linkBox}>
              <Text style={linkLabel}>Your shareable link:</Text>
              <Link href={pageUrl} style={linkUrl}>
                {pageUrl}
              </Link>
            </Section>

            <Section style={buttonContainer}>
              <Link href={pageUrl} style={button}>
                View Your Valentine Page 💕
              </Link>
            </Section>

            <Text style={text}>
              Share this link with {toName} via WhatsApp, Instagram, SMS, or any messaging app!
            </Text>
          </Section>

          {/* Tips Section */}
          <Section style={tipsSection}>
            <Heading style={h3}>💡 Quick Tips:</Heading>
            <Text style={tipText}>
              ✨ Your page will be active until <strong>February 15, 2026</strong>
            </Text>
            <Text style={tipText}>
              📱 Optimized for mobile - perfect for sharing on social media
            </Text>
            <Text style={tipText}>
              💝 The link is ready to use immediately!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Want to create another Valentine page?{' '}
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`} style={footerLink}>
                Click here
              </Link>
            </Text>
            <Text style={footerText}>
              Made with ❤️ for Valentine's Day 2026
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#fef2f2',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center',
  marginBottom: '40px',
};

const h1 = {
  fontSize: '64px',
  margin: '0 0 10px 0',
};

const h2 = {
  color: '#ec4899',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.3',
};

const h3 = {
  color: '#be185d',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '30px',
  marginBottom: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const linkBox = {
  backgroundColor: '#fce7f3',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '2px solid #f9a8d4',
};

const linkLabel = {
  color: '#9d174d',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const linkUrl = {
  color: '#ec4899',
  fontSize: '16px',
  fontWeight: '500',
  wordBreak: 'break-all',
  textDecoration: 'underline',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '9999px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)',
};

const tipsSection = {
  backgroundColor: '#fff7ed',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  borderLeft: '4px solid #fb923c',
};

const tipText = {
  color: '#78350f',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
};

const footer = {
  textAlign: 'center',
  paddingTop: '20px',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '8px 0',
};

const footerLink = {
  color: '#ec4899',
  textDecoration: 'underline',
};
