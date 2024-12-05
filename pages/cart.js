import { Form, Button, Container, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import register_styles from '../styles/Register.module.css';
import { getUserCart } from '@/lib/userActions';
import { readToken } from '@/lib/userActions';
import { getBike } from '@/lib/userActions';
import { updateCartQty } from '@/lib/userActions';
import { removeFromCart } from '@/lib/userActions';
import bike_styles from '../styles/Bikes.module.css'


export default function Cart() {
  const token = readToken();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
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
  }, [count]);


  const handleQuantityChange = async (index, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    
    if (!isNaN(quantity) && quantity >= 1 && quantity <= cart[index].available_quantity) {
      
      const updatedQuantities = [...quantities];
      updatedQuantities[index] = quantity;
      setQuantities(updatedQuantities);
      
      try {
        await updateCartQty(token.decoded.email, updatedQuantities); 
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
  };

  const handleRemove = async (bike) => {
    await removeFromCart(token.decoded.email, bike.model);
    setCount(count + 1);
  }


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
      <Container style={{marginTop: '6vh'}} className={bike_styles.rethink}>
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
                      min="1"
                      max={bike.available_quantity}
                      step="1"
                      inputMode="none"
                      style={{ width: '100px', marginLeft: '10px' }}
                    />
                  </Card.Text>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Card.Text style={{ fontSize: '0.8rem' }}>
                    <strong>{bike.available_quantity}</strong> left in stock
                  </Card.Text>
                  <Button
                    onClick={() => handleRemove(bike)}
                    variant="outline-danger"
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.9rem',
                      borderRadius: '5px',
                      width: '100px',
                    }}
                  >
                    Remove
                  </Button>
                </div>
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
