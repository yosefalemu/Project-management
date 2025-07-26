import * as React from "react";
import { Html, Button } from "@react-email/components";

export function VerifyEmailTemplate(props: { url: string }) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}
