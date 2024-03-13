import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import register_styles from '../styles/Register.module.css'
import { readToken } from "@/lib/userActions";

export default function Account() {
    const token = readToken()
    return (
        <>
            <br/>
            <Container>
                <Card className={register_styles.custom_card}>
                    <Card.Body>

                        <div>
                            <h2>Welcome, {token.decoded.fullName}!</h2>
                            <br/>

                            Email: {token.decoded.email}

                            <br/>

                            Full Name: {token.decoded.fullName}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}