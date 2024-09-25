import {Form, Button, Container, Card, Alert, ListGroup} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {useRouter} from 'next/router';


import { getBlogs, deleteBlogByTitle } from '@/lib/userActions';

import addBlog_styles from '../styles/Addblog.module.css';



export default function Dashboard() {

    const router = useRouter();

    const [blogs, setBlogs] = useState([]);
    
    
    async function handleDelete(title) {
        try{
            console.log(title);
            await deleteBlogByTitle(title);
            setBlogs(await getBlogs());
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = await getBlogs();
            setBlogs(data);
        }
        fetchData();

        handleDelete();
    }, []);
    

    return (
        <>
        <br/>
        <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Dashboard</h2>
                <Button variant="primary" onClick={() => router.push("/addBlog")}>Add Blog</Button>
            </div>
            <br />
            <ListGroup>
                {blogs.map((blog) => (
                    <ListGroup.Item key={blog.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>{blog.title}</div>
                        <Button variant="danger" onClick={() => handleDelete(blog.title)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
        </>
    )

}