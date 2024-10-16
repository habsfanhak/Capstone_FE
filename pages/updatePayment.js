import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css'
import { useRouter } from "next/router";
import { getCard, readToken } from "@/lib/userActions";
import { updatePayment } from "@/lib/userActions";

export default function UpdatePayment() {
    //Router
    const router = useRouter()
    const token = readToken();

    //Variables
    const [name, setName] = useState("");
    const [cardNum, setCardNum] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const { cardId } = router.query;

    useEffect(() => {
        async function fetchData() {
            const data = await getCard(token.decoded.email, cardId);
            setName(data.nameOnCard);
            setCardNum(data.cardNum);
            setExpiry(data.expiry);
            setCvv(data.cvv);
            setPostalCode(data.postalCode);
        }
        fetchData();
    }, []);

    //Submitting the Form
    async function handleSubmit(e) {
        e.preventDefault();


        try{
            await updatePayment(token.decoded.email, cardNum, name, expiry, cvv, postalCode);  
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
                        <h2>Update Payment Details</h2>
                        Edit debit card details:
                    </div>
                </Card.Body>
            </Card>

            <br/>

            <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                <Row>
                    <Form.Group>
                        <Form.Label>Name On Card:</Form.Label>
                        <Form.Control required type="text" value={name} id="name" name="name" onChange={e => setName(e.target.value)} />
                    </Form.Group>

                    <br/>
                </Row>
                <br />
                <Row>
                    <Form.Group>
                        <Form.Label>Card Number:</Form.Label>
                        <Form.Control required type="text" value={cardNum} id="cardNum" name="cardNum" onChange={e => setCardNum(e.target.value)} placeholder="16-Digit Card Number"/>
                    </Form.Group>

                    <br />
                </Row>
                <br />
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Expiry Date (MMYY):</Form.Label>
                            <Form.Control required type="text" value={expiry} id="expiry" name="expiry" onChange={e => setExpiry(e.target.value)} placeholder="MMYY"/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>CVV:</Form.Label>
                            <Form.Control required type="text" value={cvv} id="cvv" name="cvv" onChange={e => setCvv(e.target.value)} placeholder="123"/>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Form.Group>
                        <Form.Label>Postal Code:</Form.Label>
                        <Form.Control required type="text" value={postalCode} id="postalCode" name="postalCode" onChange={e => setPostalCode(e.target.value)} placeholder="Enter Postal Code"/>
                    </Form.Group>

                    <br />
                </Row>
                <br />
                <Button variant="primary" type="submit">Update Card</Button>
            </Form>
        </Container>
        </>
    )
}