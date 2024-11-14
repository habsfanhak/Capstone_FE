import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import register_styles from '../styles/Register.module.css';
import { readToken } from "@/lib/userActions";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getUserPayment, getOrders } from "@/lib/userActions";
import { deletePayment } from "@/lib/userActions";

export default function Account() {
    const token = readToken();
    const [cards, setCards] = useState([]);
    const [orders, setOrders] = useState([]);
    const [count, setCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const data = await getUserPayment(token.decoded.email);
            setCards(data);

            let ordersData = await getOrders(token.decoded.email);
            ordersData = ordersData.reverse()
            setOrders(ordersData || []);
        }
        fetchData();
    }, [count, token.decoded.email]);

    function addNew(e){
        e.preventDefault();
        router.push("/addPayment");
    }

    async function deleteCard(num){
        await deletePayment(token.decoded.email, num);
        setCount(count + 1);
    }

    return (
        <>
            <br/>
            <Container style={{marginTop: '6vh'}}>
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <div>
                            <h2>Welcome, {token.decoded.fullName}!</h2>
                            <br/>
                            <b>Email:</b>&nbsp; {token.decoded.email}
                            <br/>
                            <b>Full Name:</b>&nbsp; {token.decoded.fullName}
                        </div>
                        <br/>
                        <hr/>
                        <br />
                        <div>
                            <h4>Payment Cards&nbsp;&nbsp;<Button variant="primary" onClick={addNew}>Add New</Button></h4><br />
                            {cards.map((card) => {
                                const cardNumString = card.cardNum;
                                const lastFour = cardNumString.substring(cardNumString.length - 4);

                                return (
                                    <Card key={card.cardNum} style={{ width: '29rem' }}>
                                        <Card.Body>
                                            <span>Debit Ending In ************{lastFour} &nbsp;&nbsp;&nbsp;&nbsp;<Link href={`/updatePayment?cardId=${card.cvv}`}>Change</Link>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="danger" onClick={() => deleteCard(card.cardNum)}>Delete</Button></span>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>

                        <br/>
                        <hr/>
                        <br />
                        <div>
                            <h4>Previous Orders</h4>
                            {orders.length > 0 ? (
                            <div>
                                {orders.map((order) => {
                                    const { orderId, items, total_price, date } = order;
                                    const formattedDate = new Date(date).toLocaleDateString();
                                    const formattedPrice = total_price / 100

                                    return (
                                        <Card key={orderId} style={{
                                            marginBottom: '20px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            backgroundColor: '#f9f9f9',
                                            width: '29rem',
                                        }}>
                                            <Card.Body>
                                                <div style={{ marginBottom: '15px' }}>
                                                    {Array.isArray(items) && items.length > 0 ? (
                                                        items.map((item, index) => (
                                                            <div key={index} style={{ marginBottom: '8px',  }}>
                                                                <h6 style={{ fontWeight: '500', fontSize: '16px', color: '#333' }}>{item}</h6>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ fontSize: '14px', color: '#999' }}>No items found</div>
                                                    )}
                                                </div>

                                                <div style={{ fontSize: '14px', color: '#444', marginTop: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ fontWeight: '600' }}>Total:</span>
                                                    <span>CAD ${formattedPrice ? formattedPrice.toFixed(2) : "N/A"}</span>
                                                </div>
                                                    <div style={{ fontStyle: 'italic', color: '#777' }}>
                                                        <strong>Date:</strong> {formattedDate}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#888' }}>No previous orders found.</p>
                        )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}