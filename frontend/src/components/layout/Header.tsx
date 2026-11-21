interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>Dashboard</h1>
        <p>Manage certificate issuance workflow</p>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}