import { getBike, purchase, getDiscount, getUserCart, getSalePrice } from "@/lib/userActions";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css';
import { readToken } from "@/lib/userActions";
import { getUserPayment } from "@/lib/userActions";
import { purchaseWithCard } from "@/lib/userActions";
import { Alert } from "react-bootstrap";

export default function CheckoutCart() {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [added, setAdded] = useState(false);
    const token = readToken();
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");


    useEffect(() => {
        async function fetchData() {
            try {
                const userCart = await getUserCart(token.decoded.email);
                if (userCart) {
                    const { cart: cartItems, quantity: quantitiesArray } = userCart;
                    if (cartItems.length > 0) {
                        const cartData = await Promise.all(cartItems.map(async (item) => {
                            const bike = await getBike(item);
                            const salePrice = await getSalePrice(item);
                            return { ...bike, salePrice };
                        }));
                        setCart(cartData);
                        setQuantities(quantitiesArray);
                    } else {
                        setCart([]);
                        setQuantities([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }


            const payData = await getUserPayment(token.decoded.email);
            setCards(payData);
        }


        fetchData();
    }, [token.decoded.email]);


    if (loading) {
        return (<div><p>Loading....</p></div>);
    }


    async function createStripeToken(cardNum, expiry, cvv, postalCode, nameOnCard) {
        const { token, error } = await stripe.createToken({
            type: 'card',
            card: {
                number: cardNum,
                exp_month: expiry.substring(0, 2),
                exp_year: '20' + expiry.substring(2, 4),
                cvc: cvv,
            },
            billing_details: {
                name: nameOnCard,
                address: {
                    postal_code: postalCode,
                },
            }
        });
   
        if (error) {
            console.error(error);
            return null;
        }
        return token.id;
    }


    async function handleSubmit(e) {
        e.preventDefault();
   
        const bikeDetails = cart.map(bike => `${bike.brand} ${bike.model}`).join(', ');
        const totalPrice = calculateTotalPrice().toFixed(2);
   
        if (selectedCard === null) {
            setAlertMessage("Please select payment method");
            return;
        }
   
        if (selectedCard === "None") {
            const url = await purchase(bikeDetails, totalPrice);
            window.location.href = url;
        } else {
            setAlertMessage("Feature has not been implemented yet. Please select: Enter Card Details Manually")
            /*const { cardNum, expiry, cvv, postalCode, nameOnCard } = selectedCard;
           


            const token = await createStripeToken(cardNum, expiry, cvv, postalCode, nameOnCard);
   
            if (token) {
                const url2 = await purchaseWithCard(bikeDetails, totalPrice, token);
                window.location.href = url2;
            } else {
                setAlertMessage("There was an error processing your card.");
            }*/
        }
    }


    async function handlePromo(e) {
        e.preventDefault();
        try {
            const discountValue = await getDiscount(code);
            setDiscount(discountValue);
            setAdded(true);
        } catch {
            setDiscount(0);
        }
    }


    const calculateTotalPrice = () => {
        const totalBeforeDiscount = cart.reduce((acc, bike, index) => {
            let basePrice = bike.salePrice || bike.price;
            return acc + (basePrice * quantities[index]);
        }, 0);


        const tax = totalBeforeDiscount * 0.13;
        const shipping = 15;
        const totalWithTaxAndShipping = totalBeforeDiscount + tax + shipping;


        if (discount > 0) {
            const discountAmount = totalWithTaxAndShipping * (discount / 100);
            return totalWithTaxAndShipping - discountAmount;
        }


        return totalWithTaxAndShipping;
    };


    const handleChoose = (card) => {
        setSelectedCard(card);
    }


    return (
        <>
            <br />
            <Container style={{marginTop: '6vh', marginBottom: '6vh'}}>
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <h2>Checkout</h2>
                        {cart.map((bike, index) => (
                            <div key={bike.id}>
                                <h5>
                                    <b>{bike.brand} - {bike.model}</b> (x{quantities[index]}) &nbsp;
                                    <b>Price:</b> ${(bike.salePrice || bike.price) * quantities[index]}
                                </h5>
                            </div>
                        ))}
                        <br/>
                        <p><b>HST: </b> ${(calculateTotalPrice() * 0.13).toFixed(2)}</p>
                        <p><b>Shipping: </b> $15.00</p>
                        {discount > 0 ? (
                            <span>
                                <del>
                                    <b>Total: </b> ${(calculateTotalPrice() + (calculateTotalPrice() * 0.13) + 15).toFixed(2)}
                                </del>
                                <br />
                                <b>Final Total: </b> ${calculateTotalPrice().toFixed(2)}
                            </span>
                        ) : (
                            <p><b>Total: </b> ${calculateTotalPrice().toFixed(2)}</p>
                        )}
                    </Card.Body>
                </Card>
                <br /><br />


                <Form className={register_styles.custom_card} onSubmit={handlePromo}>
                    <Row>
                        <Col>
                            <Form.Control required type="text" id="code" name="code" placeholder="Add Promo Code" onChange={(e) => setCode(e.target.value)} />
                        </Col>
                        <Col>
                            <Button type="submit" variant="outline-success" disabled={added}>Add</Button>
                        </Col>
                    </Row>
                </Form>
                <br />
                <h4>Choose Payment Method</h4>
                {cards.map((card) => {
                    const cardNumString = card.cardNum;
                    const lastFour = cardNumString.substring(cardNumString.length - 4);


                    const cardStyle = selectedCard?.cardNum === card.cardNum
                        ? { backgroundColor: '#007bff', color: 'white' }
                        : {};


                    return (
                        <Card
                            className={register_styles.custom_card}
                            key={card.cardNum}
                            style={{
                                width: '24rem',
                                ...cardStyle,
                                marginBottom: '15px',
                                border: selectedCard?.cardNum === card.cardNum ? '2px solid #0056b3' : '1px solid #ddd'
                            }}
                        >
                            <Card.Body>
                                <span>
                                    Debit Ending In ************{lastFour}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {selectedCard?.cardNum === card.cardNum ? (
                                        <span style={{ fontSize: '14px' }}>Selected</span>
                                    ) : (
                                        <Button variant="outline-primary" onClick={() => handleChoose(card)}>Select</Button>
                                    )}
                                </span>
                            </Card.Body>
                        </Card>
                    );
                })}
                <Card
                    className={register_styles.custom_card}
                    key="none"
                    style={{
                        width: '24rem',
                        marginBottom: '15px',
                        border: selectedCard === "None" ? '2px solid #0056b3' : '1px solid #ddd',
                        backgroundColor: selectedCard === "None" ? '#007bff' : 'transparent',
                        color: selectedCard === "None" ? 'white' : 'black'
                    }}
                >
                    <Card.Body>
                        <span>
                            <b>OR</b>&nbsp; Enter Card Details Manually &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {selectedCard === "None" ? (
                                <span style={{ fontSize: '14px' }}>Selected</span>
                            ) : (
                                <Button variant="outline-primary" onClick={() => handleChoose("None")}>Select</Button>
                            )}
                        </span>
                    </Card.Body>
                </Card>
                <br/>
                <h4>Enter Shipping Details</h4>
                <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group>
                            <Form.Label>Full Name For Order:</Form.Label>
                            <Form.Control required type="text" id="name" name="name" placeholder="Enter Full Name" />
                        </Form.Group>
                    </Row>
                    <br />
                    <Row>
                        <Form.Group>
                            <Form.Label>Address:</Form.Label>
                            <Form.Control required type="text" id="address" name="address" placeholder="Enter Shipping Address" />
                        </Form.Group>
                    </Row>
                    <br />
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
                    </Row>
                    <br />
                    <Row>
                        <Form.Group>
                            <Form.Label>Postal Code:</Form.Label>
                            <Form.Control required type="text" id="postalCode" name="postalCode" placeholder="Enter Postal Code" />
                        </Form.Group>
                    </Row>
                    <br />
                    <Button type="submit" variant="success">Pay Now</Button>
                </Form>
                {alertMessage && <>
                    <br />
                    <Alert variant='danger'>
                        {alertMessage}
                    </Alert>
                </>}
            </Container>
        </>
    );
}



