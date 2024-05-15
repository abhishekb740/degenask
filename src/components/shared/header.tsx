export default function Header({ color }: { color: string }) {
  return <div className={`text-${color} text-2xl font-title mb-20`}>degenask.me</div>;
}
