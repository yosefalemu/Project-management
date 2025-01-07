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
      className={`bg-accent/50 w-full px-4 py-3 relative border-red-500 ${
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

function mapErrorToMessage(error: string): string {
  if (
    error
      .toLowerCase()
      .includes("duplicate key value violates unique constraint") &&
    error.toLowerCase().includes("email")
  ) {
    return "Email already exists. Please use a different email.";
  }
  if (
    error
      .toLowerCase()
      .includes("duplicate key value violates unique constraint") &&
    error.toLowerCase().includes("phone")
  ) {
    return "Phone number already exists. Please use a different phone number.";
  }
  if (
    error.toLowerCase().includes("error connecting to database: fetch failed")
  ) {
    return "Network error. Please check your connection.";
  }

  const errorMessages: Record<string, string> = {
    "violates foreign key constraint":
      "Invalid reference. Please check your input.",
    "null value in column": "A required field is missing. Please fill it in.",
    "invalid input syntax": "Invalid input format. Please correct your data.",
    default: "An unexpected error occurred. Please try again later.",
  };

  for (const key in errorMessages) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return errorMessages[key];
    }
  }

  return errorMessages.default;
}

export default function DisplayServerActionResponse({
  onReset,
  result,
}: Props) {
  const { data, serverError, validationErrors } = result;
  console.log("SEREVER ERROR", serverError);
  console.log("VALIDATION ERROR", validationErrors);
  return (
    <div>
      {data?.message && (
        <MessageBox
          type="success"
          content={`Success: ${data.message}`}
          onReset={onReset}
        />
      )}
      {serverError && (
        <MessageBox
          type="error"
          content={mapErrorToMessage(serverError)}
          onReset={onReset}
        />
      )}
      {validationErrors && (
        <MessageBox
          type="error"
          content={Object.keys(validationErrors).map((key) => (
            <p key={key}>{`${key}: ${
              validationErrors[key as keyof typeof validationErrors]?.join(
                ", "
              ) || "Invalid input"
            }`}</p>
          ))}
          onReset={onReset}
        />
      )}
    </div>
  );
}
