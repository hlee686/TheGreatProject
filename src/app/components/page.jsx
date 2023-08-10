'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FetchGenres from "./FetchGenres"
import ListByGenres from './ListByGenres';
import MovieByTitle from './MovieByTitle';
import {loggedId} from "../atoms"
import {useAtom} from 'jotai'

export default function Fetch() {

  return (<>
    <h2>Movie By Title</h2>
    <MovieByTitle />

    <h2>Genre</h2>
    <ListByGenres />
    </>
  )
}
