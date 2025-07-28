export default function MaximumSizeWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-4xl min-w-max mx-auto ${className}`}>{children}</div>
  );
}
