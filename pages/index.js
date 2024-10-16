import { Container, Card, Button } from "react-bootstrap";
import { getBlogs } from '../lib/userActions'

import { useSpring, animated } from 'react-spring';

import {useState, useEffect, useRef } from'react';
import { useRouter } from 'next/router';

import styles from '../styles/Navbar.module.css'

import Link from 'next/link';

export default function Home() {

  const router = useRouter();
  const [blogs, setBlogs] = useState([]);

  const [isVideoVisible, setVideoVisible] = useState(false);
  const [isLogoVisible, setLogoVisible] = useState(false);
  const [initImg, setInitImg] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getBlogs();
      console.log(data);
      setBlogs(data);
      console.log(blogs);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Delay the rendering of the logo for 2 seconds
    const logoDelayTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 2000);

    // Delay the visibility of the video for 2.5 seconds (0.5 seconds after the logo)
    const videoDelayTimer = setTimeout(() => {
      setVideoVisible(true);
    }, 2500);

    // Clear the timers on component unmount
    return () => {
      clearTimeout(logoDelayTimer);
      clearTimeout(videoDelayTimer);
    };
  }, []);

  useEffect(() => {
    if (initImg) {
      const delayTimer = setTimeout(() => {
        setInitImg(false);
      }, 2000); // Adjust the delay time as needed
      return () => clearTimeout(delayTimer);
    }
  }, [initImg]);

  const logoAnimation = useSpring({
    opacity: isLogoVisible ? 0 : 1,
    from: { opacity: 1 },
    config: { tension: 50, friction: 20, duration: 500 },
  });

  const videoAnimation = useSpring({
    opacity: isVideoVisible ? 1 : 0,
    from: { opacity: 0 },
    config: { tension: 155, friction: 20, delay: 500 },
  });

  
  

  return (
    <>
        {/* Beginning Animations + Title Video */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh', backgroundColor: '#000000' }}>
        {/* Video */}
        <animated.video
          autoPlay
          loop
          muted
          playsInline
          disableRemotePlayback
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
            ...videoAnimation
          }}
        >
          <source type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"' src="/promo.mp4"/>
        </animated.video>

         {/* Logo */}
         <animated.img
          src="/bike.svg"
          alt="Logo"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            ...logoAnimation,
          }}
        />
        </div>
      <br/>

      <Container className={styles.rethink} style={{marginTop: '10vh'}}>
        Welcome to bike shop, the premier destination for purchasing and servicing your cycle. Feel free to browse our selection or book an appointment.
      </Container>

      <div style={{
  width: '99vw',
  height: '30vh',
  backgroundImage: 'url(/road.jpg)', // Path to your image
  backgroundSize: 'cover', // This ensures the image covers the div and is cropped if necessary
  backgroundPosition: 'center', // This keeps the image centered
  backgroundRepeat: 'no-repeat', // No image repetition
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
  textAlign: 'center',
  marginTop: '5vh',
}}>
  <h1 className={styles.bebas}>Explore New Roads</h1>
</div>


        <Container>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "20px", marginTop: '4vh' }}>
  {blogs.map((blog) => (
    <div key={blog.id} style={{ width: "calc(50% - 10px)", margin: "5px" }}>
      <Link href={`/${blog._id}`} passHref legacyBehavior>
        <a target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card 
            style={{ 
              width: '100%', 
              height: '400px', 
              backgroundImage: `url(https://res.cloudinary.com/dm5pccmxq/image/upload/${blog.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              color: 'white', 
              position: 'relative' 
            }}
          >
            <Card.Body style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', height: '100%' }}>
              <Card.Title>{blog.title}</Card.Title>
              <Card.Text>
                {blog.content.substring(0, 50)}...
              </Card.Text>
            </Card.Body>
          </Card>
        </a>
      </Link>
    </div>
  ))}
</div>
</Container>
    </>
  );
}
