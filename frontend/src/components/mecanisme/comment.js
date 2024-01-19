import React from "react";

function Comment({ comment }) {
  return (
    <div className="comment">
      <p>{comment.content}</p>
      <p>Par : {comment.username}</p>
      <p>Date : {comment.timestamp}</p>
    </div>
  );
}

export default Comment;
