type HeaderProps = {
  color: string;
};

export default function Header(color: HeaderProps) {
  return <div className={`text-${color.color} mb-[7rem]`}>degenask.me</div>;
}
