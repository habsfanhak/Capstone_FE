import { Container, Card } from "react-bootstrap";
import { getBlogs } from '../lib/userActions'

import {useState, useEffect, useRef } from'react';
import { useRouter } from 'next/router';



export default function Home() {

  const router = useRouter();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogs();
      console.log(data);
      setBlogs(data);
      console.log(blogs);
    }
    fetchData();
  }, []);

  

  
  

  return (
    <>
      <br/>

      <Container>
        Home Page
      </Container>
      <br/>
      <Container>

      <div style={{width: "90%", overflow:'scroll', whiteSpace: 'nowrap'}}>
        {blogs.map((blog) => (
          <div key={blog.id} style={{width: "50%", display: "inline-block", margin: "10px", scrollSnapAlign: 'start'}}>
            <Card style={{ width: '30rem' }}>
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <br/>
                <Card.Text>
                  {blog.content.substring(0, 50)}...
                </Card.Text>
                <br/>
                <button onClick={() => router.push(`/${blog.title}`)}>Read More</button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      </Container>

      
    </>
  );
}
