import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DataTable } from './DataTable';

const getDisplayName = (user) => `${user?.firstName || 'Usuario'} ${user?.lastName || ''}`.trim();

const sampleUsers = [
  { id: 1, name: 'Emily Johnson', email: 'emily@prograweb.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Michael Reyes', email: 'michael@prograweb.com', role: 'Editor', status: 'Activo' },
  { id: 3, name: 'Sofia Torres', email: 'sofia@prograweb.com', role: 'Ventas', status: 'Pendiente' },
  { id: 4, name: 'Daniel Cruz', email: 'daniel@prograweb.com', role: 'Soporte', status: 'Activo' },
];

export const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const initials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`.toUpperCase();
  const [settings, setSettings] = useState({
    notifications: true,
    compactTable: false,
    autoReports: true,
  });

  const stats = [
    { label: 'Usuarios activos', value: '128', detail: '+12 este mes' },
    { label: 'Productos', value: '240', detail: 'Inventario sincronizado' },
    { label: 'Ventas', value: '$8.6K', detail: 'Resumen semanal' },
    { label: 'Reportes', value: '18', detail: 'Listos para revisar' },
  ];

  const renderDashboard = () => (
    <div className="dashboard-grid">
      {stats.map((stat) => (
        <article className="metric-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <p>{stat.detail}</p>
        </article>
      ))}

      <section className="panel-card wide-panel">
        <div className="section-heading">
          <div>
            <h3>Actividad reciente</h3>
            <p>Resumen general del sistema administrativo.</p>
          </div>
          <button className="btn-secondary small-button" onClick={() => setActiveTab('Reportes')}>
            Ver reportes
          </button>
        </div>
        <div className="activity-list">
          <span>Se actualizo el catalogo de productos.</span>
          <span>Nuevo usuario pendiente de revision.</span>
          <span>Reporte semanal generado correctamente.</span>
        </div>
      </section>

      <section className="panel-card">
        <h3>Accesos rapidos</h3>
        <div className="quick-actions">
          <button onClick={() => setActiveTab('Usuarios')}>Usuarios</button>
          <button onClick={() => setActiveTab('Productos')}>Productos</button>
          <button onClick={() => setActiveTab('Configuracion')}>Configuracion</button>
        </div>
      </section>
    </div>
  );

  const renderUsers = () => (
    <section className="panel-card">
      <div className="section-heading">
        <div>
          <h3>Usuarios</h3>
          <p>Gestion rapida de perfiles y permisos del sistema.</p>
        </div>
        <button className="btn-primary small-button">Nuevo usuario</button>
      </div>

      <div className="user-list">
        {sampleUsers.map((item) => (
          <div className="user-row" key={item.id}>
            <div className="user-avatar">{item.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{item.name}</strong>
              <span>{item.email}</span>
            </div>
            <span className="role-pill">{item.role}</span>
            <span className={`status-pill ${item.status === 'Activo' ? 'active-status' : 'pending-status'}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  const renderReports = () => (
    <div className="reports-grid">
      <section className="panel-card report-card">
        <span>Ventas</span>
        <strong>$24,850</strong>
        <div className="bar-chart">
          <i style={{ height: '42%' }}></i>
          <i style={{ height: '64%' }}></i>
          <i style={{ height: '52%' }}></i>
          <i style={{ height: '78%' }}></i>
          <i style={{ height: '88%' }}></i>
        </div>
      </section>

      <section className="panel-card report-card">
        <span>Conversion</span>
        <strong>72%</strong>
        <div className="progress-track">
          <div style={{ width: '72%' }}></div>
        </div>
        <p>Mejor rendimiento en productos destacados.</p>
      </section>

      <section className="panel-card wide-panel">
        <div className="section-heading">
          <div>
            <h3>Reportes disponibles</h3>
            <p>Documentos simulados listos para descargar o revisar.</p>
          </div>
        </div>
        <div className="report-list">
          <button>Reporte de inventario</button>
          <button>Reporte de usuarios</button>
          <button>Reporte mensual</button>
        </div>
      </section>
    </div>
  );

  const renderSettings = () => (
    <section className="panel-card settings-panel">
      <div className="section-heading">
        <div>
          <h3>Configuracion</h3>
          <p>Ajustes generales de la experiencia administrativa.</p>
        </div>
      </div>

      {[
        ['notifications', 'Notificaciones', 'Mostrar avisos importantes en la barra superior.'],
        ['compactTable', 'Tabla compacta', 'Reducir espacio vertical en listados largos.'],
        ['autoReports', 'Reportes automaticos', 'Preparar reportes cada semana.'],
      ].map(([key, title, description]) => (
        <label className="setting-row" key={key}>
          <div>
            <strong>{title}</strong>
            <span>{description}</span>
          </div>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={() => setSettings((current) => ({ ...current, [key]: !current[key] }))}
          />
        </label>
      ))}
    </section>
  );

  const renderContent = () => {
    if (activeTab === 'Usuarios') return renderUsers();
    if (activeTab === 'Productos') return <DataTable />;
    if (activeTab === 'Reportes') return renderReports();
    if (activeTab === 'Configuracion') return renderSettings();
    return renderDashboard();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-main">
        <Navbar
          user={user}
          activeTab={activeTab}
          onViewProfile={() => setShowProfile(true)}
        />

        <main className="dashboard-content">{renderContent()}</main>
      </div>

      {showProfile && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <button className="modal-close" onClick={() => setShowProfile(false)}>x</button>
            <div className="profile-hero">
              {user.image ? (
                <img src={user.image} alt="Perfil" className="profile-photo" />
              ) : (
                <div className="profile-photo profile-photo-fallback">{initials}</div>
              )}
              <div>
                <h2>{getDisplayName(user)}</h2>
                <p>Administrador del sistema</p>
              </div>
            </div>
            <div className="profile-details">
              <span><strong>Usuario</strong>{user.username || 'Sin usuario'}</span>
              <span><strong>Correo</strong>{user.email || 'Sin correo registrado'}</span>
              <span><strong>Telefono</strong>{user.phone || 'No disponible'}</span>
            </div>
            <button className="btn-primary" onClick={() => setShowProfile(false)}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
};
