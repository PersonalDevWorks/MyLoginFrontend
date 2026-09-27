import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setIsLoggedIn(false);
    //console.log(event.target);
    //console.log(event.currentTarget);
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setIsLoggedIn(true);
      navigate('/dashboard'); // Navigate to the dashboard page after successful login
    }catch (error) {
      console.error('Error during login:', error);
      setError('Network error. Please try again later.');
    }finally {
      setIsSubmitting(false);
      console.log('Login process completed.');
    }

  }


  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:
            <input type="email" id="username" name="username" autoComplete="username" required />
          </label>
        </div>
        <div>
          <label htmlFor="password">Password:
            <input type="password" id="password" name="password" autoComplete="current-password" required />
          </label>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}