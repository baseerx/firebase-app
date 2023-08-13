import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(auth?.currentUser?.email);
  const login = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {}
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    try {
        signOut(auth);
        location.reload();
    } catch (error) {}
  };
  return (
    <div className="bg-indigo-700 w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2 p-4 rounded-lg w-1/3 bg-white shadow-lg shadow-orange-500">
        <input
          type="email"
          className="bg-gray-100 border-2 border-gray-200 rounded-lg p-2 m-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="bg-gray-100 border-2 border-gray-200 rounded-lg p-2 m-2"
          placeholder="Passowrd"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-indigo-700 text-white  p-2 m-2"
          onClick={login}
        >
          Login
        </button>
        <button
          type="button"
          className="rounded-lg bg-red-500 text-white p-2 m-2"
          onClick={signInWithGoogle}
        >
          Sign with Google
        </button>
        <button
          type="button"
          className="rounded-lg bg-gray-700 text-white  p-2 m-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Auth;
