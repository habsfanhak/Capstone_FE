import { Form, Button, Container, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import register_styles from '../styles/Register.module.css';
import { getUserCart } from '@/lib/userActions';
import { readToken } from '@/lib/userActions';
import { getBike } from '@/lib/userActions';
import { updateCartQty } from '@/lib/userActions';


export default function Cart() {
  const token = readToken();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    async function fetchData() {
      try {
        const userCart = await getUserCart(token.decoded.email);


        if (userCart) {
          const { cart: cartItems, quantity: quantitiesArray } = userCart;
          if (cartItems.length > 0) {
            const bikeItems = await Promise.all(cartItems.map(item => getBike(item)));
            setCart(bikeItems);
            setQuantities(quantitiesArray);
          } else {
            setCart([]);
            setQuantities([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    }


    fetchData();
  }, []);


  const handleQuantityChange = (index, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0 && quantity <= cart[index].available_quantity) {
      setQuantities(prevQuantities => {
        const newQuantities = [...prevQuantities];
        newQuantities[index] = quantity;
        return newQuantities;
      });
    }
  };


  const handleCheckout = async () => {
    try {
      await updateCartQty(token.decoded.email, quantities);
      router.push('/checkoutCart');
    } catch (error) {
      console.error('Error updating cart and proceeding to checkout:', error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <br />
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Cart</h1>
        </div>
        <br />


        {cart.length === 0 && (
          <>
            <br />
            <h4>No items in your cart yet....</h4>
          </>
        )}


        {cart.length > 0 && (
          cart.map((bike, index) => (
            <Card className={register_styles.custom_card} key={index} style={{ width: '40rem', marginBottom: '10px' }}>
              <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: '1' }}>
                        <Card.Title style={{ fontSize: '1.5rem' }}>{bike.brand} - {bike.model}</Card.Title>
                        <Card.Text style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                            <strong>Price:</strong> ${bike.price}
                        </Card.Text>
                    </div>
                    <Card.Text style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                    <strong>Quantity:</strong>
                    <Form.Control
                        type="number"
                        value={quantities[index]}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        min="0"
                        max={bike.available_quantity}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                    </Card.Text>
                </div>
                <Card.Text style={{ fontSize: '0.8rem' }}>
                    <strong>{bike.available_quantity}</strong> left in stock
                </Card.Text>
             </Card.Body>
            </Card>
          ))
        )}
        <br />
        {cart.length > 0 && <Button variant="success" size="base" onClick={handleCheckout}>Checkout</Button>}
      </Container>
    </>
  );
}
