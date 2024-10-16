import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useState } from "react";
import register_styles from '../styles/Register.module.css'
import { useRouter } from "next/router";
import { addPayment, readToken } from "@/lib/userActions";

export default function AddPayment() {
    //Router
    const router = useRouter()
    const token = readToken();

    //Variables
    const [name, setName] = useState("");
    const [cardNum, setCardNum] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [postalCode, setPostalCode] = useState("");

    //Submitting the Form
    async function handleSubmit(e) {
        e.preventDefault();


        try{
            await addPayment(token.decoded.email, cardNum, name, expiry, cvv, postalCode);  
            router.push("/account");

        }catch(err){
            console.log(err);
        }
    }
        


    return (
        <>
        <br/>

        <Container style={{marginTop: '6vh'}}>
            <Card className={register_styles.custom_card}>
                <Card.Body>

                    <div>
                        <h2>Enter Payment Details</h2>
                        Enter debit card details to add a new payment method:
                    </div>
                </Card.Body>
            </Card>

            <br/>

            <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                <Row>
                    <Form.Group>
                        <Form.Label>Name On Card:</Form.Label>
                        <Form.Control required type="text" value={name} id="name" name="name" onChange={e => setName(e.target.value)} placeholder="Full Name" />
                    </Form.Group>

                    <br/>
                </Row>
                <br />
                <Row>
                    <Form.Group>
                        <Form.Label>Card Number:</Form.Label>
                        <Form.Control required type="text" id="cardNum" name="cardNum" onChange={e => setCardNum(e.target.value)} placeholder="16-Digit Card Number"/>
                    </Form.Group>

                    <br />
                </Row>
                <br />
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Expiry Date (MMYY):</Form.Label>
                            <Form.Control required type="text" id="expiry" name="expiry" onChange={e => setExpiry(e.target.value)} placeholder="MMYY"/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>CVV:</Form.Label>
                            <Form.Control required type="text" id="cvv" name="cvv" onChange={e => setCvv(e.target.value)} placeholder="123"/>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Form.Group>
                        <Form.Label>Postal Code:</Form.Label>
                        <Form.Control required type="text" id="postalCode" name="postalCode" onChange={e => setPostalCode(e.target.value)} placeholder="Enter Postal Code"/>
                    </Form.Group>

                    <br />
                </Row>
                <br />
                <Button variant="primary" type="submit">Add Card</Button>
            </Form>
        </Container>
        </>
    )
}