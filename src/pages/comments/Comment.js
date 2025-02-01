import React, { useState } from 'react';
import { MoreDropdown } from "../../components/MoreDropdown";
import styles from "../../styles/Comment.module.css";
import Avatar from '../../components/Avatar';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CommentEditForm from "./CommentEditForm";
import { axiosReq } from '../../api/axiosDefaults';

const Comment = (props) => {
  const { profile_id, profile_image, owner, updated_at, content,
    id, setEvent, setComments } = props;
  
  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.owner === owner;

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/comments/${id}/`);
      setEvent(prevEvent => ({
        results: [{
          ...prevEvent.results[0],
          comments_count: prevEvent.results[0].comments_count - 1
        }]
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setEvent={setEvent}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default Comment;
