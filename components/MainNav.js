import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import navbar_styles from '../styles/Navbar.module.css'
import Link from "next/link"

export default function MainNav() {
    return (
        <>
        <Navbar className={navbar_styles.custom_navbar} expand="lg">
            <Navbar.Brand className={`${navbar_styles.custom_navbar_item} px-4`}>Bike Shop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Link href="/register" passHref legacyBehavior><Nav.Link href="/register" className={`${navbar_styles.custom_navbar_item} px-4`}>Register</Nav.Link></Link>
            </Navbar.Collapse>
        </Navbar>
        </>
    )
}