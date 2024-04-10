import { jwtDecode } from "jwt-decode";

function setToken(token){
  localStorage.setItem('access_token', token);
}

export function removeToken(){
  localStorage.removeItem('access_token');
}

export function getToken(){
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function readToken(){
    const token = getToken();
    return (token) ? { decoded: jwtDecode(token), raw: token } : null;
}

export function isAuthenticated(){
  const token = readToken();  
  return (token) ? true : false;
}

export function isAuthUser(){
  const token = readToken();
  if (token == null)
  {
      return false
  }
  else
  {
      return (token.decoded.authadmin) ? true : false;
  }
}



export async function registerRegUser(email, password, fullName, phoneNumber) {
    console.log("API_URL:", process.env.API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({email, password, fullName, phoneNumber}),
        headers: {
          'content-type': 'application/json',
        },
      });
    
      const data = await res.json();
    
      if (res.status === 200) {
        return true;
      } else {
        throw new Error(data.message);
      }
}

export async function registerAdminUser(email, password, fullName, phoneNumber, admin) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registeradmin`, {
      method: 'POST',
      body: JSON.stringify({email, password, fullName, phoneNumber, admin}),
      headers: {
        'content-type': 'application/json',
        'Authorization': `JWT ${token}`
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      return true;
    } else {
      throw new Error(data.message);
    }
}

export async function login(email, password) {
  console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {
      'content-type': 'application/json',
    },
  });

  const data = await res.json();
  console.log(res.status)

  if (res.status === 200) {
      setToken(data.token);
      return true;
  } else {
      throw new Error(data.message);
  }
}

export async function getBikes() {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bikes`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  // const data = await res.json();
  // console.log(res.status)

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
      return [];
  }
}

export function isAdmin(){
  const token = readToken();
  if (token == null)
  {
      return false
  }
  else
  {
      return (token.decoded.admin) ? true : false;
  }
}

// create function to add bike
export async function addBike(brand, model, type, wheelSize, frame_material, suspension_type, price, available_quantity) {
  const token = await getToken()
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addBike`, {
    method: 'POST',
    body: JSON.stringify({brand, model, type, wheelSize, frame_material, suspension_type, price, available_quantity}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function getBike(model){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBike`, {
    method: 'POST',
    body: JSON.stringify({model}),
    headers: {
      'content-type': 'application/json',
    },
  });

  if(res.status === 200){
    const data = await res.json();
    return data;
  }
  else{
    return [];
  }
}

export async function getUserPayment(email){
  const token = await getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userpayment`, {
    method: 'POST',
    body: JSON.stringify({email}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status == 200) {
    const data = await res.json();
    return data;
  } 
  else {
    return [];
  }
}

export async function deletePayment(email, num){
  const token = await getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deletepayment`, {
    method: 'POST',
    body: JSON.stringify({email, num}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if(res.status == 200){
    return true;
  }
  else{
    return false;
  }
}

export async function addPayment(email, cardNum, name, expiry, cvv, postalCode){
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addpayment`, {
    method: 'POST',
    body: JSON.stringify({email, cardNum, name, expiry, cvv, postalCode}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updatePayment(email, cardNum, name, expiry, cvv, postalCode){
  const token = await getToken()
  
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatepayment`, {
    method: 'POST',
    body: JSON.stringify({email, cardNum, name, expiry, cvv, postalCode}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });
}

export async function getCard(email, cvv){
  const token = await getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getpayment`, {
    method: 'POST',
    body: JSON.stringify({email, cvv}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if(res.status == 200){
    const data = await res.json();
    return data;
  }
  else{
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  }
}

export async function purchase(brand, model, price){
  const token = getToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase`, {
    method: 'POST',
    body: JSON.stringify({brand, model, price}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if(res.status === 200){
    const data = await res.json();
    return data;
  }
  else{
    return("https://www.google.com/");
  }
}

export async function updateQuantity(model){
  const token = getToken();

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatequantity`, {
    method: 'POST',
    body: JSON.stringify({model}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });
}

export async function sendReset(email){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset`, {
    method: 'POST',
    body: JSON.stringify({email}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function setNewPassword(resetCode, newPass){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newpass`, {
    method: 'POST',
    body: JSON.stringify({resetCode, newPass}),
    headers: {
      'content-type': 'application/json',
    },
  });

  if(res.status === 456){
    return 456;
  }
  else if(res.status === 421){
    return 421;
  }
  else{
    return 200;
  }
}




//capstone-fe\.env
//.env