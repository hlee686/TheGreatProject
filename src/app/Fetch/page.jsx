'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FetchGenres from "./FetchGenres"
import ListByGenres from './ListByGenres';
import MovieByActor from "./MovieByActor";
import MovieByTitle from './MovieByTitle';

export default function Fetch() {
  return (<>
    <h2>Movie By Title</h2>
    <MovieByTitle />
    
    <h2>Trending Actor</h2>
    <MovieByActor />

    <h2>Genre</h2>
    <ListByGenres />
    </>
  )
}
