import { useState, type SubmitEvent } from 'react';

export default function Login() {

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    //console.log(event.target);
    //console.log(event.currentTarget);
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
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

    }catch (error) {
      console.error('Error during login:', error);
      setError('Network error. Please try again later.');
    }finally {
      setIsSubmitting(false);
    }

  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
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