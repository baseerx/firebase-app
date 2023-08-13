import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  doc,
  serverTimestamp,
  collectionGroup,
  getDoc,
} from "firebase/firestore";
const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const moviesCollection = collection(db, "movies");
  const moviesdescription = collection(db, "movies_description");
  useEffect(() => {
    getData();
    fetchUsersWithPosts();
  }, []);

  const getData = async () => {
    try {
      const data = await getDocs(moviesCollection);

      const moviesWithDescriptions = [];

      for (const movieDoc of data.docs) {
        try {
          const docs = await getDocs(
            query(
              moviesdescription,
              where("movie_id", "==", doc(db, "movies", movieDoc.id))
            )
          );

          const descriptionData = docs.docs.map((doc) => doc.data());

          const movieWithDescription = {
            id: movieDoc.id,
            ...movieDoc.data(),
            description: descriptionData,
          };

          moviesWithDescriptions.push(movieWithDescription);
        } catch (error) {
          console.log(error);
        }
      }

      //   console.log(moviesWithDescriptions);
    } catch (error) {
      console.log(error);
    }
  };

  const addRecord = async () => {
    try {
      // for now I am hardcoding the movie date and oscar
      const moviesRef = await addDoc(moviesCollection, {
        title,
        movie_date: 2022,
        oscar: true,
      });
      await addDoc(moviesdescription, {
        details: description,
        movie_id: doc(db, "movies", moviesRef.id),
      });
      // above method for storing referencing (many to many) of one collection in another
      // now I want to store collection inside collection for one to many relationship
      useSubCollection();
      createPostWithUserReference();
      getData();
    } catch (error) {
      console.log(error);
    }
  };
const createPostWithUserReference = async () => {
  try {
    // Reference to an existing user document
    const userRef = doc(db, "users", "wSxm3SvQ3TYgxt34ja0NQGeAXiI2"); // Replace with the actual user ID

    // Create a new post document and store the user reference
    const postsCollection = collection(db, "posts");
    await addDoc(postsCollection, {
      title: "New Post",
      content: "Content of the post",
      user: userRef,
      createdAt: serverTimestamp(),
    });

    console.log("Post with user reference added successfully.");
  } catch (error) {
    console.error("Error creating post with user reference:", error);
  }
};
  const useSubCollection = async () => {
    try {
      // Create a new user document in the "users" collection
      const usersCollection = collection(db, "users");
      const newUserDocRef = await addDoc(usersCollection, {
        username: "JohnDoe2",
        email: "johndoe2@example.com",
      });

      // Reference the "posts" subcollection within the user document
      const userPostsCollectionRef = collection(newUserDocRef, "posts");

      // Add posts to the "posts" subcollection
      const posts = [
        {
          title: "Post 3",
          content: "Content of Post 3",
          createdAt: serverTimestamp(),
        },
        {
          title: "Post 4",
          content: "Content of Post 4",
          createdAt: serverTimestamp(),
        },
      ];

      for (const post of posts) {
        await addDoc(userPostsCollectionRef, post);
      }

      console.log("User and posts added successfully.");
    } catch (error) {
      console.error("Error creating user and posts:", error);
    }
  };

  const fetchUsersWithPosts = async () => {
    try {
      // Query all posts across all user collections
      const postsQuerySnapshot = await getDocs(collectionGroup(db, "posts"));

      // Process the results
      for (const postDoc of postsQuerySnapshot.docs) {
        const postData = postDoc.data();
        const userRef = doc(db, postDoc.ref.parent.parent?.path); // Reference to the user document

        if (userRef) {
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          console.log("User:", userData, "Post:", postData);
        }
      }
    } catch (error) {
      console.error("Error fetching users with posts:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-700 to-indigo-400 w-full min-h-screen flex items-center justify-center">
      <div className="shadow-slate-500 shadow-xl rounded-lg bg-white w-2/3 h-48 flex flex-wrap overflow-y-auto">
        <div className="flex justify-center gap-3 w-full">
          <input
            type="text"
            className="border h-12 w-1/3 m-2 rounded-xl pl-2"
            placeholder="Enter movie name"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="border h-12 w-1/3 m-2 rounded-xl pl-2"
            placeholder="movie description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={addRecord}
            className="rounded-xl h-12 p-2 m-2 bg-indigo-700 text-white"
          >
            Add Movie
          </button>
        </div>
        <ul className="w-full">
          {movies.map((movie) => (
            <li key={movie.id} className="py-2">
              <div className="text-center text-black flex items-center justify-evenly gap-5">
                <h2 className="text-lg font-bold text-white bg-indigo-700 rounded-full p-2">
                  {movie.title}
                </h2>
                <p
                  className={
                    "text-sm" + movie.oscar ? "text-green-600" : "text-black"
                  }
                >
                  Oscar: {movie.oscar.toString()}
                </p>
                <p className="text-sm">{movie.movie_date}</p>

                <button
                  type="button"
                  className="rounded-full p-2 bg-red-600 text-white"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 bg-green-600 text-white"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 bg-slate-500 text-white"
                >
                  Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoviesList;
