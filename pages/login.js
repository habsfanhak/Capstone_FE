import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import register_styles from '../styles/Register.module.css'
import { login } from "@/lib/userActions";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
    //Router
    const router = useRouter()

    //Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    //Messages
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");

    //Submitting the Form
    async function handleSubmit(e) {
        e.preventDefault();


        try{
            await login(email, password);    
            router.push("/")

        }catch(err){
            setWarning(err.message);
        }
    }
        


    return (
        <>
        <br/>

        <Container style={{marginTop: '6vh'}}>
            <Card className={register_styles.custom_card}>
                <Card.Body>

                    <div>
                        <h2>Login</h2>
                        Enter credentials below:
                    </div>
                </Card.Body>
            </Card>

            {warning && <>
                <br />
                <Alert variant='danger'>
                    {warning}
                </Alert>
            </>}

            {success && <>
                <br />
                <Alert variant='success'>
                    {success}
                </Alert>
            </>}

            <br/>

            <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control required type="text" value={email} id="email" name="email" onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <br/>

                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control required type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                    <Link href="/forgotPass">Forgot Password?</Link>
                </Form.Group>

                <br />

                <Button variant="outline-success" type="submit">Login</Button>


            </Form>
        </Container>
        </>
    )
}