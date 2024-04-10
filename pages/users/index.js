import { getUsers } from "@/lib/userActions";
import { useState, useEffect } from "react";
import { Button, Card, ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import bike_styles from '../../styles/Bikes.module.css'
import Link from "next/link";

export default function Users() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getUsers();
            setUsers(data);
        }
        fetchData();
    }, []);

    if (!users) return null

    return (
        <>
            <br/>
            <center><h2 style={{fontFamily: 'rethink'}}>Users</h2></center>
            <br/>
            <Container>
                <Row>
                    {users.map((user) => {
                        return (
                            <Col sm={12} md={12} key={user._id}>
                                <Form>
                                    <Card className={bike_styles.custom_card}>
                                        <Card.Body>
                                            <Card.Title><Link href={`/users/${user.email}`} passHref legacyBehavior>{user.fullName}</Link></Card.Title>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                                            <ListGroup.Item>Admin: {user.admin ? "True" : "False"} 
                                            </ListGroup.Item>                                        
                                        </ListGroup>
                                    </Card>
                                </Form>
                                <br/>
                            </Col>      
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}