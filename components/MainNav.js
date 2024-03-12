import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import navbar_styles from '../styles/Navbar.module.css'
import Link from "next/link"
import { removeToken, readToken } from "@/lib/userActions"
import { useRouter } from "next/router"
import { isAuthenticated } from "@/lib/userActions"
import { useEffect } from "react"

export default function MainNav() {
    const router = useRouter()

    function logout() {
        removeToken()
        router.push("/login")
    }

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
    
    return (
        <>
        <Navbar className={navbar_styles.custom_navbar} expand="lg">
            <Navbar.Brand className={`${navbar_styles.custom_navbar_item} px-4`}>Bike Shop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                {!isAuthenticated() && <Link href="/login" passHref legacyBehavior><Nav.Link href="/login" className={`${navbar_styles.custom_navbar_item} px-4`}>Login</Nav.Link></Link>}
                {!isAuthenticated() && <Link href="/register" passHref legacyBehavior><Nav.Link href="/register" className={`${navbar_styles.custom_navbar_item} px-4`}>Register</Nav.Link></Link>}
                {isAuthenticated() && <Link href="/account" passHref legacyBehavior><Nav.Link href="/account" className={`${navbar_styles.custom_navbar_item} px-4`}>Account</Nav.Link></Link>}
                {isAuthenticated() && <Nav.Link onClick={logout} className={`${navbar_styles.custom_navbar_item} px-4`}>Logout</Nav.Link>}     
            </Navbar.Collapse>
        </Navbar>
        </>
    )
}