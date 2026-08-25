import { useState, type SubmitEvent } from 'react';

type RegisterDataErrorType = {
  fname?: string;
  lname?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

function validateRegisterData(data: { fname: string; lname: string; username: string; password: string; confirmPassword: string }): RegisterDataErrorType {
  //validation logic should be added here
  const errors: RegisterDataErrorType = {};
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  /*
  ^
(?=.*[A-Z])       → must contain uppercase
(?=.*[a-z])       → must contain lowercase
(?=.*\d)          → must contain a number
(?=.*[!@#$...])   → must contain a special character
.{8,}             → at least 8 characters
$
*/

  if (!data.fname.trim()) {
    errors.fname = 'First name is required.';
  }
  if (!data.lname.trim()) {
    errors.lname = 'Last name is required.';
  }
  if (!data.username.trim()) {
    errors.username = 'Username is required.';
  }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.username)) {
    errors.username = 'Username must be a valid email address.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }else if (!passwordRegex.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  }else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterDataErrorType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    const userRegisterData = {
      fname: formData.get('fname')?.toString() ?? '' ,
      lname: formData.get('lname')?.toString() ?? '' ,
      username: formData.get('username')?.toString() ?? '' ,
      password: formData.get('password')?.toString() ?? '' ,
      confirmPassword: formData.get('confirmPassword')?.toString() ?? ''
    };

    console.log(userRegisterData);

    // Validation function should be added here
    const validationErrors = validateRegisterData(userRegisterData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fname: userRegisterData.fname,
          lname: userRegisterData.lname,
          username: userRegisterData.username,
          password: userRegisterData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error:', errorData.error);
        setError(errorData.error || 'Registration failed. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Registration successful:', data);

    }catch (error) {
      console.error('Error during registration:', error);
      setError('Network error. Please try again later.');
    }finally {
      setIsSubmitting(false);
      console.log('Registration process completed.');
    }

  }


  return (
    <div>
      <h1>SignUp Page</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="fname">First Name:
            <input type="text" id="fname" name="fname" autoComplete="given-name" required />
          </label>
          {fieldErrors.fname && <div style={{ color: 'red' }}>{fieldErrors.fname}</div>}
        </div>
        <div>
          <label htmlFor="lname">Last Name:
            <input type="text" id="lname" name="lname" autoComplete="family-name" required />
          </label>
          {fieldErrors.lname && <div style={{ color: 'red' }}>{fieldErrors.lname}</div>}
        </div>
        <div>
          <label htmlFor="username">Username:
            <input type="email" id="username" name="username" autoComplete="username" required />
          </label>
          {fieldErrors.username && <div style={{ color: 'red' }}>{fieldErrors.username}</div>}
        </div>
        <div>
          <label htmlFor="password">Password:
            <input type="password" id="password" name="password" autoComplete="new-password" required />
          </label>
          {fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:
            <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
          </label>
          {fieldErrors.confirmPassword && <div style={{ color: 'red' }}>{fieldErrors.confirmPassword}</div>}
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}