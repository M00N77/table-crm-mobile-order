type PageHeaderProps = {
  isConnected: boolean;
};

export function PageHeader({ isConnected }: PageHeaderProps) {
  return (
    <header className="mb-3 rounded-xl border bg-[var(--card)] px-4 py-4 shadow-[var(--shadow-soft)]" style={{ borderColor: "var(--border)" }}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--mint-text)]">tablecrm.com</p>
      <h1 className="mt-1 text-2xl font-semibold text-[var(--text)]">Мобильный заказ</h1>
      <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">WebApp для создания продажи и проведения в один клик.</p>
      <span
        className="mt-2 inline-flex rounded-full px-2 py-1 text-[10px]"
        style={{ backgroundColor: "var(--mint-soft)", color: "var(--mint-text)" }}
      >
        {isConnected ? "Касса подключена" : "Касса не подключена"}
      </span>
    </header>
  );
}
