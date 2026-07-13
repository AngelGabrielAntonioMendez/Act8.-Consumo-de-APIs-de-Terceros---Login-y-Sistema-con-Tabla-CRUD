import { useState } from 'react';

const initialRegisterData = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('registeredUsers')) || [];
  } catch {
    return [];
  }
};

export const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [registeredUsers, setRegisteredUsers] = useState(getStoredUsers);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setErrorMsg('');
    setSuccessMsg('');
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!username.trim()) errors.username = 'El correo o usuario es obligatorio.';
    if (!password.trim()) errors.password = 'La contrasena es obligatoria.';

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const localUser = registeredUsers.find(
      (user) =>
        (user.username === username.trim() || user.email === username.trim()) &&
        user.password === password
    );

    if (localUser) {
      onLogin({
        id: localUser.id,
        firstName: localUser.firstName,
        lastName: localUser.lastName,
        username: localUser.username,
        email: localUser.email,
        phone: localUser.phone,
      });
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Usuario o contrasena incorrectos');
      }

      onLogin(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!recoveryEmail.trim()) errors.recoveryEmail = 'Ingresa tu correo de recuperacion.';
    if (recoveryEmail.trim() && !isValidEmail(recoveryEmail.trim())) {
      errors.recoveryEmail = 'Ingresa un correo valido.';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSentEmail(recoveryEmail.trim());
    setRecoveryEmail('');
    changeMode('resetSent');
  };

  const handleRegisterChange = (field, value) => {
    setRegisterData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const data = {
      firstName: registerData.firstName.trim(),
      lastName: registerData.lastName.trim(),
      email: registerData.email.trim(),
      username: registerData.username.trim(),
      phone: registerData.phone.trim(),
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    };

    const errors = {};
    if (!data.firstName) errors.firstName = 'El nombre es obligatorio.';
    if (!data.lastName) errors.lastName = 'El apellido es obligatorio.';
    if (!data.email) errors.email = 'El correo es obligatorio.';
    if (data.email && !isValidEmail(data.email)) errors.email = 'Ingresa un correo valido.';
    if (!data.username) errors.usernameRegister = 'El usuario es obligatorio.';
    if (!data.phone) errors.phone = 'El telefono es obligatorio.';
    if (!data.password) errors.passwordRegister = 'La contrasena es obligatoria.';
    if (data.password && data.password.length < 6) {
      errors.passwordRegister = 'La contrasena debe tener minimo 6 caracteres.';
    }
    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = 'Las contrasenas no coinciden.';
    }
    if (registeredUsers.some((user) => user.email === data.email || user.username === data.username)) {
      errors.email = 'Ya existe una cuenta con ese correo o usuario.';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newUser = {
      ...data,
      id: Date.now(),
    };
    const updatedUsers = [...registeredUsers, newUser];

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setUsername(data.username);
    setPassword('');
    setRegisterData(initialRegisterData);
    setSuccessMsg('Cuenta creada correctamente. Ahora puedes iniciar sesion.');
    changeMode('login');
    setSuccessMsg('Cuenta creada correctamente. Ahora puedes iniciar sesion.');
  };

  const renderTitle = () => {
    if (mode === 'forgotStart' || mode === 'forgotEmail') {
      return (
        <div className="titles">
          <h1>Recuperar</h1>
          <p>Elige como restablecer tu contrasena</p>
        </div>
      );
    }

    if (mode === 'resetSent') {
      return (
        <div className="titles">
          <h1>Revisa tu correo</h1>
          <p>Ya enviamos las instrucciones de recuperacion</p>
        </div>
      );
    }

    if (mode === 'register') {
      return (
        <div className="titles">
          <h1>Crear cuenta</h1>
          <p>Completa tus datos para registrarte</p>
        </div>
      );
    }

    return (
      <div className="titles">
        <h1>Bienvenido</h1>
        <p>Inicia sesion para continuar</p>
      </div>
    );
  };

  const renderLogin = () => (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        {successMsg && <div className="success-alert">{successMsg}</div>}
        {errorMsg && <div className="error-alert">{errorMsg}</div>}

        <div className="form-group">
          <label htmlFor="username">Correo electronico o Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: emilys"
            className={validationErrors.username ? 'input-error' : ''}
          />
          {validationErrors.username && <span className="error-text">{validationErrors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contrasena</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ej: emilyspass"
            className={validationErrors.password ? 'input-error' : ''}
          />
          {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" /> Recordarme
          </label>
          <button type="button" className="text-button forgot-password" onClick={() => changeMode('forgotStart')}>
            Olvidaste tu contrasena?
          </button>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>

      <div className="register-link">
        No tienes una cuenta?{' '}
        <button type="button" className="text-button" onClick={() => changeMode('register')}>
          Registrate
        </button>
      </div>
    </>
  );

  const renderForgotStart = () => (
    <div className="login-form">
      <p className="muted-text">
        Si llegaste aqui por error puedes regresar al login. Si necesitas recuperar tu acceso,
        solicita un enlace a tu correo.
      </p>

      <div className="option-panel">
        <strong>Opciones de recuperacion</strong>
        <span>Selecciona que quieres hacer ahora.</span>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => changeMode('login')}>
          Regresar al login
        </button>
        <button type="button" className="btn-primary" onClick={() => changeMode('forgotEmail')}>
          Recuperar con correo
        </button>
      </div>
    </div>
  );

  const renderForgotEmail = () => (
    <form onSubmit={handleRecoverySubmit} className="login-form">
      <p className="muted-text">
        Escribe el correo asociado a tu cuenta y te enviaremos un enlace para restablecer tu contrasena.
      </p>

      <div className="form-group">
        <label htmlFor="recoveryEmail">Correo de recuperacion</label>
        <input
          type="email"
          id="recoveryEmail"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
          placeholder="Ej: usuario@correo.com"
          className={validationErrors.recoveryEmail ? 'input-error' : ''}
        />
        {validationErrors.recoveryEmail && <span className="error-text">{validationErrors.recoveryEmail}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => changeMode('login')}>
          Regresar al login
        </button>
        <button type="submit" className="btn-primary">
          Enviar enlace
        </button>
      </div>
    </form>
  );

  const renderResetSent = () => (
    <div className="login-form">
      <div className="success-card">
        <strong>Enlace enviado</strong>
        <p>
          Enviamos un link para restablecer tu contrasena al correo
          {sentEmail ? ` ${sentEmail}` : ''}.
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={() => changeMode('login')}>
        Entendido
      </button>
    </div>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegisterSubmit} className="login-form register-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            id="firstName"
            value={registerData.firstName}
            onChange={(e) => handleRegisterChange('firstName', e.target.value)}
            placeholder="Ej: Emily"
            className={validationErrors.firstName ? 'input-error' : ''}
          />
          {validationErrors.firstName && <span className="error-text">{validationErrors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            id="lastName"
            value={registerData.lastName}
            onChange={(e) => handleRegisterChange('lastName', e.target.value)}
            placeholder="Ej: Johnson"
            className={validationErrors.lastName ? 'input-error' : ''}
          />
          {validationErrors.lastName && <span className="error-text">{validationErrors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo electronico</label>
        <input
          type="email"
          id="email"
          value={registerData.email}
          onChange={(e) => handleRegisterChange('email', e.target.value)}
          placeholder="Ej: usuario@correo.com"
          className={validationErrors.email ? 'input-error' : ''}
        />
        {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="usernameRegister">Usuario</label>
          <input
            type="text"
            id="usernameRegister"
            value={registerData.username}
            onChange={(e) => handleRegisterChange('username', e.target.value)}
            placeholder="Ej: emilys"
            className={validationErrors.usernameRegister ? 'input-error' : ''}
          />
          {validationErrors.usernameRegister && <span className="error-text">{validationErrors.usernameRegister}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefono</label>
          <input
            type="tel"
            id="phone"
            value={registerData.phone}
            onChange={(e) => handleRegisterChange('phone', e.target.value)}
            placeholder="Ej: 5551234567"
            className={validationErrors.phone ? 'input-error' : ''}
          />
          {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="passwordRegister">Contrasena</label>
          <input
            type="password"
            id="passwordRegister"
            value={registerData.password}
            onChange={(e) => handleRegisterChange('password', e.target.value)}
            placeholder="Minimo 6 caracteres"
            className={validationErrors.passwordRegister ? 'input-error' : ''}
          />
          {validationErrors.passwordRegister && <span className="error-text">{validationErrors.passwordRegister}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar</label>
          <input
            type="password"
            id="confirmPassword"
            value={registerData.confirmPassword}
            onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
            placeholder="Repite tu contrasena"
            className={validationErrors.confirmPassword ? 'input-error' : ''}
          />
          {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => changeMode('login')}>
          Regresar
        </button>
        <button type="submit" className="btn-primary">
          Crear cuenta
        </button>
      </div>
    </form>
  );

  const renderCurrentMode = () => {
    if (mode === 'forgotStart') return renderForgotStart();
    if (mode === 'forgotEmail') return renderForgotEmail();
    if (mode === 'resetSent') return renderResetSent();
    if (mode === 'register') return renderRegister();
    return renderLogin();
  };

  const isFullAuthView = mode !== 'login';
  const authViewClass = mode === 'register' ? 'auth-register-view' : 'auth-recovery-view';

  return (
    <div className="login-wrapper">
      <div className={`login-container ${isFullAuthView ? `auth-full-view ${authViewClass}` : ''}`}>
        <div className="login-form-section">
          <div className="login-form-card">
            <div className="logo-section">
              <span className="logo-icon">PW</span>
              <div className="logo-text">
                <strong>PROGRA WEB</strong>
                <span>Sistema Administrativo</span>
              </div>
            </div>

            {renderTitle()}
            {renderCurrentMode()}
          </div>
        </div>

        <div className="login-illustration">
          <div className="illustration-photo" aria-hidden="true"></div>
          <div className="illustration-content">
            <span className="eyebrow">Panel administrativo</span>
            <h2>Gestiona usuarios, datos y reportes desde un solo lugar.</h2>
            <p>Una experiencia clara para iniciar sesion y entrar directo al sistema.</p>

            <div className="dashboard-preview" aria-label="Vista previa del dashboard administrativo">
              <div className="preview-card preview-card-users">
                <span>Usuarios</span>
                <strong>128</strong>
              </div>
              <div className="preview-card preview-card-status">
                <span>Estado</span>
                <strong>Activo</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
