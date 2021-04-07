/*function loadpk(){
    let url = 'https://pokeapi.co/api/v2/pokemon/1/';
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.clear();
            console.log(data);
            document.getElementById('nome').innerHTML = data['name'];
            document.getElementById('hp').innerHTML = data['stats']['0']['base_stat'];
            document.getElementById('atk').innerHTML = data['stats']['1']['base_stat'];
            document.getElementById('def').innerHTML = data['stats']['2']['base_stat'];
            document.getElementById('spa').innerHTML = data['stats']['3']['base_stat'];
            document.getElementById('spd').innerHTML = data['stats']['4']['base_stat'];
            document.getElementById('speed').innerHTML = data['stats']['5']['base_stat'];
        })
        .catch((erro) => {
            console.log("Erro" + erro);
        })
  }
  
  window.onload = loadpk */

  function request(url = '') {
    return new Promise(resolve=>{
      fetch(url)
        .then(async response=> resolve(await response.json()))
    })
  }
  
  function firstCharToUpperCase(str = '') {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1)
  }
  
  async function requestPokemons() {
    
    const pokemonList = await request('https://pokeapi.co/api/v2/pokemon?limit=60')
  
    const pokemonsStats = await Promise.all(
      pokemonList.results.map(async pokemon=>{
        const {stats} = await request(pokemon.url)
        return {
          name: firstCharToUpperCase(pokemon.name),
          hp: stats[0].base_stat,
          atk: stats[1].base_stat,
          def: stats[2].base_stat,
          spAtk: stats[3].base_stat,
          spDef: stats[4].base_stat,
          speed: stats[5].base_stat,
          total: stats.reduce((p, c) => p + c.base_stat,0)
        }
      })
    )
  
    return pokemonsStats
  }
  
  async function main() {
    const pokemonsStats = (await requestPokemons()).sort((a, b)=>b.total - a.total)
    const tableEl = document.getElementsByTagName('table')[0]
    for(const pokemon of pokemonsStats) {
      const tr = document.createElement('tr')
      tableEl.append(tr)
      for(const stat in pokemon) {
        const td = document.createElement('td')
        td.innerText = pokemon[stat]
        tr.append(td)
      }
    }
  }
  
  window.onload = main
