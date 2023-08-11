'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FetchGenres from "./FetchGenres"
import MovieByTitle from './MovieByTitle';
import {loggedId} from "../atoms"
import {useAtom} from 'jotai'
import HighRating from "./HighRating"
import MovieByActor from "./MovieByActor"

export default function Fetch() {

  return (<>

    <h2>최근 작품</h2>
    <HighRating />

    <h2>제목으로 검색</h2>
    <MovieByTitle />

    <h2>장르로 검색</h2>
    <FetchGenres />

    <h2>배우로 검색</h2>
    <MovieByActor />
    </>
  )
}
