export const Sidebar = ({ onLogout, activeTab, setActiveTab }) => {
  const menuItems = ['Dashboard', 'Usuarios', 'Productos', 'Reportes', 'Configuracion'];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-icon">PW</span>
        <div className="logo-text">
          <strong>PROGRA WEB</strong>
          <span>Sistema Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item} className={activeTab === item ? 'active' : ''}>
              <button type="button" onClick={() => setActiveTab(item)}>
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-logout-sidebar">
          Cerrar sesion
          <span>Volver al login</span>
        </button>
      </div>
    </aside>
  );
};
