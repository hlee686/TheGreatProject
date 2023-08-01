import { useEffect, useState } from "react";
import FetchGenres from "./FetchGenres"
import axios from "axios"

export default function ListByGenres() {
  return (
    <div>
      <FetchGenres />
    </div>
  )
}