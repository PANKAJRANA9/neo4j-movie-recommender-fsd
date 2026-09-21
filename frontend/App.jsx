
import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieForm from './components/MovieForm'
import MovieGraph from './components/MovieGraph'
import MovieList from './components/MovieList'
import RecommendationPanel from './components/RecommendationPanel'

export default function App(){
 const [movies,setMovies]=useState([])
 const [userId,setUserId]=useState('user123')
 const [search,setSearch]=useState('')
 useEffect(()=>{ fetchMovies() },[])
 const fetchMovies=async()=>{
   const res=await axios.get('http://localhost:8080/api/movies'); setMovies(res.data)
 }
 return (
  <div className="min-h-screen bg-gray-50 p-6">
    <h1 className="text-3xl font-bold">🎬 Neo4j Movie Recommender - Pankaj Rana FSD</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="col-span-1">
        <MovieForm onCreated={fetchMovies} />
        <input className="border p-2 w-full mt-4" placeholder="Search movies..." value={search} onChange={e=>setSearch(e.target.value)} />
        <MovieList movies={movies.filter(m=>m.title.toLowerCase().includes(search.toLowerCase()))} />
      </div>
      <div className="col-span-1">
        <RecommendationPanel userId={userId} />
        <input className="border p-2 w-full mt-2" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="User ID" />
      </div>
      <div className="col-span-1">
        <MovieGraph movies={movies} />
      </div>
    </div>
  </div>
 )
}
