import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList";
// import { PostsViewSwitcher } from "../components/postsViewSwitcher";

export const MainPage = () => {
  const posts = [
    {
      title: "TS is great programming language",
      dateCreated: "2020-01-01",
      memberPostedBy: "John",
      comments: [],
      votes: [],
    },
  ];

  return (
    <Layout>
      {/* <PostsViewSwitcher /> */}
      <PostsList posts={posts} />
    </Layout>
  );
};
