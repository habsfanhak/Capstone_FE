import 'bootstrap/dist/css/bootstrap.min.css';
import MainNav from '@/components/MainNav';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  return (<>
  <RouteGuard>
    <MainNav />

    <Component {...pageProps} />
  </RouteGuard>
  </>)
}
