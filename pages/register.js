import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import register_styles from '../styles/Register.module.css'
import { registerRegUser } from "@/lib/userActions";
import { useRouter } from "next/router";

export default function Register() {
    //Router
    const router = useRouter()

    //Variables
    const [email, setEmail] = useState("");
    const [fullName, setfullName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();

    //Messages
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");

    //Submitting the Form
    async function handleSubmit(e) {
        e.preventDefault();

        if (password != password2) {
            setWarning("Passwords are not matching.")
        }
        else {
            try{
                await registerRegUser(email, password, fullName, phoneNumber);    
                router.push("/login")
            }catch(err){
                setWarning(err.message);
            }
            }
        }


    return (
        <>
        <br/>

        <Container>
            <Card className={register_styles.custom_card}>
                <Card.Body>

                    <div>
                        <h2>Register</h2>
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

                <Form.Group >
                    <Form.Label>Full Name:</Form.Label>
                    <Form.Control required type="text" value={fullName} id="userName" name="userName" onChange={e => setfullName(e.target.value)} />
                </Form.Group>

                <br/>

                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control required type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <br />

                <Form.Group>
                    <Form.Label>Repeat Password:</Form.Label>
                    <Form.Control required type="password" value={password2} id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
                </Form.Group >

                <br/>

                <Form.Group >
                    <Form.Label>Phone Number:</Form.Label>
                    <Form.Control required type="number" value={phoneNumber} id="userName" name="userName" onChange={e => setPhoneNumber(e.target.value)} />
                </Form.Group>

                <br/>



                <Button variant="outline-success" type="submit">Register</Button>


            </Form>
        </Container>
        </>
    )
}