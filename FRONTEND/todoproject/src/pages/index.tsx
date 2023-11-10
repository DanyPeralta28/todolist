import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  
  return (
    <div>Cargando...</div>
  );
};

export default Home;