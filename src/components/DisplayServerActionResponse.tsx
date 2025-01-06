"use client";
import { useState } from "react";

type Props = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
  onReset: () => void;
};

const MessageBox = ({
  type,
  content,
  onReset,
}: {
  type: "success" | "error";
  content: React.ReactNode;
  onReset: () => void;
}) => {
  const [visible, serIsVisible] = useState<boolean>(true);
  if (!visible) {
    return null;
  }
  const handleAnimationEnd = () => {
    serIsVisible(false);
    onReset();
  };
  return (
    <div
      className={`bg-accent px-4 py-3 relative border-red-500 ${
        type === "error" ? "text-red-500" : "text-green-500"
      }`}
    >
      {type === "success" ? "🎉" : "🚨"}
      {content}
      <div
        className={`absolute bottom-0 left-0 h-1 animate-shrinkBar ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};
export default function DisplayServerActionResponse({
  onReset,
  result,
}: Props) {
  const { data, serverError, validationErrors } = result;
  return (
    <>
      {data?.message && (
        <MessageBox
          type="success"
          content={`Success: ${data.message}`}
          onReset={onReset}
        />
      )}
    </>
  );
}
