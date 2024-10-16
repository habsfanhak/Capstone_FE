import { Button, Container } from "react-bootstrap"
import { useRouter } from "next/router";
import { updateQuantity } from "@/lib/userActions";
import { useEffect } from "react";

export default function PaymentSuccess(){
    const router = useRouter();
    const model = router.query.model;

    useEffect(() => {
        async function updateQty() {
            updateQuantity(model);
        }
        updateQty();
    }, [model]);

    function returnHome(e){
        e.preventDefault();
        router.push("/");
    }

    return(
        <>  
            <Container style={{marginTop: '6vh'}}>
                <br/><br/><br/><br/>
                <h1>Your Order Has Been Placed</h1>
                <p>Thank you for purchasing</p>
                <br /><br />
                <Button variant="primary" onClick={returnHome}>Return Home</Button>
            </Container>
        </>
    )
}