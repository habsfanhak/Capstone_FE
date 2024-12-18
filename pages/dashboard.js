import {Form, Button, Container, Card, Alert, ListGroup, Row, Col} from 'react-bootstrap';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { isAuthenticated, readToken, getBikes } from '@/lib/userActions';
import {useRouter} from 'next/router';
import register_styles from '../styles/Register.module.css'
import bike_styles from '../styles/Bikes.module.css'
import { getPromoCodes, addPromoCode, deletePromoCode, updateBikeVisibility } from '@/lib/userActions';


import { getBlogs, deleteBlogByTitle } from '@/lib/userActions';

import addBlog_styles from '../styles/Addblog.module.css';



export default function Dashboard() {

    const router = useRouter();

    const [blogs, setBlogs] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [codes, setCodes] = useState([]);
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState();
    
    
    async function handleDeleteBlog(title) {
        try{
            console.log(title);
            await deleteBlogByTitle(title);
            setBlogs(await getBlogs());
        }catch(err){
            console.log(err);
        }
    }

    async function handleDeleteCode(code) {
        try{
            await deletePromoCode(code);
            setCodes(await getPromoCodes());
        }catch(err){
            console.log(err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            await addPromoCode(code, discount);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = await getBlogs();
            setBlogs(data);

            const b = await getBikes();
            setBikes(b);

            const c = await getPromoCodes();
            setCodes(c);
        }
        fetchData();

        handleDeleteBlog();
        handleDeleteCode();
    }, [codes]);

    async function handleVisibilityChange(bikeModel, currentVisibility) {
        try {
            const newVisibility = !currentVisibility;
            await updateBikeVisibility(bikeModel, newVisibility);
            // Update the local state to reflect the change
            setBikes(bikes.map(bike =>
                bike.model === bikeModel ? { ...bike, isVisible: newVisibility } : bike
            ));
        } catch (error) {
            console.error("Error updating bike visibility:", error);
        }
    }
    
    if (!blogs) return null
    // console.log(blogs)

    return (
        <>
        <br/>
        <Container style={{marginTop: '6vh'}} className={bike_styles.rethink}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard</h1>
            </div><br/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Blogs</h2>
                <Button variant="primary" onClick={() => router.push("/addBlog")}>Add Blog</Button>
            </div>
            <br />
            <ListGroup>
                {blogs.map((blog) => (
                    <ListGroup.Item key={blog.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>{blog.title}</div>
                        <Button variant="danger" onClick={() => handleDeleteBlog(blog.title)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup><br/>
            <hr/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Promotion Options</h2>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Discount Codes</h4><br/>
            </div><br/>
            <h5>Active Codes</h5>
            {codes.map((promoCode) =>{
                return(
                    <Row key={promoCode.code} className="align-items-center mb-3">
                    <Col xs={9} md={10}>
                        <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <span><b>{promoCode.code}</b> - {promoCode.discount}% Off</span>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3} md={2} className="text-end">
                        <Button variant="danger" onClick={() => handleDeleteCode(promoCode.code)}>Delete</Button>
                    </Col>
                    </Row>
                );
            })}
            <br/>
            <h5>Create New Code</h5>
            <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Code:</Form.Label>
                            <Form.Control required type="text" id="code" name="code" onChange={e => setCode(e.target.value)} /> 
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Discount %:</Form.Label>
                            <Form.Control required type="number" style={{ width: '75px' }} id="discount" name="discount" step={"1"} min={"0"} max={"100"} onChange={e => setDiscount(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col>
        
                    </Col>
                </Row><br/>
                <Button variant="primary" type="submit">Create Code</Button>
            </Form><br/>
            <hr/>
            <h4>Manage Bike Discounts</h4><br/>
            <Row>
                {bikes.map((bike) => {
                    return (
                        <Col sm={12} md={4} key={bike._id}>
                            <Card className={bike_styles.custom_card}>
                                <Card.Body>
                                    {bike.image && <Card.Img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${bike.image}`} />}
                                    <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{bike.brand}</span>
                                    </Card.Title>
                                    <Card.Text>
                                        {bike.model}
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>Type: {bike.type}</ListGroup.Item>

                                    <ListGroup.Item>Price: ${bike.price}</ListGroup.Item>
                                    <ListGroup.Item>Available: {bike.available_quantity || 'Not Available'}</ListGroup.Item>
                                </ListGroup>
                                <Card.Body> 
                                    <Button variant="outline-primary"><Link href={`/bikePromo?model=${bike.model}`}>Manage</Link></Button>
                                    &nbsp;
                                    <Button variant="outline-info"><Link href={`/updateQuantity?model=${bike.model}`}>Update Quantity</Link></Button>
                                    <br />
                                    <br />
                                    <Form.Check 
                                        type="switch" 
                                        id={`customSwitch${bike._id}`} 
                                        label={bike.isVisible ? "Hide Bike" : "Show Bike"}   
                                        checked={!bike.isVisible} 
                                        onChange={() => handleVisibilityChange(bike.model, bike.isVisible)} 
                                    />
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