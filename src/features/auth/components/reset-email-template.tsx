import * as React from "react";
import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Link,
} from "@react-email/components";

export default function ResetPasswordEmailTemplate(props: { url: string }) {
  const { url } = props;

  return (
    <Html lang="en">
      <Head />
      <Body
        style={{
          backgroundColor: "#F7FAFC",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Preview>Reset Your ADA Project Password</Preview>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#005B99",
              padding: "24px",
            }}
          >
            <Img
              src="https://i.imgur.com/ycEwfpW.png"
              alt="ADA Project Logo"
              width="60"
              height="60"
              style={{ margin: "0 auto", display: "block" }}
            />
          </Section>

          {/* Main Content */}
          <Section
            style={{
              padding: "32px",
            }}
          >
            <Heading
              style={{
                color: "#1A202C",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: "16px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              Reset Your Password
            </Heading>
            <Text
              style={{
                color: "#1A202C",
                fontSize: "16px",
                lineHeight: "24px",
                marginBottom: "24px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              We received a request to reset the password for your ADA Project
              account. To proceed, please click the button below to set a new
              password. This link is valid for 10 minutes.
            </Text>
            <Container
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <Link
                href={url}
                style={{
                  backgroundColor: "#005B99",
                  color: "#ffffff",
                  padding: "10px 32px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset Password
              </Link>
              <Text
                style={{
                  color: "#1A202C",
                  fontSize: "14px",
                  marginTop: "16px",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                }}
              >
                This password reset link is valid for 10 minutes.
              </Text>
            </Container>
            <Text
              style={{
                color: "#1A202C",
                fontSize: "14px",
                lineHeight: "24px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              If you did not request a password reset, please disregard this
              email or contact our support team. For your security, the ADA
              Project will never ask you to share your password, credit card, or
              banking details via email.
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#E2E8F0",
              padding: "24px",
              textAlign: "center",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Text
              style={{
                color: "#1A202C",
                fontSize: "12px",
                lineHeight: "20px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              This message was sent by the ADA Project. For support, contact us
              at{" "}
              <Link
                href="mailto:support@adaproject.com"
                style={{
                  color: "#005B99",
                  textDecoration: "none",
                }}
              >
                support@adaproject.com
              </Link>
              .
            </Text>
            <Text
              style={{
                color: "#1A202C",
                fontSize: "12px",
                lineHeight: "20px",
                marginTop: "8px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              &copy; 2025 ADA Project. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
