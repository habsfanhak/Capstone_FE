import {Form, Button, Container, Card, Alert} from 'react-bootstrap';
import { useState } from 'react';
import {useRouter} from 'next/router';

import { addBike } from '@/lib/userActions';

import addBike_styles from '../styles/Addbike.module.css';



export default function AddBike() {

    const router = useRouter();

    const [bike, setBike] = useState({
        brand: '',
        model: '',
        type: '',
        wheelSize: '',
        frame_material: '',
        suspension_type: '',
        gear_type: '',
        price: '',
        available_quantity: '',
    });
    
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [type, setType] = useState("");
    const [wheelSize, setWheelSize] = useState("");
    const [frame_material, setFrame_material] = useState("");
    const [suspension_type, setSuspension_type] = useState("");
    const [price, setPrice] = useState("");
    const [available_quantity, setAvailable_quantity] = useState("");
    const [image, setImage] = useState(null);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await addBike(brand, model, type, wheelSize, frame_material, suspension_type, price, available_quantity, image);
            setSuccess("Bike added successfully");
        }catch(err){
            setWarning(err.message);
        }
    }

    return (
        <>
        <br/>
        <Container style={{marginTop: '6vh'}}>
            <Card className={addBike_styles.custom_card}>
                <Card.Body>
                    <div>
                        <h2>Add Bike</h2>
                        Enter bike details below:
                    </div>
                </Card.Body>
            </Card>
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
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" required onChange={handleFileChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" required placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" required placeholder="Enter model" value={model} onChange={(e) => setModel(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control type="text" required placeholder="Enter type" value={type} onChange={(e) => setType(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Wheel Size</Form.Label>
                            <Form.Control type="text" required placeholder="Enter wheel size" value={wheelSize} onChange={(e) => setWheelSize(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Frame Material</Form.Label>
                            <Form.Control type="text" required placeholder="Enter frame material" value={frame_material} onChange={(e) => setFrame_material(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Suspension Type</Form.Label>
                            <Form.Control type="text" required placeholder="Enter suspension type" value={suspension_type} onChange={(e) => setSuspension_type(e.target.value)} />
                        </Form.Group>
                        {/* gear type */}
                        <Form.Group>
                            <Form.Label>Gear Type</Form.Label>
                            <Form.Control type="text" required placeholder="Enter gear type" value={bike.gear_type} onChange={(e) => setBike({...bike, gear_type: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" required placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Available Quantity</Form.Label>
                            <Form.Control type="text" required placeholder="Enter available quantity" value={available_quantity} onChange={(e) => setAvailable_quantity(e.target.value)} />
                        </Form.Group>
                        <br/>
                        <Button variant="primary" type="submit">
                            Add Bike
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>
    )

}