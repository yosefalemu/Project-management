"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  data?: {
    message?: string;
  };
  error?: {
    message?: string;
  };
  routePath?: string;
  onReset?: () => void;
};

const MessageBox = ({
  type,
  content,
  routerPath,
  onReset,
}: {
  type: "success" | "error";
  content: React.ReactNode;
  routerPath?: string;
  onReset?: () => void;
}) => {
  const router = useRouter();
  const [visible, setIsVisible] = useState<boolean>(true);
  if (!visible) {
    return null;
  }
  const handleAnimationEnd = () => {
    setIsVisible(false);
    if (onReset) {
      onReset();
    }
    if (routerPath) {
      router.push(routerPath);
    }
  };
  return (
    <div
      className={`${
        type === "success" ? "bg-green-400" : "bg-red-500"
      } w-full px-4 py-3 relative text-white`}
    >
      {type === "success" ? "🎉" : "🚨"}
      <span className="ml-2">{content}</span>
      <div
        className={`absolute bottom-0 left-0 h-1 animate-shrinkBar ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

export default function DisplayServerActionResponse({
  onReset,
  data,
  routePath,
  error,
}: Props) {
  return (
    <div>
      {/* Show success message if there is one */}
      {data?.message && (
        <MessageBox
          type="success"
          content={data.message}
          onReset={onReset}
          routerPath={routePath}
        />
      )}

      {/* Show server error message if there's any error */}
      {error && <MessageBox type="error" content={error.message} />}
    </div>
  );
}
