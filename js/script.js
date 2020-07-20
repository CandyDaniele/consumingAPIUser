let users;
const btnSearch = document.querySelector('.btn');
const inputSearch = document.getElementById('search');
const statsUsers = document.getElementById('statsUsers');
const filteredUsers = document.getElementById('filteredUsers');
const countUser = document.getElementById('countUser');

inputSearch.addEventListener('keyup', (evt) => {
  let name = evt.target.value;
  if(name.trim() !== ''){
    btnSearch.disabled = false;
  }else {
    btnSearch.disabled = true;
  }
});

btnSearch.addEventListener('click', () => {
  const result = filterUser(inputSearch.value);  
  renderUsers(result);
  const stats = getStats(result);
  renderStats(stats);
});

const start = async () => {
  users = await doFetch();
};

const doFetch = async () => {
  const data = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await data.json();
  return json.results.map((user) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.thumbnail,
      age: user.dob.age,
      gender: user.gender,
    };
  });
};

const filterUser = (searchValue) => {
  return users.filter(user => {
    return user.name.toUpperCase().includes(searchValue.toUpperCase());
  })
}

const renderUsers = (users) => {
  filteredUsers.innerText = '';
  countUser.innerText = '';
  if(users.length) {
    const ul = document.createElement('ul');
    countUser.innerText = `${users.length} usuário(s) encontrado(s)`
  
    users.forEach(user => {
      let li = document.createElement('li');
      let span = document.createElement('span');
      let img = document.createElement('img');

      img.src = user.photo;
      img.classList.add('circle');
      span.innerText = `${user.name}, ${user.age}`;

      li.appendChild(img);
      li.appendChild(span);

      ul.appendChild(li);
    })
    filteredUsers.appendChild(ul);
  } else {
    filteredUsers.innerHTML = `<p>Nenhum usuário filtrado</p>`;
    countUser.innerText = 'Pessoas'
  }

}

const getStats = (users) => {
  let stats = {nMan: 0, nWoman: 0, sumAge: 0, avgAge:0};

  users.forEach(user => {
    if(user.gender === 'male'){
      stats.nMan++
    } else if(user.gender === 'female') {
      stats.nWoman++;
    }
  })

  stats.sumAge = users.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);

  stats.avgAge = users.length ? stats.sumAge / users.length : 0;

  return stats;
}

const renderStats = (stats) => {
  statsUsers.innerText = '';
  if(stats.sumAge > 0) {
    const ul = document.createElement('ul');

    ul.innerHTML = `<li>Sexo Masculino: ${stats.nMan} </li>`;
    ul.innerHTML += `<li>Sexo Feminino: ${stats.nWoman} </li>`;
    ul.innerHTML += `<li>Soma das idades: ${stats.sumAge} </li>`;
    ul.innerHTML += `<li>Média das idades: ${stats.avgAge} </li>`;

    statsUsers.appendChild(ul);
  } else {
    statsUsers.innerHTML = `<p>Nenhum usuário filtrado</p>`;
  }

}
start();
