// import axios from "axios"
// import {useEffect, useState} from "react"
// import Link from "next/link"
// import { filtered } from "../atoms"
// import {atom, useAtom} from "jotai"

// export default function HighRating(){
//   const [movieByRating, setMovieByRating] = useState([])
//   const [filteredMovies, setFilteredMovies] = useAtom(filtered)

//   useEffect(() => {
//     async function fetchData() {
//       const movieResponse = await axios.get(
//         `https://api.themoviedb.org/3/discover/movie?api_key=ece6713d4ebc06e447cee9d8efecf96f`
//       );
//       setMovieByRating(movieResponse.data.results);
//       setFilteredMovies(movieResponse.data.results.filter((movie) => movie.vote_average > 8));
//       await console.log(movieResponse, "HELLO")
//     }

//     fetchData();
//   }, []);

//   return (
//     <div style={{display: "flex"}}>
//       {filteredMovies.map((movie, idx) =>  <>
//       <div key={idx}>
//       <img
//               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//               alt="Poster"
//               style={{width: "300px", height: "300px", marginRight: "10px"}}
//             />
            
//             <Link href={{ pathname: '/Detail', query: { id: movie.id } }}>
//             <p>{movie.title}</p>
//           </Link></div></>)}
//     </div>
//   )
// }