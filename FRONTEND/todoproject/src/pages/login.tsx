import React, { useState } from 'react';
import { useRouter } from 'next/router';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/tasks');
      } else {
        setShowError(true);
        console.error('Error en inicio de sesión:', response.statusText);
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-blue-500">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
        />
        {showError && (
          <div className="text-red-600 mb-4">Contraseña incorrecta. Inténtalo de nuevo.</div>
        )}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
