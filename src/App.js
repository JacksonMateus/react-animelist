import {useEffect, useState } from 'react';
import qs from 'qs'
import './App.css';
import SearchInput from './SearchInput';
import Pagination from './Pagination';

const api = 'https://kitsu.io/api/edge/'
const LIMIT = 12

function App() {
  const [text, setText] = useState('')
  const [prevText, setPrevText] = useState('');
  const [info, setInfo] = useState({})
  const [offset, setOffset] = useState(0)

  useEffect(() => {

    const query = {
      page: {
        limit: LIMIT,
        offset,

      }
    }
    
    if (text) {
      query.filter = {
        text: text
      }
    }

    fetch(`${api}anime?${qs.stringify(query)}`)
    .then((response) => response.json())
    .then((response) => {
      setInfo(response)
    })

  // Verifica se o texto de busca foi alterado e define o offset como 0 apenas se for uma nova pesquisa
  if (text !== prevText) {
    setPrevText(text);
    setOffset(0);
  }
    
  }, [text, offset, prevText])

  return (
    <div className="App">
      <h1>
        Animes
      </h1>
      <SearchInput 
        value={text} 
        onChange={(textSearch) => {setText(textSearch)}} 
      />
      {text && !info.data && (
        <span>Carregando...</span>
      )}
      {info.data && info.data.length === 0 && (
        <div>Nenhum anime encontrado para a busca atual.</div>
        )}
      {info.data && (
        <ul className='animes-list'>
          {info.data.map((anime) => (
            <li key={anime.id}>
              <img src={anime.attributes.posterImage.small} alt={anime.attributes.canonicalTitle}/>
                {anime.attributes.canonicalTitle}
            </li>
          ))}
        </ul>
      )}
      {(info.meta && info.data.length !== 0) && (
        <Pagination 
        limit = {LIMIT} 
        total={info.meta.count} 
        offset={offset}
        setOffset={setOffset}  
        />
      )}
      
    </div>
  );
}

export default App;
