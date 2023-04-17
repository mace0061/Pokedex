const $boxes = document.getElementById('pokemonBoxes')

const boxes = []

// counter for how many pokemon there currently are loaded
let count = 0

// counter for other uses
let count2 = 0

const pokemon = {}

// add the first 20 pokemonBox elements
for (let i = 1; i < 21; i++) {
    count++
    let htmlCode = (`<div data-number=${count} tabindex="1" id="pokBox${count}" class="pokemonBox clickable" role="button"><img data-number=${count} id="sprite${count}" class="sprite" src="img/grey-pokeball.png" alt="placeholder image for pokemon ${count}"><h4 data-number=${count} id="poName${count}">#${count}</h4><img data-number=${count} id="catch${count}" class="redPokeball" src="img/red-pokeball.png" alt="caught icon, a red pokeball"></div>`)
    $boxes.insertAdjacentHTML('beforeend', htmlCode)
    pokemon[count] = 
        {
            number: count
        }
    if (localStorage.getItem('isPokemon' + count + 'Caught') === 'yes') {
        pokemon[count].isCaught = 'yes'
        document.getElementById('catch' + count).classList.toggle("isCaught")
    }
}

const detail = document.querySelectorAll('.pokemonBox');

// add click event listeners to the all pokemonBox elements (only works on the ones that load initially)
detail.forEach(pokemonBox => {
    pokemonBox.addEventListener('click', function () {
        let eventId = this.id
        openDetail(eventId)
    })
    
    pokemonBox.addEventListener('keydown', function(event) {
        isEnter(event.code, event.target.id)
    })
})



let dexNo
let whichPokemon

// function that runs to open the details overlay when any pokemonBox is clicked and fills it with the info of the clicked pokemon
function openDetail(selectedId) {
    swapOverlay()
    document.getElementById('detail').style.display = 'grid'
    document.getElementById('type2').style.display = 'none'
    document.getElementById('caught').focus()
    const $currentPokemon = document.getElementById(selectedId)
    dexNo = $currentPokemon.dataset.number
    let fullName = pokemon[dexNo].name + " # " + dexNo
    whichPokemon = "catch" + dexNo
    document.getElementById('fullName').innerHTML = fullName
    document.getElementById('type1').innerHTML = pokemon[dexNo].type1
    if ('type2' in pokemon[dexNo]) {
        document.getElementById('type2').style.display = 'flex'
        document.getElementById('type2').innerHTML = pokemon[dexNo].type2
    }
    document.getElementById('full').src = pokemon[dexNo].fullImage
    document.getElementById('full').alt = "official artwork of pokemon " + (dexNo) + ", " + pokemon[dexNo].name
    if (pokemon[dexNo].isCaught === 'yes')
    {
        document.getElementById('catchIndicator').classList.add("isCaught")
        document.getElementById('catchOrRelease').innerHTML = (`Release`)
    }
}

const $more = document.getElementById('more')

// when the more button is clicked, add 20 new pokemonBoxes to the end of the current set and give each of them a click event listener
$more.addEventListener('click',
    function () {
        boxes.length = 0
        for (let i = 1; i < 21; i++) {
            count++
            let htmlCode = (`<div data-number=${count} tabindex="1" id="pokBox${count}" class="pokemonBox clickable" role="button"><img data-number=${count} id="sprite${count}" class="sprite" src="img/grey-pokeball.png" alt="placeholder image for pokemon ${count}"><h4 data-number=${count} id="poName${count}">#${count}</h4><img data-number=${count} id="catch${count}" class="redPokeball" src="img/red-pokeball.png" alt="caught icon, a red pokeball"></div>`)
            $boxes.insertAdjacentHTML('beforeend', htmlCode)
            document.getElementById('pokBox' + count).addEventListener('click', function () {
                let eventId = this.id
                openDetail(eventId)
            })
            document.getElementById('pokBox' + count).addEventListener('keydown', function(event) {
                isEnter(event.code, event.target.id)
            })
            pokemon[count] = 
                {
                    number: count
                }
            if (localStorage.getItem('isPokemon' + count + 'Caught') === 'yes') {
                pokemon[count].isCaught = 'yes'
                document.getElementById('catch' + count).classList.toggle("isCaught")
            }
        }
        fetchAdditionalPokemon()
    }
)

// close button on the details overlay that will close the overlay when clicked
const $close = document.getElementById('close')

$close.addEventListener('click',
    function () {
        swapOverlay()
        document.getElementById('detail').style.display = 'none'
        document.getElementById('pokBox' + dexNo).focus()
        document.getElementById('catchIndicator').classList.remove("isCaught")
        document.getElementById('catchOrRelease').innerHTML = (`Caught`)
        document.getElementById('type2').style.display = 'none'
    }
)

// caught button on the details overlay that checks if this pokemon is caught, then changes its own text to 'Caught' or 'Release' depending on what is appopriate, changes that pokemon's isCaught value, and toggles the isCaught class to make the caught icon appear or vanish. also saves whether the pokemon is caught or not (isPokemon#Caught) to the localStorage for later use
const $caught = document.getElementById('caught')

$caught.addEventListener('click',
    function () {
        if (document.getElementById('catchIndicator').classList.contains("isCaught") === false){
            document.getElementById('catchOrRelease').innerHTML = (`Release`)
            pokemon[dexNo].isCaught = 'yes'
        }
        else {
            document.getElementById('catchOrRelease').innerHTML = (`Caught`)
            pokemon[dexNo].isCaught = 'no'
        }
        localStorage.setItem('isPokemon' + dexNo + 'Caught', pokemon[dexNo].isCaught)
        document.getElementById('catchIndicator').classList.toggle("isCaught")
        document.getElementById(whichPokemon).classList.toggle("isCaught")
    }
)

$caught.addEventListener('keydown', function(event) {
    isEnter(event.code, event.target.id)
})


// a release all button that removes the caught icons from all pokemon and clears the local storage
const $releaseAll = document.getElementById('releaseAll')

$releaseAll.addEventListener('click',
    function () {
        const caughtList = document.querySelectorAll('.isCaught')
        caughtList.forEach(pokemonCaught => {
            pokemonCaught.classList.remove("isCaught")
        })
        document.getElementById('catchOrRelease').innerHTML = (`Caught`)
        localStorage.clear()
        for (let i = 0; i < count; i++) {
            count2++
            if ('isCaught' in pokemon[count2] === true) {
                delete pokemon[count2].isCaught
            }
        }
        count2 = 0
    }
)

let moreIteration = 0

// api integration
let apiData = {}
let apiData2 = {}

async function fetchInitialPokemon () {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon')
    apiData = await response.json()
    for (let i = 0; i < 20; i++) {
        let thisNumber = i + 1
        let thisName = apiData.results[i].name
        let firstLetter = thisName.charAt(0)
        let firstLetterCap = firstLetter.toUpperCase()
        let remainingLetters = thisName.slice(1)
        let capitalized = firstLetterCap + remainingLetters
        pokemon[thisNumber].name = capitalized
        document.getElementById('poName' + thisNumber).insertAdjacentHTML('beforebegin', (`<h4>${capitalized}</h4>`))
    }
    fetchPokemonData()
}

async function fetchPokemonData () {
    let thisNumber = (20 * moreIteration)
    for (let i = 0; i < 20; i++) {
        const response2 = await fetch(apiData.results[i].url)
        apiData2 = await response2.json()
        pokemon[thisNumber + 1].sprite = apiData2.sprites.front_default
        pokemon[thisNumber + 1].fullImage = apiData2.sprites.other['official-artwork'].front_default
        let thisName = apiData2.types[0].type.name
        let firstLetter = thisName.charAt(0)
        let firstLetterCap = firstLetter.toUpperCase()
        let remainingLetters = thisName.slice(1)
        let capitalized = firstLetterCap + remainingLetters
        pokemon[thisNumber + 1].type1 = capitalized
        if (apiData2.types[1] != null) {
            let thisName = apiData2.types[1].type.name
            let firstLetter = thisName.charAt(0)
            let firstLetterCap = firstLetter.toUpperCase()
            let remainingLetters = thisName.slice(1)
            let capitalized = firstLetterCap + remainingLetters
            pokemon[thisNumber + 1].type2 = capitalized
        }
        document.getElementById('sprite' + (thisNumber+1)).src = pokemon[thisNumber + 1].sprite
        document.getElementById('sprite' + (thisNumber+1)).alt = "sprite artwork of pokemon " + (thisNumber + 1) + ", " + pokemon[thisNumber + 1].name
        thisNumber++
    }
}

fetchInitialPokemon()

async function fetchAdditionalPokemon () {
    const response = await fetch(apiData.next)
    apiData = await response.json()
    moreIteration ++
    let useNumber = 20 * moreIteration
    for (let i = 0; i < 20; i++) {
        useNumber++
        let thisName = apiData.results[i].name
        let firstLetter = thisName.charAt(0)
        let firstLetterCap = firstLetter.toUpperCase()
        let remainingLetters = thisName.slice(1)
        let capitalized = firstLetterCap + remainingLetters
        pokemon[useNumber].name = capitalized
        document.getElementById('poName' + useNumber).insertAdjacentHTML('beforebegin', capitalized)
        fetchPokemonData()
    }
}

function isEnter(eventCode, thisId) {
    let code = eventCode
    let eventId = thisId
    if (code === 'Enter' || code === 'Space') {
        document.getElementById(eventId).click()
    }
}

function swapOverlay () {
    let clickableElements = document.querySelectorAll('.clickable')
    let unclickableElements = document.querySelectorAll('.unclickable')
    clickableElements.forEach(element => {
        element.inert = true
        element.classList.toggle("clickable")
        element.classList.toggle("unclickable")
    })
    unclickableElements.forEach(element => {
        element.inert = false
        element.classList.toggle("clickable")
        element.classList.toggle("unclickable")
    })
}