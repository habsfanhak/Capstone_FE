import { Button, Card, ListGroup } from 'react-bootstrap';
import { getBikes } from "@/lib/userActions";
import { useState, useEffect } from "react";

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
            <div>
                {bikes.map((bike) => {
                    return (
                        <Card key={bike._id}>
                            <Card.Body>
                                <Card.Title>{bike.brand}</Card.Title>
                                <Card.Text>
                                    {bike.model}
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>Price: ${bike.price}</ListGroup.Item>
                            </ListGroup>
                            <Card.Body>
                                <Button variant="primary">Add to Cart</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
                
            </div>
        </>
    )
}