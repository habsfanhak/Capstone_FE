import { getBike, purchase, getDiscount } from "@/lib/userActions";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css'
import { getSalePrice } from "@/lib/userActions";

export default function Checkout(){
    const [bike, setBike] = useState();
    const [code, setCode] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [discount, setDiscount] = useState(0);
    const [added, setAdded] = useState("");
    const router = useRouter();
    const model = router.query.model;

    useEffect(() => {
        async function fetchData() {
            const data = await getBike(model);
            setBike(data);

            const sp = await getSalePrice(model);
            setSalePrice(sp);
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
        //let totalPrice = bike.price + (bike.price * 0.13) + 15;
        const url = await purchase(bike.brand, bike.model, calculateTotalPrice().toFixed(2));
        window.location.href = url;
    }

    async function handlePromo(e){
        e.preventDefault();

        try{
            setDiscount(await getDiscount(code));
        }
        catch{
            setDiscount(0)
        }

        setAdded(1);
    }

    const calculateTotalPrice = () => {
        let basePrice = bike.price;
        if(salePrice){
            basePrice = salePrice;
        }
        const tax = basePrice * 0.13;
        const shipping = 15;
        const totalBeforeDiscount = basePrice + tax + shipping;
        
        if (discount > 0) {
          const discountAmount = totalBeforeDiscount * (discount/100); // Assuming discount is a percentage
          return totalBeforeDiscount - discountAmount;
        }
        
        return totalBeforeDiscount;
    };

    const getBasePrice = () => {
        let basePrice = bike.price;
        if(salePrice){
            basePrice = salePrice;
        }

        return basePrice;
    }


    return(
        <>
        <br/>
            <Container style={{marginTop: '6vh'}}>
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <div>
                            <h2>Checkout</h2><br/>
                            <h5><b>{bike.brand} {" - "} {bike.model}</b> &nbsp; <b>Qty: </b> 1 &nbsp; <b>Price: </b> CAD ${getBasePrice()}</h5>
                            <p><b>HST: </b> ${getBasePrice() * 0.13}</p>
                            <p><b>Shipping: </b> $15.00</p>
                            {discount > 0 ? (
                                    <span>
                                    <del>
                                        <b>Total: </b> ${getBasePrice() + (getBasePrice() * 0.13) + 15}
                                    </del>
                                    <br />
                                    <b>Total: </b> ${calculateTotalPrice().toFixed(2)}
                                    </span>
                                ) : (
                                    <p><b>Total: </b> ${calculateTotalPrice().toFixed(2)}</p>
                            )}
                        </div>
                    </Card.Body>
                </Card><br /><br />

                <div>
                    <Form className={register_styles.custom_card} onSubmit={handlePromo}>
                        <Row>
                            <Col>
                                <Form.Control required type="text" id="code" name="code" placeholder="Add Promo Code" onChange={(e) => setCode(e.target.value)}/>
                            </Col>
                            <Col>
                                <Button type="submit" variant="outline-success" disabled={added}>Add</Button>
                            </Col>
                            <Col>
                            
                            </Col>
                        </Row>
                    </Form><br/>
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