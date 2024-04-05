import { Button, Card, ListGroup, Container, Row, Col, Form } from 'react-bootstrap';
import { getBikes } from "@/lib/userActions";
import { useState, useEffect } from "react";
import bike_styles from '../styles/Bikes.module.css'
// import text input


export default function Bikes() {
    const [bikes, setBikes] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const data = await getBikes();
            setBikes(data);
        }
        fetchData();
    }, []);

    async function handleSearch() {
        
        if (search === '') {
            const data = await getBikes();
            setBikes(data);
            setMessage('')
        } else {
            const filteredBikes = bikes.filter(bike => bike.brand.includes(search) || bike.model.includes(search));
            setBikes(filteredBikes);
            if (filteredBikes.length === 0) {
                setMessage('No bikes found')
            } else {
                setMessage('')
            }
        }
    }
    
    return (
        <>
            <br/>
            <center><h2 style={{fontFamily: 'rethink'}}>Bikes</h2></center>
            <br/>

            {/* // add search bar
            // add search button
            // add search functionality */}
            <Container>
            <Row>
                <Col>
                <Form.Control type="text" placeholder="Search by keyword" value={search} onChange={e => setSearch(e.target.value)} />
                </Col>
                <Col>
                <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>
                </Col>
            </Row>
            </Container>
            <br/>
            <br/>

            <Container>
                <Row>
                    {message && <p>{message}</p>}
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
                                <br/>
                            </Col>
                            
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}