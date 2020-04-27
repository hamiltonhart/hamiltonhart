import { graphql } from "gatsby";

export const ALL_MARKDOWN_QUERY = graphql`
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
`;
