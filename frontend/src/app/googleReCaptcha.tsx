"use client";
import { ReCAPTCHA } from "react-google-recaptcha";
import React from "react";

export default function GoogleCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaKey: string | undefined =
    process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <ReCAPTCHA
      reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </ReCAPTCHA>
  );
}
