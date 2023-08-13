import React from 'react'
import Auth from './components/Auth'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import MoviesList from './components/MoviesList'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/movies" element={<MoviesList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App