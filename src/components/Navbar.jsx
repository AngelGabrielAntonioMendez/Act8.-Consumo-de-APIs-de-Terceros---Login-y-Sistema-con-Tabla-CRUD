export const Navbar = ({ user, activeTab, onViewProfile }) => {
  const name = `${user?.firstName || 'Usuario'} ${user?.lastName || ''}`.trim();
  const initials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-title">
        <span>Panel Administrativo</span>
        <h2>{activeTab}</h2>
        <p>Bienvenido de nuevo, {name}.</p>
      </div>

      <div className="navbar-actions">
        <div className="search-bar">
          <input type="text" placeholder="Buscar usuarios, productos..." />
        </div>

        <button className="notification-icon" type="button" aria-label="Notificaciones">!</button>

        <div className="user-profile">
          {user.image ? (
            <img src={user.image} alt="Perfil" className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">{initials}</div>
          )}
          <div className="user-info">
            <strong>{name}</strong>
            <span>Administrador</span>
            <button type="button" onClick={onViewProfile}>Ver perfil</button>
          </div>
        </div>
      </div>
    </header>
  );
};
