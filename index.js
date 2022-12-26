let app = document.getElementById('app');

let searchLine = createElement('div', 'search-line');
let searchInput = createElement('input', 'search-input');
searchLine.append(searchInput);

let autocomBox = createElement('ul', 'autocom-box');
searchLine.append(autocomBox);

app.append(searchLine);

let main = createElement('div', 'main');

app.append(main);

function createElement (elementTag, elementClass) {
    const element = document.createElement(elementTag);
    
    if (elementClass) {
        element.classList.add(elementClass);
    }
    
    return element;
}

function debounce (fn, debounceTime) {
    let cooldown;
    return function () {
        clearTimeout(cooldown);
        cooldown = setTimeout(() => fn.apply(this, arguments), debounceTime)
    }
}


async function searchRep() {
    try {
        if(searchInput.value) {
            clear();
            await fetch(`https://api.github.com/search/repositories?per_page=5&q=${searchInput.value}&sort=stars`).then((response)=>{     
            response.json().then((response) => {
            response.items.forEach((data) => showSuggestion(data));
        })
      });
    } else {
      clear();        
    }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
}

function showSuggestion(data) {
    const suggestion = createElement('li', 'suggestion');
    suggestion.addEventListener('click', () => {
        autocomBox.innerHTML = "";
        searchInput.value = "";
  
        showRep(data);
    });
    suggestion.innerHTML = `<span>${data.name}</span>`;
    autocomBox.append(suggestion);
}

function showRep(data) {
    const rep = createElement("li", "rep");
    const btn = createElement("div", "btn");
  
    rep.addEventListener("click", (e) => {
      autocomBox.innerHTML = "";
    });
  
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      rep.remove();
    })
  
    rep.innerHTML = `<span class="rep-info"><span>Name: ${data.name}</span>
    <span>Owner: ${data.owner.login}</span>
    <span>Stars: ${data.stargazers_count}</span>
    </span>`;
    rep.append(btn);
    main.prepend(rep);
}

searchInput.addEventListener('keyup', debounce(searchRep, 350));

function clear() {
    autocomBox.innerHTML = "";
}
