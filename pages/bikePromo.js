import { getBike } from "@/lib/userActions";
import { Container, Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import register_styles from '../styles/Register.module.css'
import Image from "next/image";
import { Form } from "react-bootstrap";
import { getSalePrice, addSale, deleteSale } from "@/lib/userActions";

export default function Bike(){
    const [bike, setBike] = useState();
    const [sale, setSale] = useState(null);
    const [salePrice, setSalePrice] = useState();
    const router = useRouter();
    const model = router.query.model;

    useEffect(() => {
        async function fetchData() {
            const data = await getBike(model);
            setBike(data);

            const s = await getSalePrice(model);
            setSale(s);
        }
        fetchData();
    }, [model]);

    if(!bike){
        return (<><div><p>Loading....</p><p/></div></>)
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            await addSale(model, salePrice);
            setSale(salePrice)
        }catch(err){
            console.log(err);
        }
    }

    async function handleDeleteSale(e) {
        e.preventDefault();

        try{
            await deleteSale(model);
            setSale(null)
        }catch(err){
            console.log(err);
        }
    }

    return(
        <>
            <br/>
            <Container style={{marginTop: '6vh'}}>
                {bike.image && <img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${bike.image}`} alt="Placeholder" width={300} height={200}></img>}
                <Card className={register_styles.custom_card}>
                    <Card.Body>
                        <div>
                            <h2>{bike.brand} {" - "} {bike.model}</h2>
                        </div>
                        <br/>
                        <div>
                            <p><b>Description:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed felis nibh. Nunc suscipit
                             laoreet purus, ut aliquam ex tempor sed. Aliquam sit amet finibus ex. Proin varius vitae lacus at faucibus. 
                             Praesent sit amet est tellus. Donec sit amet libero nisl. 
                             Aenean hendrerit ultrices dolor, in tincidunt tortor tristique a. 
                             Pellentesque felis ex, sodales eget dolor eu, congue ultrices lacus. 
                             Etiam scelerisque sem sit amet mauris sollicitudin, convallis luctus urna aliquam. 
                             Fusce imperdiet suscipit massa quis dapibus.</p>
                        </div>
                        <br/>
                        <div>
                            <p><h4>Details:</h4></p>
                            <p><b>Brand:</b> {bike.brand}</p>
                            <p><b>Model:</b> {bike.model}</p>
                            <p><b>Price:</b> CAD ${bike.price}</p>
                            <p><b>Quantity In Stock:</b> {bike.available_quantity}</p>
                        </div><br/>
                        <hr/>
                        <br/>
                        {!sale && <>
                            <h4>Start Sale</h4>
                            <Form className={register_styles.custom_card} onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Sale Price:</Form.Label>
                                    <Form.Control required type="number" style={{ width: '150px' }} id="price" name="price" placeholder="$" onChange={e => setSalePrice(e.target.value)} /> 
                                 </Form.Group><br/>
                                 <Button type="submit" variant="success">Start Sale</Button>
                            </Form>
                        </>}

                        {sale && <>
                            <h4>Current Sale</h4>
                            <p><b>Price:</b> $ {sale}</p><br/>
                            <Button variant="danger" onClick={handleDeleteSale}>End Sale</Button>
                        </>}
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}