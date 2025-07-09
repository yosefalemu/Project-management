import Link from "next/link";

export const TestComponent = () => {
  return (
    <div>
      <h1>Home</h1>
      <h2>test</h2>
      <Link href="/about">About</Link>
    </div>
  );
};
