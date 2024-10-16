import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import navbar_styles from '../styles/Navbar.module.css'
import Link from "next/link"
import { removeToken, readToken, isAdmin } from "@/lib/userActions"
import { useRouter } from "next/router"
import { isAuthenticated, isAuthUser } from "@/lib/userActions"
import { useEffect } from "react"
import { useSpring, animated } from 'react-spring';
import { useState } from "react"

export default function MainNav() {
    const router = useRouter()
    const isHomePage = router.pathname === '/'; // Adjust the home page path accordingly
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    function logout() {
        removeToken()
        router.push("/login")
    }

    useEffect(() => {
      const handleScroll = () => {
        const scrollPercentage = (window.scrollY / window.innerHeight) * 100;
        const scrolled = scrollPercentage > 70; // Check if scrolled more than 50% of the viewport
        setIsScrolled(scrolled);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    useEffect(() => {
        if (isHomePage) {
          const navDelayTimer = setTimeout(() => {
            setIsNavVisible(true);
          }, 2500);
    
          return () => {
            clearTimeout(navDelayTimer);
          };
        } else {
          setIsNavVisible(true); // Skip animation on other pages
        }
      }, [isHomePage]);

    useEffect(() => {
        // Additional logic you want to run only on the client side
        if (typeof window !== 'undefined') {
            const token = readToken();
            // ... other client-side logic ...
        }

        return () => {
          // Cleanup logic if needed
        };
    }, []); 

    const navAnimation = useSpring({
        opacity: isNavVisible ? 1 : 0,
        transform: isNavVisible ? 'translateY(0%)' : 'translateY(-100%)',
        config: { tension: 155, friction: 20, delay: isHomePage ? 3000 : 0 }, // Apply delay only on the home page
      });
    
      const navbarBgAnimation = useSpring({
        backgroundColor: isHomePage
          ? (isScrolled ? '#2C3642' : 'transparent') // Transparent or scroll-based color on the homepage
          : '#2C3642', // Solid color on other pages
        boxShadow: isScrolled ? '0 2px 2px 0 #D0B184' : '0 0px 0px 0 rgba(0,0,0,0)',
        config: { duration: 300 }, // Adjust the duration for a smoother transition
        height: '6vh'
    });
    
    return (
        <>
        { isNavVisible && 
        <animated.div className={navbar_styles.navbar_height} style={{ ...navAnimation, ...navbarBgAnimation, width: '100%', position: 'fixed', top: 0, zIndex: 1000 }}>
        <Navbar className={navbar_styles.custom_navbar} expand="lg" style={{ width: '100%', backgroundColor: 'transparent', height: 'inherit'}}>
            <Navbar.Brand href="/" className={`${navbar_styles.custom_navbar_item} px-4`}>Bike Shop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                {(isAuthenticated() || !isAuthenticated()) && <Link href="/bikes" passHref legacyBehavior><Nav.Link href="/bikes" className={`${navbar_styles.custom_navbar_item} px-4`}>Bikes</Nav.Link></Link>}
                {isAuthUser() && <Link href="/registeradmin" passHref legacyBehavior><Nav.Link href="/registeradmin" className={`${navbar_styles.custom_navbar_item} px-4`}>Add Admin</Nav.Link></Link>}
                {isAuthUser() && <Link href="/users" passHref legacyBehavior><Nav.Link href="/users" className={`${navbar_styles.custom_navbar_item} px-4`}>Users</Nav.Link></Link>}

                {isAdmin() && <Link href="/addBike" passHref legacyBehavior><Nav.Link href="/addBike" className={`${navbar_styles.custom_navbar_item} px-4`}>Add Bike</Nav.Link></Link>}
                
                {/* navigate to dashboard to user who is admin */}
                {isAdmin() && <Link href="/dashboard" passHref legacyBehavior><Nav.Link href="/dashboard" className={`${navbar_styles.custom_navbar_item} px-4`}>Dashboard</Nav.Link></Link>}


                {!isAuthenticated() && <Link href="/login" passHref legacyBehavior><Nav.Link href="/login" className={`${navbar_styles.custom_navbar_item} px-4`}>Login</Nav.Link></Link>}
                {!isAuthenticated() && <Link href="/register" passHref legacyBehavior><Nav.Link href="/register" className={`${navbar_styles.custom_navbar_item} px-4`}>Register</Nav.Link></Link>}
                {isAuthenticated() && <Link href="/account" passHref legacyBehavior><Nav.Link href="/account" className={`${navbar_styles.custom_navbar_item} px-4`}>Account</Nav.Link></Link>}
                {isAuthenticated() && <Nav.Link onClick={logout} className={`${navbar_styles.custom_navbar_item} px-4`}>Logout</Nav.Link>}     
            </Navbar.Collapse>
        </Navbar>
        </animated.div> }
        </>
    )
}