import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import register_styles from '../styles/Register.module.css'
import { useState } from "react";
import { useRouter } from "next/router";
import { setNewPassword } from "@/lib/userActions";

export default function ResetPass(){
    const [email, setEmail] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [warning, setWarning] = useState("");

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();


        try{
            if(newPass == newPass2){
                const status = await setNewPassword(resetCode, newPass);
                if(status == 456){
                    setWarning("Reset Code Is Not Valid");
                }
                else if(status == 421){
                    setWarning("No Account With This Email Has Been Registered");
                }
                else{
                    router.push("/login");
                }
            }
            else{
                setWarning("Passwords Do Not Match");
            }

        }catch(err){
            setWarning(err.message);
        }
    }

    return(
        <>
            <br/>
            <Container style={{marginTop: '6vh'}}>
                <Card className={register_styles.custom_card}>
                    <Card.Body>

                        <div>
                            <h2>Reset Password</h2>
                            Enter you new password:
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
                        <Form.Label>Reset Code:</Form.Label>
                        <Form.Control required type="text" value={resetCode} id="resetCode" name="resetCode" onChange={e => setResetCode(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control required type="password" value={newPass} id="newPass" name="newPass" onChange={e => setNewPass(e.target.value)} />
                    </Form.Group>

                    <br />

                    <Form.Group>
                        <Form.Label>Repeat New Password:</Form.Label>
                        <Form.Control required type="password" value={newPass2} id="newPass2" name="newPass2" onChange={e => setNewPass2(e.target.value)} />
                    </Form.Group>

                    <br />

                    <Button variant="outline-primary" type="submit">Reset Password</Button>


                </Form>
            </Container>
        </>
    )
}