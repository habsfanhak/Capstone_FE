import { getBlogByTitle } from "@/lib/userActions";
import { Container, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css';

export default function BlogPerPage(){
    const [blog, setBlog] = useState(null);  // Initialize as null
    const router = useRouter();
    const { _id } = router.query;

    useEffect(() => {
        async function fetchData() {
            if (_id) { // Ensure _id exists before making the call
                try {
                    const data = await getBlogByTitle(_id);
                    setBlog(data);
                    console.log("Fetched blog:", data);  // Log fetched data
                } catch (error) {
                    console.error("Error fetching blog:", error);
                }
            }
        }

        fetchData();
    }, [_id]);  // Add _id as a dependency

    if (!blog) return null;

    return (
        <>
            <br/>
            <Container>
                <Card>
                    <Card.Body>
                        {blog[0].image && <Card.Img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${blog[0].image}`} />}
                        <Card.Title>{blog[0].title}</Card.Title>  {/* Access blog.title */}
                        <Card.Text>
                            {blog[0].content}  {/* Access blog.content */}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
