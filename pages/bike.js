import { getBike } from "@/lib/userActions";
import { Container, Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import register_styles from '../styles/Register.module.css'
import Image from "next/image";
import { getSalePrice } from "@/lib/userActions";
import { addToCart } from "@/lib/userActions";
import { readToken } from "@/lib/userActions";

export default function Bike(){
    const token = readToken();
    const [bike, setBike] = useState();
    const [salePrice, setSalePrice] = useState("");
    const router = useRouter();
    const model = router.query.model;

    useEffect(() => {
        async function fetchData() {
            const data = await getBike(model);
            setBike(data);

            const sp = await getSalePrice(model);
            setSalePrice(sp);
        }
        fetchData();
    }, [model]);

    if(!bike){
        return (<><div><p>Loading....</p><p/></div></>)
    }

    function buyItem(){
        router.push(`/checkout?model=${model}`);
    }

    return(
        <>
            <br/>
            <Container style={{marginTop: '6vh'}}>
                <Card className={register_styles.custom_card}>
                {bike.image && <img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${bike.image}`} alt="Placeholder" width={300} height={200}></img>}
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
                            <p><b>Type:</b> {bike.type}</p>
                            <p><b>Wheel Size:</b> {bike.wheelSize}</p>
                            <p><b>Frame Material:</b> {bike.frame_material}</p>
                            <p><b>Suspension Type:</b> {bike.suspension_type}</p>
                            {salePrice && <span><del><b>Price:</b> CAD ${bike.price}</del> <p><b>Price:</b> CAD ${salePrice}</p></span>}
                            {!salePrice && <p><b>Price:</b> CAD ${bike.price}</p> }
                            <p><b>Quantity In Stock:</b> {bike.available_quantity}</p>
                        </div>
                        <br/>
                        <Button variant="primary" size="base" onClick={() => addToCart(token.decoded.email, bike.model)} className="me-2">Add To Cart</Button>
                        <Button variant="success" size="base" onClick={buyItem}>Buy Item</Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}