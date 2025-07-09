import Link from "next/link";

export const TestComponent = () => {
  return (
    <div>
      <h1>Home</h1>
      <h3>Tets</h3>
      <Link href="/about">About</Link>
    </div>
  );
};
