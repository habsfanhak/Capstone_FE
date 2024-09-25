import { Container, Carousel } from "react-bootstrap";

import { getBlogs } from '@/lib/userActions';

import {useEffect, useState} from'react';

import { useRouter } from 'next/router';



export default function Home() {

  const router = useRouter();


  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
        const data = await getBlogs();
        console.log(data);  // logging fetched data for testing purposes. Replace with your logic to handle the data.  // You can fetch data from your backend API or any other source.
        setBlogs(data);
    }
    fetchData();
  
  }, []);

  return (
    <>
    <br/>

      <Container>
        Home Page

        <Carousel>
          {blogs.map((blog) => (
            <Carousel.Item key={blog._id}>
            
              <Carousel.Caption>
                <h3>{blog.title}</h3>
                <p>{blog.author}</p>
                <p>{blog.content}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      


      </Container>


      
    </>
  );
}
