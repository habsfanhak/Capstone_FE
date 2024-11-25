import { getBlogByTitle, addComment, updateComment, deleteComment, toUpdateComment, getComments, readToken, isAuthenticated } from "@/lib/userActions";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import comment_styles from '../styles/Comment.module.css';

export default function BlogPerPage(){
    const [blog, setBlog] = useState(null);  // Initialize as null
    const [comments, setComments] = useState(null);
    const router = useRouter();
    const { _id} = router.query;
    const token = readToken();

    const [mEmail, setMEmail] = useState(token.decoded.email);
    const [mFullName, setMFullName] = useState(token.decoded.fullName);
    const [mDate, setMDate] = useState(new Date().toISOString().split('T')[0]);
    const [mTime, setMTime] = useState(new Date().toLocaleTimeString());

    const [commentUI, setCommentUI] = useState('');
    const [newCommentContentUI, setNewCommentContentUI] = useState(commentUI);

    console.log("Email:", mEmail);
    console.log("Full Name:", mFullName);
    console.log("Date:", mDate);
    console.log("Time:", mTime);


    useEffect(() => {
        async function fetchData() {
            const data = await getBlogByTitle(_id);
            setBlog(data);
            console.log("Fetched blog:", data);  // Log fetched data
            
            
        }

        async function fetchComments() {
            const dataC = await getComments();
            setComments(dataC);
            console.log("Fetched comments:", dataC);  // Log fetched data
        }

        fetchComments();
        

        fetchData();
    }, [_id]);  // Add _id as a dependency

    if (!blog) return null;

    const handleAddComment = async (title, comment, date, email, name, time) => {
        try {
            await addComment(title, comment, date, email, name, time);
            setCommentUI('');
            console.log("Comment added successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    const handleToUpdateComment = async (comment) => {
        try {
            await toUpdateComment(comment);
            console.log("starting to Update Comment successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    }

    const handleUpdateComment = async (comment, newComment, date, time) => {
        try {
            await updateComment(comment, newComment, date, time);
            console.log("Comment updated successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    }

    const handleDeleteComment = async (content) => {
        try {
            await deleteComment(content);
            console.log("Comment deleted successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    return (
        <>
            <br/>
            <Container style={{marginTop: '6vh'}}>
                <Card>
                    <Card.Body>
                        {blog[0]?.image && <Card.Img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${blog[0].image}`} />}
                        <Card.Title>{blog[0]?.title}</Card.Title>  {/* Access blog.title */}
                        <Card.Text>
                            {blog[0]?.content}  {/* Access blog.content */}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <br/>
                <div className={comment_styles.button_container}>
                    <h3>Comment</h3>

                    {isAuthenticated() &&
                    <Form>
                        <Form.Group controlId="comment">
                            <Form.Control as="textarea" rows={5} placeholder={commentUI} value={commentUI} onChange={(e) => setCommentUI(e.target.value)}/>
                        </Form.Group>
                        <br/>
                        <div className={comment_styles.right_align}>
                            
                            {commentUI.length > 0 && <Button variant="primary" onClick={() => handleAddComment(blog[0]?.title, commentUI, mDate, mEmail, mFullName, mTime)}>Post</Button>}
                        </div>
                    </Form>
                    }

                    <hr/>

                    {comments?.filter(comment => comment.blogTitle == blog[0]?.title).length == 0 && <h4>No comments yet.</h4>}
                    
                    

                    {/* display the comments filtering in blog title */}
                    {comments?.filter(comment => comment.blogTitle == blog[0]?.title).map((comment) => (
                        <Card key={comment._id} className={comment_styles.comment_card}>
                            <Card.Body>
                                {/* Check if this comment is being edited */}
                                {comment.toUpdateComment === true ? (
                                    <Form>
                                        <Form.Group controlId="editComment">
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3} 
                                                placeholder={comment.content}
                                                value={newCommentContentUI}    
                                                onChange={(e) => setNewCommentContentUI(e.target.value)} 
                                            />
                                        </Form.Group>
                                        <Button variant="primary" onClick={() => handleUpdateComment(comment.content, newCommentContentUI, mDate, mTime)}>
                                            Save
                                        </Button>
    
                                    </Form>
                                ) : (
                                    <>
                                        {/* <Card.Text>{comment.content}</Card.Text>
                                        <div className={comment_styles.right_align}>
                                            <Button variant="primary" onClick={() => handleToUpdateComment(comment.content)}>Edit</Button>
                                            &nbsp;
                                            <Button variant="danger" onClick={() => handleDeleteComment(comment.content)}>Delete</Button>
                                        </div> */}
                                        <Card.Text>{comment.content}</Card.Text>
                                        <div className={comment_styles.side_by_side}>
                                            <span className={comment_styles.small_text}>Commented by: {comment.fullName}</span>
                                            
                                            <span className={comment_styles.small_text}>Date: {comment.date}, {comment.time}</span>
                                            
                                        </div>

                                        {isAuthenticated() && <div className={comment_styles.right_align}>
                                            
                                            <Button variant="primary" onClick={() => handleToUpdateComment(comment.content)}>Edit</Button>
                                            &nbsp;
                                            <Button variant="danger" onClick={() => handleDeleteComment(comment.content)}>Delete</Button>
                                        </div>}
                                    </>
                                )}
                            

                            </Card.Body>
                        </Card>
                    ))}


                    
                </div>
            </Container>
        </>
    );
}
