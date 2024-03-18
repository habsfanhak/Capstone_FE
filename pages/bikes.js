import { Button, Card, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { getBikes } from "@/lib/userActions";
import { useState, useEffect } from "react";
import bike_styles from '../styles/Bikes.module.css'

export default function Bikes() {
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getBikes();
            setBikes(data);
        }
        fetchData();
    }, []);
    
    return (
        <>
            <br/>
            <center><h2>Bikes</h2></center>
            <br/>
            <Container>
                <Row>
                    {bikes.map((bike) => {
                        return (
                            <Col sm={12} md={4} key={bike._id}>
                                <Card className={bike_styles.custom_card}>
                                    <Card.Body>
                                        <Card.Title>{bike.brand}</Card.Title>
                                        <Card.Text>
                                            {bike.model}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>Type: {bike.type}</ListGroup.Item>
                                        <ListGroup.Item>Frame: {bike.frame_material}</ListGroup.Item>
                                        
                                        <ListGroup.Item>Wheel Size: {bike.wheelSize}</ListGroup.Item>
                                        <ListGroup.Item>Suspension: {bike.suspension_type}</ListGroup.Item>
                                        <ListGroup.Item>Gear Type: {bike.gear_type}</ListGroup.Item>

                                        <ListGroup.Item>Price: ${bike.price}</ListGroup.Item>
                                        <ListGroup.Item>Available: {bike.available_quantity || 'Not Available'}</ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Button variant="primary">Add to Cart</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}