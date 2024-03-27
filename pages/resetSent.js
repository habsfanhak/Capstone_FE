import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";

export default function ResetSent(){
    const router = useRouter()
    
    async function nextPage(e){
        e.preventDefault();
        router.push("/resetPass")
    }
    return(
        <>
            <Container>
                <br/><br/><br/><br/>
                <h1>Password Reset Link Has Been Sent To Your Email</h1>
                <p>Please check you email to reset your password. Continue to password reset once you have received your code</p>
                <br /><br />
                <Button variant="primary" onClick={nextPage}>Reset Password</Button>
            </Container>
        </>
    )
}