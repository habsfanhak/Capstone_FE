import { Navbar, Nav, Badge } from "react-bootstrap";
import navbar_styles from '../styles/Navbar.module.css';
import Link from "next/link";
import { removeToken, readToken, isAdmin, isAuthenticated, isAuthUser } from "@/lib/userActions";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSpring, animated } from 'react-spring';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { getUserCart } from '@/lib/userActions'; // Assuming you have a function to fetch the user's cart

export default function MainNav() {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);  // State to track the cart count

  function logout() {
    removeToken();
    router.push("/login");
  }

  // Fetch cart count from the backend or user state
  const fetchCartData = async () => {
    if (isAuthenticated()) {
      const token = readToken();
      try {
        // Fetch cart data from the server
        const userCart = await getUserCart(token.decoded.email);
        
        if (userCart && userCart.cart) {
          const totalItems = userCart.cart.reduce((acc, item, index) => {
            // Calculate total number of items in the cart based on quantities
            return acc + userCart.quantity[index];
          }, 0);

          setCartCount(totalItems);  // Set the total number of items in the cart
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  // Run once on component mount, and also re-run whenever the cart is updated
  useEffect(() => {
    fetchCartData(); // Fetch cart data on component mount
  }, []); // Empty dependency array ensures it runs once on mount

  // Re-run fetching cart data when cart count is updated
  useEffect(() => {
    fetchCartData(); // Fetch cart data after any cart update (add/remove item)
  }, [cartCount]); // Trigger re-fetch when `cartCount` is updated

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / window.innerHeight) * 100;
      const scrolled = scrollPercentage > 70;
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

  const navAnimation = useSpring({
    opacity: isNavVisible ? 1 : 0,
    transform: isNavVisible ? 'translateY(0%)' : 'translateY(-100%)',
    config: { tension: 155, friction: 20, delay: isHomePage ? 3000 : 0 },
  });

  const navbarBgAnimation = useSpring({
    backgroundColor: isHomePage
      ? (isScrolled ? '#2C3642' : 'transparent')
      : '#2C3642',
    boxShadow: isScrolled ? '0 2px 2px 0 #D0B184' : '0 0px 0px 0 rgba(0,0,0,0)',
    config: { duration: 300 },
    height: '6vh',
  });

  return (
    <>
      {isNavVisible &&
        <animated.div
          className={navbar_styles.navbar_height}
          style={{ ...navAnimation, ...navbarBgAnimation, width: '100%', position: 'fixed', top: 0, zIndex: 1000 }}>
          <Navbar className={navbar_styles.custom_navbar} expand="lg" style={{ width: '100%', backgroundColor: 'transparent', height: 'inherit' }}>
            <Navbar.Brand href="/" className={`${navbar_styles.custom_navbar_item} px-4`}>Bike Shop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              {(isAuthenticated() || !isAuthenticated()) && 
                <Link href="/bikes" passHref legacyBehavior>
                  <Nav.Link href="/bikes" className={`${navbar_styles.custom_navbar_item} px-4`}>Bikes</Nav.Link>
                </Link>}
              {isAuthUser() && 
                <Link href="/registeradmin" passHref legacyBehavior>
                  <Nav.Link href="/registeradmin" className={`${navbar_styles.custom_navbar_item} px-4`}>Add Admin</Nav.Link>
                </Link>}
              {isAuthUser() && 
                <Link href="/users" passHref legacyBehavior>
                  <Nav.Link href="/users" className={`${navbar_styles.custom_navbar_item} px-4`}>Users</Nav.Link>
                </Link>}
              {isAdmin() && 
                <Link href="/addBike" passHref legacyBehavior>
                  <Nav.Link href="/addBike" className={`${navbar_styles.custom_navbar_item} px-4`}>Add Bike</Nav.Link>
                </Link>}
              {isAdmin() && 
                <Link href="/dashboard" passHref legacyBehavior>
                  <Nav.Link href="/dashboard" className={`${navbar_styles.custom_navbar_item} px-4`}>Dashboard</Nav.Link>
                </Link>}
              {!isAuthenticated() && 
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link href="/login" className={`${navbar_styles.custom_navbar_item} px-4`}>Login</Nav.Link>
                </Link>}
              {!isAuthenticated() && 
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link href="/register" className={`${navbar_styles.custom_navbar_item} px-4`}>Register</Nav.Link>
                </Link>}
              {isAuthenticated() && 
                <Link href="/cart" passHref legacyBehavior>
                  <Nav.Link href="/cart" className={`${navbar_styles.custom_navbar_item} px-4`}>
                    <FaShoppingCart/>
                    {cartCount > 0 && (
                      <Badge pill bg="primary" style={{ marginLeft: '5px' }}>
                        {cartCount}
                      </Badge>
                    )}
                  </Nav.Link>
                </Link>}
              {isAuthenticated() && 
                <Link href="/account" passHref legacyBehavior>
                  <Nav.Link href="/account" className={`${navbar_styles.custom_navbar_item} px-4`}><FaUser/></Nav.Link>
                </Link>}
              {isAuthenticated() && 
                <Nav.Link onClick={logout} className={`${navbar_styles.custom_navbar_item} px-4`}><FaSignOutAlt/></Nav.Link>}
            </Navbar.Collapse>
          </Navbar>
        </animated.div>
      }
    </>
  );
}
