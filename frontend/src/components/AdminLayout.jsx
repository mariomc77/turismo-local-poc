import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div></div>

          <div className="admin-user">
            <span>Hola, {user?.name || "Admin Local"}</span>

            {user?.picture ? (
              <img src={user.picture} alt="Admin" />
            ) : (
              <div className="admin-avatar">A</div>
            )}

            <button className="admin-icon-button">↪</button>
          </div>
        </header>

        <main className="admin-content">{children}</main>

        <footer className="admin-footer">
          © 2026 Turismo Local POC. Costa Rica.
        </footer>
      </div>
    </div>
  );
}