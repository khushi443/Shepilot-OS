// Small deterministic avatar: shows the user's photo if they have one,
// otherwise their initial on a soft brand-colored circle.
export default function Avatar({ user, size = 36 }) {
  const label = user?.displayName || user?.email || "";
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: "var(--sp-primary-soft)",
        color: "var(--sp-primary-dark)",
        fontSize: size * 0.42,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
