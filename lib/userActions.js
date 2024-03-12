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


export async function registerRegUser(email, password, fullName, phoneNumber) {
    console.log("API_URL:", process.env.API_URL);
    const res = await fetch(`http://localhost:8080/register`, {
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

export async function login(email, password) {
  const res = await fetch(`http://localhost:8080/login`, {
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