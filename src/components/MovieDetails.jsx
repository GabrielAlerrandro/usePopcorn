import { useEffect, useState } from "react"
import StarRating from "./StarRating"
import Loader from "./Loader"
import { KEY } from "../hooks/useMovie"
import { useKeyboard } from "../hooks/useKeyboard"

export default function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState("")
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID)
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Year: year,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    }

    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
      )
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  }, [selectedID])

  useEffect(() => {
    if (!title) return
    document.title = `Movie | ${title}`

    return function () {
      document.title = "usePopcorn"
    }
  }, [title])

  useKeyboard("Escape", onCloseMovie)

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                <span>{imdbRating} IMDb Rating</span>
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie with {watchedUserRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}
