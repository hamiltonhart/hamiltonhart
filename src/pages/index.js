import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

import { TextLink } from "../components/styled/links";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Still In Progress</h1>
    <h3>
      Visit the <TextLink to="/blog">Blog Page</TextLink> for posts.
    </h3>
  </Layout>
);

export default IndexPage;
