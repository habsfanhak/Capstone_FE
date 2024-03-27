import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import register_styles from '../styles/Register.module.css'
import { useState } from "react";
import { useRouter } from "next/router";
import { sendReset } from "@/lib/userActions";

export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [warning, setWarning] = useState("");

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();


        try{
            await sendReset(email);
            router.push("/resetSent")

        }catch(err){
            setMessage(err.message);
        }
    }

    return(
        <>
            <br/>
            <Container>
                <Card className={register_styles.custom_card}>
                    <Card.Body>

                        <div>
                            <h2>Forgot Password?</h2>
                            Enter email for password reset:
                        </div>
                    </Card.Body>
                </Card>

                {warning && <>
                    <br />
                    <Alert variant='danger'>
                        {warning}
                    </Alert>
                </>}

                <br/>

                <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control required type="text" value={email} id="email" name="email" onChange={e => setEmail(e.target.value)} />
                    </Form.Group>

                    <br />

                    <Button variant="outline-primary" type="submit">Reset Password</Button>


                </Form>
            </Container>
        </>
    )
}