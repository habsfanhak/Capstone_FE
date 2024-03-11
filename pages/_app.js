import 'bootstrap/dist/css/bootstrap.min.css';
import MainNav from '@/components/MainNav';

export default function App({ Component, pageProps }) {
  return (<>
  <MainNav />

  <Component {...pageProps} />
  </>)
}
