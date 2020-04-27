import React from "react";
import Layout from "../components/layout";
import { useStaticQuery } from "gatsby";
import PostListItem from "../components/posts/PostListItem";

const BlogPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        nodes {
          id
          frontmatter {
            title
            summary
            date
            path
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <h1>Blog</h1>
      {data.allMarkdownRemark.nodes.map(node => (
        <PostListItem node={node} />
      ))}
    </Layout>
  );
};

export default BlogPage;
