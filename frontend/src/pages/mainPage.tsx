import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList";
import { api } from "./registrationPage";
// import { PostsViewSwitcher } from "../components/postsViewSwitcher";

export const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      {/* <PostsViewSwitcher /> */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && <PostsList posts={posts} />}
    </Layout>
  );
};

const getPosts = async () => {
  const posts = await api.getPosts();
  console.log("Posts: ", posts.data.data.posts);
  return posts.data.data.posts;
};
