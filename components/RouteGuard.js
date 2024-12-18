import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/userActions';
import { isAdmin, isAuthUser } from '../lib/userActions';


const PUBLIC_PATHS = ['/login', '/', '/register', '/bikes', '/bike', '/forgotPass', '/resetSent', '/resetPass', '/[_id]', '/cart'];
const ADMIN_PATHS = ['/addBike', '/dashboard', '/addBlog']
const AUTH_PATHS = ['/registeradmin', '/users']

export default function RouteGuard(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);


    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.pathname);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeComplete', authCheck);
        }

    }, []);

    

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push("/login");
        } 
        else if (!isAdmin() && ADMIN_PATHS.includes(path))
        {
            setAuthorized(false);
            router.push("/");
        }
        else if (!isAuthUser() && AUTH_PATHS.includes(path))
        {
            setAuthorized(false);
            router.push("/");
        }
        else {
            setAuthorized(true);
        }
    }

   

    return (
      <>
        {authorized && props.children}
      </>
    )
}