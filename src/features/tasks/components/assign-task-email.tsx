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

interface AssignTaskEmailProps {
  taskDetailUrl: string;
  taskName: string;
  assignedBy: string;
}

export default function AssignTaskEmail({
  taskDetailUrl,
  taskName,
  assignedBy,
}: AssignTaskEmailProps) {
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
        <Preview>You’ve Been Assigned a Task in ADA Project</Preview>
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
              New Task Assigned
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
              You have been assigned a new task, <strong>{taskName}</strong>, by{" "}
              {assignedBy} in the ADA Project. To view the task details, please
              click the button below.
            </Text>
            <Container
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <Link
                href={taskDetailUrl}
                style={{
                  backgroundColor: "#005B99",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View Task Details
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
                This task link is valid for 24 hours.
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
              If you believe this task was assigned in error, please disregard
              this email or contact our support team immediately at{" "}
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
