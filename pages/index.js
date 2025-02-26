
import { useState } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'SecretPassword124') {
      router.push('/gallery');
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none' }}>
          Submit
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default HomePage;