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

export async function addFavourite(email, bike) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourite`, {
      method: 'POST',
      body: JSON.stringify({email, bike}),
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

export async function removeFavourite(email, bike) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourite`, {
      method: 'DELETE',
      body: JSON.stringify({email, bike}),
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

export async function getFavourites(email) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getFavourites`, {
    body: JSON.stringify({email}),
    method: 'POST',
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

export async function getUsers() {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
      return [];
  }
}

export async function getSingleUser(email) {
  console.log(email)
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/singleuser`, {
    method: 'PUT',
    body: JSON.stringify({email}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
      return [];
  }
}

export async function searchBikes(field) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/findBikeHome`, {
    method: 'POST',
    body: JSON.stringify({field}),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
      return [];
  }
}


export async function updateSingleUser(email, admin, fullName) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/singleuser`, {
    method: 'POST',
    body: JSON.stringify({email, admin, fullName}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
    throw new Error(data.message);
  }
}

export async function deleteSingleUser(email) {
  const token = await getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/singleuser`, {
    method: 'DELETE',
    body: JSON.stringify({email}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if (res.status === 200) {
      const data = await res.json();
      return data;
  } else {
    throw new Error(data.message);
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
export async function addBike(brand, model, type, wheelSize, frame_material, suspension_type, price, available_quantity, image) {
  const token = await getToken()

  const imageData = await getImageAsBase64(image)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addBike`, {
    method: 'POST',
    body: JSON.stringify({brand, model, type, wheelSize, frame_material, suspension_type, price, available_quantity,  image: imageData }),
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

export async function purchase(items, price){
  const token = getToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase`, {
    method: 'POST',
    body: JSON.stringify({items, price}),
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

async function getImageAsBase64(image) {
  return new Promise((resolve, reject) => {
    if (typeof image === 'string' && image.startsWith('data:image')) {
      resolve(image.split(',')[1]);
    } else {
      const blob = new Blob([image]);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    }
  });
}


// functions for blogs

export async function addBlog(title, author, content, type, image) {
  const token = await getToken()

  const imageData = await getImageAsBase64(image)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addBlog`, {
    method: 'POST',
    body: JSON.stringify({image: imageData, title, author, content, type }),
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




export async function getBlogs(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBlogs`, {
    method: 'GET',
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


export async function getBlogByTitle(id){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getBlogByTitle`, {
    method: 'PUT',
    body: JSON.stringify({id}),
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


export async function deleteBlogByTitle(title){
  const token = await getToken()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteBlogByTitle`, {
    method: 'DELETE',
    body: JSON.stringify({title}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  });

  if(res.status === 200){
    return true;
  }
  else{
    return false;
  }
}

export async function getPromoCodes(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getPromoCodes`, {
    method: 'GET',
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

export async function getDiscount(code){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getDiscount`, {
    method: 'POST',
    body: JSON.stringify({code}),
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

export async function addPromoCode(code, discount){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addPromoCode`, {
    method: 'POST',
    body: JSON.stringify({code, discount}),
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

export async function deletePromoCode(code){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deletePromoCode`, {
    method: 'POST',
    body: JSON.stringify({code}),
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

export async function getSalePrice(model){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getSalePrice`, {
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
    return null;
  }
}

export async function addSale(model, price){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addSale`, {
    method: 'POST',
    body: JSON.stringify({model, price}),
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

export async function deleteSale(model){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteSale`, {
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

export async function getUserCart(email) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getCart`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (res.status === 200) {
    const data = await res.json();
    return {
      cart: data.cart,
      quantity: data.quantity,
    };
  } else {
    return null;
  }
}

export async function addToCart(email, model){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addToCart`, {
    method: 'POST',
    body: JSON.stringify({email, model}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updateCartQty(email, qty){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateCartQty`, {
    method: 'POST',
    body: JSON.stringify({email, qty}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updateBikeQuantity(model, quantity){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateBikeQuantity`, {
    method: 'POST',
    body: JSON.stringify({model, quantity}),
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

export async function updateBikeVisibility(model, visibility){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateBikeVisibility`, {
    method: 'POST',
    body: JSON.stringify({model, visibility}),
    headers: {
      'content-type': 'application/json',
    },
  });

  if(res.status === 200){
    const data = await res.json();
    console.log(data);
    console.log("updated visibility");
    return data;
  }
  else{
    return [];
  }
}


export async function deleteBike(model){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteBike`, {
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




// functions for comments
export async function getComments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getComments`, {
    method: 'GET',
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

export async function addComment(title, comment) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addComment`, {
    method: 'POST',
    body: JSON.stringify({ title, comment }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function toUpdateComment(comment){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toUpdateComment`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updateComment(comment, newComment){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateComment`, {
    method: 'POST',
    body: JSON.stringify({ comment, newComment }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function deleteComment(content){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteComment`, {
    method: 'POST',
    body: JSON.stringify({ content}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function addOrder(email, items, price){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addOrder`, {
    method: 'POST',
    body: JSON.stringify({email, items, price}),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function getOrders(email){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getOrders`, {
    method: 'POST',
    body: JSON.stringify({email}),
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

//capstone-fe\.env
//.env
