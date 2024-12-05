import { Button, Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { updateQuantity } from "@/lib/userActions";
import { addOrder } from "@/lib/userActions";
import { useEffect } from "react";
import { readToken } from "@/lib/userActions";
import { deleteCart } from "@/lib/userActions";

export default function PaymentSuccess() {
    const router = useRouter();
    const { items, total_price } = router.query;
    const token = readToken();

    useEffect(() => {
        async function updateQtyAndCreateOrder() {
            if (items && total_price) {
                const itemArray = items.split(',').map(item => item.trim());

                for (let item of itemArray) {
                    const bikeModel = item.split(' ').pop();
                    await updateQuantity(bikeModel);
                }

                try {
                    await addOrder(token.decoded.email, itemArray, total_price);
                } catch (error) {
                    console.error('Error adding order:', error);
                }

                deleteCart(token.decoded.email);
            }
        }

        updateQtyAndCreateOrder();
    }, [items, total_price, token.decoded.email]);

    // Function to return to the homepage
    function returnHome(e) {
        e.preventDefault();
        router.push("/");
    }

    return (
        <>
            <Container style={{ marginTop: '6vh' }}>
                <br /><br /><br /><br />
                <h1>Your Order Has Been Placed</h1>
                <p>Thank you for purchasing</p>
                <br /><br />
                <Button variant="primary" onClick={returnHome}>Return Home</Button>
            </Container>
        </>
    );
}
