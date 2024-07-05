const z = require('zod'); //Se usa para las validaciones de datos en el back

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title of the movie must be a string',
        required_error: 'Movie title is required',
    }),
    Year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    genre: z.string()
})

function validateMovie(object) {
    return movieSchema.safeParse(object);
}
//Esto lo que hace es validar el objeto que llegue. Reutilizo el eschema actual del zod y le digo que ese eschema lo quiero usar para esta actualizacion, y que las validaciones de los campos si no estan, no se va a preocupar por ellos, pero si estan los va a validar como se tendria que hacer.
function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object);
}
module.exports = {
    validateMovie,
    validatePartialMovie,
}