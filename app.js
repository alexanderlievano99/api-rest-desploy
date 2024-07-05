const express = require('express');
const crypto = require('node:crypto');
const app = express();
const cors = require('cors')
//Importaciones genericas
const movies = require('./movies/Film.json');
const { validateMovie, validatePartialMovie } = require('./schema/schemaMovies');
const { error } = require('node:console');
const { title } = require('node:process');
app.disable('x-powered-by');
app.use(cors())

app.get('/',(req, res)=>{
    res.json({message: 'Hola Mundo XD'});
});
//Todos los recursos / urls que vayan a movies va a entrar acá.
app.get('/movies', (req, res)=>{
    const {genre} = req.query;
    if(genre){
        const filteredMovies = movies.filter(
            // movie => movie.Genre.includes(genre)//Esto esta bien, pero si lo paso en minuscula se muere
            movie => movie.Genre.toLowerCase().includes(genre.toLowerCase()) //Esto me hace el filtro si es en minuscula o mayuscula
        );
        return res.json(filteredMovies);
    }
    res.json(movies);
})

//Para que funcione el req.body, hay que usar app.use(express.json())
app.use(express.json())
app.post('/movies', (req, res)=>{

    const result = validateMovie(req.body)
    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }
    const {title, year, director, genre} = req.body;

    const newMovie = {
        id: crypto.randomUUID(),
        title, 
        year, 
        director, 
        genre
    };

    movies.push(newMovie);

    res.status(201).json(newMovie);
})

//Todos los recursos con params
app.get('/movies/:id',(req, res)=>{
    const {id} = req.params;
    const arrayMovies = Object.entries(movies)
    const movie = arrayMovies[id];
    if(movie) return res.json(movie);
    res.status(404).json({message: "Movie not found"});
})
//Patch es idempotente
app.patch('/movies/:id', (req, res)=>{
    const result = validatePartialMovie(req.body);
    if(!result.success){
        return res.status(404).json({message: "Movie not found"})
    }
    // console.log(req.params)
    const {id} = req.params;
    const arrayMovies = Object.entries(movies);
    // console.log(arrayMovies)
    if(!arrayMovies[id]){
        return res.status(404).json({message: "Movie not found"})
    }
    // const movieIndex = arrayMovies.findIndex(movie => arrayMovies[id]);
    // if(movieIndex === -1){
    //     return res.status(404).json({message: "Movie not found"})
    // }
    const updateMovie = {
        ...arrayMovies[id][id],
        ...result.data
    };
    arrayMovies[id][id] = updateMovie; //Esto es una mierda pero es que no estoy trabajando con ID XDDDD
    return res.json(arrayMovies);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, ()=>{
    console.log(`Server listening on port htpp://localhost:1234`)
})