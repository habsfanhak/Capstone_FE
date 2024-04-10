import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSingleUser, updateSingleUser, deleteSingleUser } from '@/lib/userActions';
import { Button, Card, ListGroup, Container, Row, Col, Form, Alert } from 'react-bootstrap';


export default function User() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const { email} = router.query

    //Messages
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchData() {
            const data = await getSingleUser(email);
            setUser(data);
        }
        fetchData();
    }, []);

    if (!user) return null

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            await updateSingleUser(user[0].email, user[0].admin, user[0].fullName)
            setSuccess("User updated successfully.")
            setWarning("");
        }catch(err){
            setSuccess("")
            setWarning(err.message);
        }


    }

    async function handleDelete(e) {
        e.preventDefault();

        try{
            await deleteSingleUser(email)
            router.push("/users")
        }catch(err){
            setSuccess("")
            setWarning(err.message);
        }


    }

    return (
        <>
            <br/>
            <br/>
            <Container style={{fontFamily: 'rethink'}}>
                {warning && <>
                    <br />
                    <Alert variant='danger'>
                        {warning}
                    </Alert>
                </>}

                {success && <>
                    <br />
                    <Alert variant='success'>
                        {success}
                    </Alert>
                </>}

                <Row>
                    <Col sm={12} md={12}>
                        <Form onSubmit={handleSubmit}>
                            <h2>{user[0].fullName}</h2>
                            <hr/>
                            <Form.Group >
                                <Form.Label>Admin:</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="program-page-switch"
                                    checked={user[0].admin}
                                    onChange={(e) => {
                                        setUser([{ ...user[0], admin: e.target.checked }]);
                                    }}
                                />
                            </Form.Group>
                            <br/>

                            <Form.Group >
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="text" defaultValue={user[0].email} onChange={(e) => {setUser([{ ...user[0], email: e.target.value }]);}} disabled/>
                            </Form.Group>
                            <br/>

                            <Form.Group >
                                <Form.Label>Full Name:</Form.Label>
                                <Form.Control type="text" defaultValue={user[0].fullName} onChange={(e) => {setUser([{ ...user[0], fullName: e.target.value }]);}}/>
                            </Form.Group>
                            <br/>


                            <Button type="submit">Submit Changes</Button>
                        </Form>
                        <hr/>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={handleDelete}>Delete User</Button>
                    </Col>      
                </Row>
            </Container>
        </>
    )


}