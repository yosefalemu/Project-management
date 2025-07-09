import Link from "next/link";

export const TestComponent = () => {
  return (
    <div>
      <h1>Home</h1>
        <p>This is a test component.</p>
      <Link href="/about">About</Link>
    </div>
  );
};
