import { useStore } from "../store/useStore";

export default function Avatar() {
  const status = useStore((s) => s.status);

  return (
    <div className="avatar">
      <div className={`orb ${status}`}></div>
    </div>
  );
}