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
    mode: 'no-cors', 
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