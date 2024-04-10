import { getBike, purchase } from "@/lib/userActions";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css'

export default function Checkout(){
    const [bike, setBike] = useState();
    const router = useRouter();
    const model = router.query.model;

    useEffect(() => {
        async function fetchData() {
            const data = await getBike(model);
            setBike(data);
        }
        fetchData();
    }, [model]);

    if(!bike){
        return (<><div><p>Loading....</p><p/></div></>)
    }

    async function nvm(e){
        e.preventDefault();
        console.log(1);
    }

    async function handleSubmit(e){
        e.preventDefault();
        let totalPrice = bike.price + (bike.price * 0.13) + 15;
        const url = await purchase(bike.brand, bike.model, totalPrice);
        window.location.href = url;
    }


    return(
        <>
        <br/>
            <Container>
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <div>
                            <h2>Checkout</h2><br/>
                            <h5><b>{bike.brand} {" - "} {bike.model}</b> &nbsp; <b>Qty: </b> 1 &nbsp; <b>Price: </b> CAD ${bike.price}</h5>
                            <p><b>HST: </b> ${bike.price * 0.13}</p>
                            <p><b>Shipping: </b> $15.00</p>
                            <p><b>Total: </b> ${bike.price + (bike.price * 0.13) + 15}</p>
                        </div>
                    </Card.Body>
                </Card><br /><br />

                <div>
                    <h4>Enter Shipping Details</h4><br />
                    <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group>
                                <Form.Label>Full Name For Order:</Form.Label>
                                <Form.Control required type="text" id="address" name="address" placeholder="Enter Full Name" />
                            </Form.Group>
                        </Row><br />
                        <Row>
                            <Form.Group>
                                <Form.Label>Address:</Form.Label>
                                <Form.Control required type="text" id="address" name="address" placeholder="Enter Shipping Address" />
                            </Form.Group>
                        </Row><br />
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>City:</Form.Label>
                                    <Form.Control required type="text" id="city" name="city" placeholder="Enter City Name" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Province:</Form.Label>
                                    <Form.Control required type="text" id="province" name="province" placeholder="Enter Province (eg. ON)" />
                                </Form.Group>
                            </Col>
                        </Row><br />
                        <Row>
                        <Form.Group>
                            <Form.Label>Postal Code:</Form.Label>
                                <Form.Control required type="text" id="postalCode" name="postalCode" placeholder="Enter Postal Code" />
                            </Form.Group>
                        </Row>
                        <br />
                        <Button type="submit" variant="success">Pay Now</Button>
                    </Form>
                </div>
            </Container> 
        </>
    )
}