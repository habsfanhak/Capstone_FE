import { Button, Container } from "react-bootstrap"
import { useRouter } from "next/router";

export default function PaymentFailed(){
    const router = useRouter();

    function returnBikes(e){
        e.preventDefault();
        router.push("/bikes");
    }

    return(
        <>
            <Container>
                <br/><br/><br/><br/>
                <h1>The Payment Has Failed</h1>
                <p>Please try again</p>
                <br /><br />
                <Button variant="primary" onClick={returnBikes}>Return Home</Button>
            </Container>
        </>
    )
}