import { getBike, purchase, getDiscount, getUserCart, getSalePrice } from "@/lib/userActions";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css';
import { readToken } from "@/lib/userActions";

export default function CheckoutCart() {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [added, setAdded] = useState(false);
    const token = readToken();
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [loading, setLoading] = useState(true);

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
        }

        fetchData();
    }, []);

    if (loading) {
        return (<div><p>Loading....</p></div>);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const bikeDetails = cart.map(bike => `${bike.brand} ${bike.model}`).join(', ');
        const totalPrice = calculateTotalPrice().toFixed(2);

        const url = await purchase(bikeDetails, totalPrice); 
        window.location.href = url;
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
            return acc + (basePrice * quantities[index]); // Multiply by quantity
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

    return (
        <>
            <br />
            <Container style={{marginTop: '6vh'}}>
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <h2>Checkout</h2>
                        {cart.map((bike, index) => (
                            <div key={bike.id}>
                                <h5>
                                    <b>{bike.brand} - {bike.model}</b> (x{quantities[index]}) &nbsp; 
                                    <b>Price:</b> ${(bike.salePrice || bike.price) * quantities[index]} {/* Total price for this bike */}
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
            </Container>
        </>
    );
}


