class FoodApp{
    constructor(){
        this.foodArray = [].map((food) => ({...food,isFavorite})),
        this.bodyElement = document.querySelector('.foodList'),
        this.render()
    }
    async render(){
        let loading = document.querySelector(".loading")
        let title = document.querySelector(".display-1")
        let searchBar = document.querySelector(".searchBar")
        
        title.classList.add('d-none')
        searchBar.classList.add('d-none')
        loading.classList.add('d-block')

        await fetch("https://jsonplaceholder.typicode.com/users/3")
            .then(response => response.json())
            .then(item => {
                const userName = item.name
                title.innerHTML = `Merhaba, ${userName}`

            })
        await fetch("https://api.airtable.com/v0/appyLL3B6PD1W44kF/Grid%20view?api_key=keynJKkfPVvo4RLJf")
            .then(response => response.json())
            .then(item => {
                item.records.forEach(element => {
                    this.foodArray.push(element)
                })
            })

        loading.classList.remove('d-block')
        loading.classList.add('d-none')
        title.classList.remove('d-none')
        searchBar.classList.remove('d-none')

        this.fuseMealSearch()
    }

    fuseMealSearch(){
        const options = {
            includeScore: true,
            keys: ["fields.strMeal"]
        }
        const fuse = new Fuse(this.foodArray,options)

        const searchInput = document.querySelector('#foodInput')

        this.bodyElement.innerHTML = ""

        searchInput.addEventListener('input', (e) => {
            setTimeout(() => {
                this.bodyElement.innerHTML = ""
                const result = fuse.search(e.target.value)
                result.map((foods) => this.createCard(foods))
            }, 500)
        })
        
    }

    createCard(foods){
        const {isFavorite} = foods.item
        const {idMeal, strMeal, strMealThumb} = foods.item.fields
        const favoriteArray =  this.foodArray.find((food) => food.fields.idMeal === idMeal)


        const divBody = document.createElement('div')
        const cardDiv = document.createElement('div')
        const imgLayout = document.createElement('img')
        const cardBody = document.createElement('div')
        const cardTitle = document.createElement('h5')
        const cardButton = document.createElement('button')

        this.bodyElement.append(divBody)
        divBody.append(cardDiv)
        cardDiv.append(imgLayout,cardBody)
        cardBody.append(cardTitle,cardButton)


        divBody.classList.add('col-3','mb-2')
        cardDiv.classList.add('card')
        imgLayout.classList.add('card-img-top')
        cardBody.classList.add('card-body')
        cardTitle.classList.add('card-title')
        cardButton.classList.add('foodFavoriteButton')

        
        cardTitle.textContent = strMeal
        imgLayout.src = strMealThumb

        if(localStorage.getItem("favori-"+idMeal)){
            cardButton.innerHTML = `<ion-icon name="heart-circle-outline"></ion-icon>`

        }else{
            cardButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`
        }

        cardButton.addEventListener('click', () => {
            if(favoriteArray.isFavorite == true){
                this.foodArray.find((food) => food.fields.idMeal === idMeal).isFavorite = false
                localStorage.removeItem("favori-"+idMeal)
                cardButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`

            }else{
                this.foodArray.find((food) => food.fields.idMeal === idMeal).isFavorite = true
                localStorage.setItem("favori-"+idMeal,strMeal)
                cardButton.innerHTML = `<ion-icon name="heart-circle-outline"></ion-icon>`
            }
            console.log(favoriteArray.isFavorite)
        })

        return divBody
           
    }
}
new FoodApp()