import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import register_styles from '../styles/Register.module.css'
import { readToken } from "@/lib/userActions";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getUserPayment } from "@/lib/userActions";
import { deletePayment } from "@/lib/userActions";

export default function Account() {
    const token = readToken();
    const [cards, setCards] = useState([]);
    const [count, setCount] = useState(0);

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const data = await getUserPayment(token.decoded.email);
            setCards(data);
        }
        fetchData();
    }, [count]);

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
                            {cards.map((card) =>{
                                const cardNumString = card.cardNum;
                                const lastFour = cardNumString.substring(cardNumString.length - 4);

                                return(
                                    <Card key={card.cardNum} style={{ width: '29rem' }}>
                                        <Card.Body>
                                            <span>Debit Ending In ************{lastFour} &nbsp;&nbsp;&nbsp;&nbsp;<Link href={`/updatePayment?cardId=${card.cvv}`}>Change</Link>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="danger" onClick={() => deleteCard(card.cardNum)}>Delete</Button></span>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}