const dataURL = 'https://raw.githubusercontent.com/ShootProof/recruiting-front-end/master/testdata.json';
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
      render(d)
    })
  })
});

function render(d) {
  let id = d.id, 
    name = d.name,
    parent = d.parent,
    altText = d.thumbnail.description,
    thumb = d.thumbnail.href,
    hasParent = d.hasParent,
    hasChild = d.hasChild,
    list = document.querySelector('ul')

    list.innerHTML += `
    <li class="${hasParent ? 'hasParent' : 'hasNoParent'}" onclick="toggleDrop(this)">
      <div id="${id}">
        <img src="${thumb}" aria-label="${altText}" alt="${altText}" title="${altText}">
        <span>${name} <div class="${hasChild ? 'arrow' : ''}"></div></span>
      </div>
    </li> 
  `
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
      let parentIndex = item.parent
      console.log(parentIndex)
      newArr.splice(parentIndex + 1, 0, item)
    }
  })

  for (let i in newArr) {
    let next = newArr[+i + 1]
    if (next && newArr[i].id == next.parent) {
      newArr[i].hasChild = true
    }
  }

  newArr.forEach(d => {
    let modelData = {
      id: d.id,
      hasParent: d.hasParent,
      hasChild: d.hasChild,
      isOpen: 0
    }
    model.splice(newArr.indexOf(d), 0, modelData)
  })
  return newArr
}

// NOTE: logic is kind of sloppy here...
// I think it will only handle items nested 2 deep
/*function toggleDrop(e) {
  e.classList.toggle('open')
  let sibling = e.nextElementSibling
  
  if (sibling && sibling.classList.contains('hasParent')){
    sibling.classList.toggle('visible')
    
    if (sibling.nextElementSibling && activeItems.indexOf(sibling.nextElementSibling)) {
      sibling.nextElementSibling.classList.toggle('visible')
      activeItems.pop()
    }
  }
  
  if (sibling.nextElementSibling && sibling.nextElementSibling.classList.contains('visible')) {
    console.log('here')
    sibling.nextElementSibling.classList.toggle('visible')
    activeItems.push(sibling.nextElementSibling)
  }
}
*/
function toggleDrop(e){
  let eid = Number(e.childNodes[1].attributes[0].value),
    sibling = e.nextElementSibling,
    m = model[eid]
    next = model[eid + 1]
console.log(m.hasParent)
console.log(eid)
  m.isOpen ^= true

  if (m.isOpen) {
    e.classList.add('open')
  } else {
    e.classList.remove('open')
  }

  if (m.hasChild) {
    sibling.classList.toggle('visible')
  }
}
