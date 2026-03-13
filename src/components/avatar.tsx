export const Avatar = ({ name, email }: { name?: string; email?: string }) => {
  const letter = (name?.[0] || email?.[0] || "?").toUpperCase();
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-cyan-600",
  ];
  const color = colors[(letter.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} text-sm font-semibold text-white`}
    >
      {letter}
    </div>
  );
};
