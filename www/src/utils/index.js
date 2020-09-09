export function filterCurrency ( cur ) {
  return `$ ${ cur }`;
}

export function pageToUp () {
  document.querySelector ( '.title-page' ).scrollIntoView ( {
    behavior : 'smooth',
    block : 'start'
  } )
}

export function pageToUpAnchor ( anchor ) {
  document.querySelector ( `${ anchor }` ).scrollIntoView ( {
    behavior : 'smooth',
    block : 'start'
  } )
}


export function pageToUpToTop () {
  document.querySelector ( '.nav-header' ).scrollIntoView ( {
    behavior : 'smooth',
    block : 'start'
  } )
}
