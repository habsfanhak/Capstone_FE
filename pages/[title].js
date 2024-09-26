import { getBlogs, getBlogByTitle } from "@/lib/userActions";
import { Container, Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import register_styles from '../styles/Register.module.css';

export default function BlogPerPage(){
    const [blog, setBlog] = useState([]);
    const [text, setText] = useState("");
    const router = useRouter();
    const { title } = router.query;

    // Only execute the replacement if title is defined
    // const fixedTitle = title ? title.replace(/%20/g, " ") : null;
    // console.log("Fixed Title: ", fixedTitle);



    useEffect(() => {
        // Fetch data only when fixedTitle is available
        // if (fixedTitle) {
        //     async function fetchData() {

        //         const data = await getBlogByTitle(fixedTitle);
        //         setBlog(data);
        //         console.log(blog);
        //     }
        //     fetchData();
        // }
        async function fetchData() {
            setText(title);
            const data = await getBlogByTitle(text);
            //setBlog(data);
            //console.log(blog);
            console.log(title)
            setBlog(data);
            console.log(blog);
        }
        fetchData();
    }, []); // Add fixedTitle as a dependency

    return (
        <>
            <br/>
            <Container>
                {blog && (
                    <Card>
                        <Card.Body>
                            <Card.Title>{blog.title}</Card.Title>
                            <Card.Text>
                                {blog.content}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </>
    );
}
