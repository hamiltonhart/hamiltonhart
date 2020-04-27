import React from "react";
import { graphql } from "gatsby";
import Layout from "./layout";
import { PostHeading } from "./styled/PostStyle";

const postLayout = ({ data }) => {
  const { markdownRemark } = data;

  return (
    <Layout>
      <PostHeading>
        <h1 className=".postHeading">{markdownRemark.frontmatter.title}</h1>
        <div className="subheading">
          <p>{markdownRemark.frontmatter.date}</p>
        </div>
      </PostHeading>
      <div
        className="postbody"
        dangerouslySetInnerHTML={{
          __html: markdownRemark.html,
        }}
      />
    </Layout>
  );
};

export default postLayout;

export const query = graphql`
  query PostQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        path
      }
    }
  }
`;
