import { useState } from "react"
import NavBar from "./components/NavBar"
import Content from "./components/content"
import SearchBar from "./components/SearchBar"
import Box from "./components/Box"
import MovieList from "./components/MovieList"
import NumResults from "./components/NumResults"
import WatchedSumary from "./components/WatchedSumary"
import WatchedMovieList from "./components/WatchedMovieList"
import Loader from "./components/Loader"
import ErrorMessage from "./components/ErrorMessage"
import MovieDetails from "./components/MovieDetails"
import { useMovies } from "./hooks/useMovie"
import { useLocalStorageState } from "./hooks/useLocalStorageState"

export default function App() {
  const [query, setQuery] = useState("")
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie)
  const [watched, setWatched] = useLocalStorageState([], "watched")
  const [selectedID, setSelectedID] = useState(null)

  function handleSelectMovie(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id))
  }

  function handleCloseMovie() {
    setSelectedID(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Content>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSumary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Content>
    </>
  )
}
