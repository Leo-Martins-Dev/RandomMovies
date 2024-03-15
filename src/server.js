import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTQwODViNTFmMzU1MzZjMDZlMmMyODQyNjNhNzU0ZiIsInN1YiI6IjY1OTU3NTU2MzI2ZWMxMGU3ZDA2YzE5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-1xTqrO9Y0eRzNKnkDqNm2_yiVWTiQsuVD5dTttwOnw";
const language = "pt-BR";

// Configuração global do Axios
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Função para obter todos os IDs dos filmes de forma concorrente
export async function obterTodosOsIdsDosFilmesConcorrente(pages = 100) {
  try {
    const promises = Array.from({ length: pages }, (_, index) => {
      const page = index + 1;
      return axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=${language}&page=${page}`
      );
    });

    const responses = await Promise.all(promises);
    const idsDosFilmes = responses.flatMap((response) =>
      response.data.results.map((filme) => filme.id)
    );

    return idsDosFilmes;
  } catch (error) {
    console.error("Erro ao obter IDs dos filmes:", error);
    throw error;
  }
}

// ... (restante do código permanece igual)

// Função para obter um ID aleatório da lista
function obterIdAleatorio(idsDosFilmes) {
  const indiceAleatorio = Math.floor(Math.random() * idsDosFilmes.length);
  return idsDosFilmes[indiceAleatorio];
}

// Função para obter detalhes específicos de um filme
async function obterDetalhesDoFilme(idDoFilme) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${idDoFilme}?language=${language}`
    );

    // Extrair apenas os dados desejados
    const { title, poster_path, overview } = response.data;

    return {
      title,
      image: `https://image.tmdb.org/t/p/w500${poster_path}`,
      overview,
    };
  } catch (error) {
    console.error("Erro ao obter detalhes do filme:", error);
    throw error;
  }
}

// Chamada
obterTodosOsIdsDosFilmesConcorrente()
  .then((idsDosFilmes) => {
    const idAleatorio = obterIdAleatorio(idsDosFilmes);

    // Obter detalhes específicos do filme usando o ID aleatório
    obterDetalhesDoFilme(idAleatorio)
      .then((detalhes) => {
        console.log("Detalhes do filme:", detalhes);
      })
      .catch((error) => console.error(error));
  })
  .catch((error) => console.error(error));
