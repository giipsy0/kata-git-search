const app = document.getElementById('app');
const searchLine = createElement('div', 'search-line');
const searchInput = createElement('input', 'search-input');
const autocomBox = createElement('ul', 'autocom-box');
const main = createElement('div', 'main');
searchLine.append(searchInput);
searchLine.append(autocomBox);
app.append(searchLine);
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

async function getResponse() {
    return await fetch(`https://api.github.com/search/repositories?per_page=5&q=${searchInput.value}&sort=stars`).then((response)=>{     
        response.json().then((response) => {
        response.items.forEach((data) => showSuggestion(data));
    })
});
}

async function searchRepopsitory() {
    try {
        if(searchInput.value) {
            clear();
            await getResponse();
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
  
        showRepository(data);
    });
    suggestion.innerHTML = `<span>${data.name}</span>`;
    autocomBox.insertAdjacentElement('afterbegin', suggestion);
    
}

function showRepository(data) {
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
    rep.insertAdjacentElement('afterbegin', btn);
    main.insertAdjacentElement('afterbegin', rep);
}

searchInput.addEventListener('keyup', debounce(searchRepopsitory, 350));

function clear() {
    autocomBox.innerHTML = "";
}
