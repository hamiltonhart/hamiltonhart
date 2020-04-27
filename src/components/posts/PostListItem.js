import React from "react";
import { Link } from "gatsby";

import { PostListItemContainer } from "../styled/PostStyle";

const PostListItem = ({ node }) => {
  return (
    <PostListItemContainer key={node.id}>
      <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
      <p>{node.frontmatter.summary}</p>
    </PostListItemContainer>
  );
};

export default PostListItem;
