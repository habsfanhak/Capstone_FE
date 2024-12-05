import {
    getBlogByTitle,
    addComment,
    updateComment,
    deleteComment,
    toUpdateComment,
    getComments,
    readToken,
    isAuthenticated,
    getReplies,
    addReply,
    toUpdateReply,
    updateReply,
    deleteReply,
    replyingComment,
    commentReplied,
    deleteReplies
} from "@/lib/userActions";

import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import comment_styles from '../styles/Comment.module.css';

export default function BlogPerPage() {
    const [blog, setBlog] = useState(null);  // Initialize as null
    const [comments, setComments] = useState(null);
    const router = useRouter();
    const { _id } = router.query;
    const token = readToken();
    const user = token ? token.decoded : null; // Safely access `decoded` if token exists

    const [mEmail, setMEmail] = useState(user?.email || ""); // Fallback to an empty string
    const [mFullName, setMFullName] = useState(user?.fullName || "Guest");
    const [mDate, setMDate] = useState(new Date().toISOString().split("T")[0]);
    const [mTime, setMTime] = useState(new Date().toLocaleTimeString());

    const [commentUI, setCommentUI] = useState("");
    const [newCommentContentUI, setNewCommentContentUI] = useState(commentUI);

    const [replies, setReplies] = useState(null);
    const [replyUI, setReplyUI] = useState("");
    const [newReplyContentUI, setNewReplyContentUI] = useState(replyUI);


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

        async function fetchReplies() {
            const dataR = await getReplies();
            setReplies(dataR);
            console.log("Fetched replies:", dataR);  // Log fetched data
        }

        fetchComments();

        fetchReplies();


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

    const handleDeleteComment = async (commentID, content) => {
        try {
            await deleteComment(content);
            await deleteReplies(commentID);
            console.log("Comment deleted successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    const handleAddReplyUI = async (comment) => {
        await replyingComment(comment);
        console.log("Replying to comment");
        window.location.reload();
    }



    const handleAddReply = async (commentID, comment, email, fullName, reply) => {
        try {
            await addReply(commentID, email, fullName, reply);
            commentReplied(comment);
            console.log("Reply added successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    }

    const handleToUpdateReply = async (replyID) => {
        try {
            await toUpdateReply(replyID);
            console.log("starting to Update Reply successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error updating reply:", error);
        }
    }

    const handleUpdateReply = async (replyID, newReply) => {
        try {
            await updateReply(replyID, newReply);
            console.log("Reply updated successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error updating reply:", error);
        }
    }

    const handleDeleteReply = async (replyID) => {
        try {
            await deleteReply(replyID);
            console.log("Reply deleted successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting reply:", error);
        }
    }



    return (
        <>
            <br />
            <Container style={{ marginTop: '6vh' }}>
                <Card>
                    <Card.Body>
                        {blog[0]?.image && <Card.Img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${blog[0].image}`} />}
                        <Card.Title>{blog[0]?.title}</Card.Title>  {/* Access blog.title */}
                        <Card.Text>
                            {blog[0]?.content}  {/* Access blog.content */}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <br />
                <div className={comment_styles.button_container}>
                    <h3>Comment</h3>

                    {isAuthenticated() &&
                        <Form>
                            <Form.Group controlId="comment">
                                <Form.Control as="textarea" rows={5} placeholder={commentUI} value={commentUI} onChange={(e) => setCommentUI(e.target.value)} />
                            </Form.Group>
                            <br />
                            <div className={comment_styles.right_align}>

                                {commentUI.length > 0 && <Button variant="primary" onClick={() => handleAddComment(blog[0]?.title, commentUI, mDate, mEmail, mFullName, mTime)}>Post</Button>}
                            </div>
                        </Form>
                    }

                    <hr />

                    {comments?.filter(comment => comment.blogTitle == blog[0]?.title).length == 0 && <h4>No comments yet.</h4>}



                    {/* display the comments filtering in blog title */}
                    {comments?.filter(comment => comment.blogTitle == blog[0]?.title).map((comment) => (
                        <>
                        <br />
                        <Card key={comment._id} className={comment_styles.comment_card}>
                            <Card.Body>
                                {/* Check if this comment is being edited */}
                                {comment.toUpdateComment === true  ? (
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
                                        <Card.Text className={comment_styles.comment_style}>{comment.content}</Card.Text>
                                        <div className={comment_styles.side_by_side}>
                                            <span className={comment_styles.small_text}>Commented by: {comment.fullName}</span>

                                            <span className={comment_styles.small_text}>Date: {comment.date}, {comment.time}</span>

                                        </div>

                                        {isAuthenticated() &&

                                            <>
                                                <br />
                                                <div className={comment_styles.side_by_side}>
                                                    <div>

                                                        {comment.addingReply === false && <Button variant="primary" onClick={() => handleAddReplyUI(comment.content)}>Reply</Button>}


                                                    </div>


                                                    { token.decoded.email === comment.userEmail &&

                                                        <div className={comment_styles.right_align}>

                                                            <Button variant="primary" onClick={() => handleToUpdateComment(comment.content)}>Edit</Button>
                                                            &nbsp;
                                                            <Button variant="danger" onClick={() => handleDeleteComment(comment._id, comment.content)}>Delete</Button>
                                                        </div>
                                                    }


                                                </div>

                                                <br />
                                            </>

                                        }

                                        {
                                            comment.addingReply === true &&
                                            <Form>
                                                <Form.Group controlId="reply">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        placeholder={replyUI}
                                                        value={replyUI}
                                                        onChange={(e) => setReplyUI(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <br />
                                                <Button variant="primary" onClick={() => handleAddReply(comment._id, comment.content, mEmail, mFullName, replyUI)}>Post</Button>
                                            </Form>
                                        }

                                        {
                                            replies
                                                ?.filter(reply => reply.commentId === comment._id)
                                                .map(reply => (
                                                    reply.toUpdateReply ? (
                                                        <>
                                                        <hr />
                                                        <Form key={reply._id}>
                                                            <Form.Group controlId="editReply">
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    placeholder={reply.replyContent}
                                                                    value={newReplyContentUI}
                                                                    onChange={(e) => setNewReplyContentUI(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                            <br />
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => handleUpdateReply(reply._id, newReplyContentUI)}
                                                            >
                                                                Save
                                                            </Button>
                                                        </Form>
                                                        <br />
                                                        </>
                                                    ) : (
                                                        <>
                                                        <hr />
                                                        <div key={reply._id} className={comment_styles.reply_card}>
                                                            <div className={comment_styles.reply_body}>
                                                                <p className={comment_styles.reply_text}>{reply.replyContent}</p>
                                                                <div className={comment_styles.side_by_side}>
                                                                    <span className={comment_styles.small_text}>
                                                                        Replied by: {reply.fullName}
                                                                    </span>
                                                                    <span className={comment_styles.small_text}>
                                                                        Date: {reply.date}, {reply.time}
                                                                    </span>
                                                                </div>
                                                                {(isAuthenticated()) && (
                                                                    <>
                                                                    <br />

                                                                    { token.decoded.email === reply.userEmail && (
                                                                        <div className={comment_styles.right_align}>
                                                                            <Button
                                                                                className={`${comment_styles.button} ${comment_styles.primary}`}
                                                                                onClick={() => handleToUpdateReply(reply._id)}
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                            &nbsp;
                                                                            <Button
                                                                                className={`${comment_styles.button} ${comment_styles.danger}`}
                                                                                onClick={() => handleDeleteReply(reply._id)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        </>

                                                    )
                                                ))
                                        }

                                    </>
                                )}


                            </Card.Body>
                        </Card>
                        </>
                    ))}


                <br />
                </div>
            </Container>
        </>
    );
}
