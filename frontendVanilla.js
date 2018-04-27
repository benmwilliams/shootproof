const dataURL = 'https://raw.githubusercontent.com/ShootProof/recruiting-front-end/master/testdata.json';

// somewhere I hosed up the hasParent prop
// likely in how I'm building the model
let model = []

document.addEventListener('DOMContentLoaded', (event) => { 
  fetch(dataURL)
  .then(response => response.json())
  .then(data => {
    let primarySort = data.sort( (a,b) => {
      if (a.parent === null) {
        a.parent = -1
      } else if (b.parent === null) {
        b.parent = -1
      } 
        return a.parent - b.parent
    })
    addHasParentProp(primarySort)
    let sorted = secondarySort(primarySort)
    sorted.forEach(d => {

        let modelData = {
        id: d.id, 
        name: d.name,
        parent: d.parent,
        altText: d.thumbnail.description,
        thumb: d.thumbnail.href,
        hasParent: d.hasParent,
        hasChild: d.hasChild,
        isOpen: false,
        isVisible: false
      }

      model.push(modelData)

    })
    
    render()

  })
});

function render() {

  let list = document.querySelector('ul')
  list.innerHTML = ''

  model.forEach( d => {
    if (!d.hasParent) {d.isVisible = true}

    list.innerHTML += `
      <li id="${d.id}"
        class="
          ${d.isVisible ? 'visible' : ''}
          ${d.hasChild ? 'isParent' : 'isNotParent'}
        " onclick="toggleDrop(${model.indexOf(d)})">
        <div class="${d.isOpen ? 'open' : '' }">
          <img src="${d.thumb}" aria-label="${d.altText}" alt="${d.altText}" title="${d.altText}">
          <span>${d.name} <div class="${d.hasChild ? 'arrow' : ''}"></div></span>
        </div>
      </li> 
    `
  })
}

function addHasParentProp(d) {
  d.forEach(function(t){
    if (t.parent === -1) {
      t.hasParent = false
    } else {
      t.hasParent = true
    }
  })
}

// NOTE: secondarySort(x) assumes that an item can have only one parent
// and that addParentProp(x) was successful
function secondarySort(d) {
  let newArr = []
  
  d.forEach( item => {
    if (item.hasParent === false) {
      newArr.push(item)
    } else {
      let parentIndex = Number(item.parent)
      newArr.splice(parentIndex + 1, 0, item)
    }
  })

  for (let i in newArr) {
    let next = newArr[Number(i) + 1]
    if (next && newArr[i].id == next.parent) {
      newArr[i].hasChild = true
    } else {
      newArr[i].hasChild = false
    }
  }
  return newArr
}

function toggleDrop(t){
  let target = model[t],
    next = model[t + 1]

  target.isOpen ^= true
  if (next.hasParent) { next.isVisible ^= true }

  if (next.isOpen && next.hasParent) { model[t + 2].isVisible ^= true }

  render()
}
