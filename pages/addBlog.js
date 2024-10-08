import {Form, Button, Container, Card, Alert} from 'react-bootstrap';
import { useState } from 'react';
import {useRouter} from 'next/router';

import { addBlog } from '@/lib/userActions';

import addBlog_styles from '../styles/Addblog.module.css';



export default function AddBlog() {

    const router = useRouter();

    
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");

    
    // state for blogs
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogType, setBlogType] = useState("");
    const [blogImage, setBlogImage] = useState(null);


    const handleFileChange = (event) => {
        setBlogImage(event.target.files[0]);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await addBlog(blogTitle, blogAuthor, blogContent, blogType, blogImage);
            setSuccess("Blog added successfully");

            // set the states to empty
            setBlogTitle("");
            setBlogAuthor("");
            setBlogContent("");
            setBlogType("");
            setBlogImage(null);
        }catch(err){
            setWarning(err.message);
        }
    }

    return (
        <>
        <br/>
        <Container>
            <Card className={addBlog_styles.custom_card}>
                <Card.Body>
                    <div>
                        <h2>Add Blog</h2>
                        Enter the details of the blog you want to add for the Home Page:
                    </div>
                </Card.Body>
            </Card>
            <br/>
            {warning && <>
                <br />
                <Alert variant='danger'>
                    {warning}
                </Alert>
            </>}
            {success && <>
                <br />
                <Alert variant='success'>
                    {success}
                </Alert>
            </>}
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" required onChange={handleFileChange}/>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" required placeholder="Enter Title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" required placeholder="Enter Author" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" required placeholder="Enter Content" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} rows={10} />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Select value={blogType} onChange={(e)=> setBlogType(e.target.value)}>
                                <option>Open this select option</option>
                                <option value="Event">Event</option>
                                <option value="News">News</option>
                            </Form.Select>
                        </Form.Group>
                       
                        <br/>
                        <Button variant="primary" type="submit">
                            Add Blog
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>
    )

}