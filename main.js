class FoodApp{
    constructor(){
        this.foodsList = []
        this.foodsFavorite = []
        this.render()
    }

    fuseMealSearch(){
        const options = {
            includeScore: true,
            keys: ["fields.strMeal"]
        }
        const fuse = new Fuse(this.foodsList,options)

        const searchInput = document.querySelector('#foodInput')
        searchInput.addEventListener('input', (e) => {
            setTimeout(() => {
                const result = fuse.search(e.target.value)
                this.createCard(result)
            }, 1000)
        })
    }

    createCard(result){
        const foodCardBody = document.querySelector('.foodList')
        
        foodCardBody.innerHTML = ""

        result.forEach((element) => {
            this.cardDesign(element.item.fields.strMeal,element.item.fields.strMealThumb,"heart-outline")
        })

        const foodFavoriteButton = document.querySelector('.foodFavoriteButton')
        foodFavoriteButton.addEventListener('click', () => {
            foodFavoriteButton.innerHTML = `<ion-icon name="heart-circle-outline"></ion-icon>`
        }) 
           
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
                    this.foodsList.push(element)
                })
            })

        loading.classList.remove('d-block')
        loading.classList.add('d-none')
        title.classList.remove('d-none')
        searchBar.classList.remove('d-none')

        this.fuseMealSearch()
    }

    cardDesign(title,thumb){
        const foodCard = document.querySelector('.foodList')
        const divBody = document.createElement('div')
        const cardDiv = document.createElement('div')
        const imgLayout = document.createElement('img')
        const cardBody = document.createElement('div')
        const cardTitle = document.createElement('h5')
        const cardButton = document.createElement('button')

        foodCard.append(divBody)
        divBody.append(cardDiv)
        cardDiv.append(imgLayout,cardBody)
        cardBody.append(cardTitle,cardButton)


        divBody.classList.add('col-3','mb-2')
        cardDiv.classList.add('card')
        imgLayout.classList.add('card-img-top')
        cardBody.classList.add('card-body')
        cardTitle.classList.add('card-title')
        cardButton.classList.add('foodFavoriteButton')

        
        cardTitle.textContent = title
        imgLayout.src = thumb
        cardButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`
    }



}

new FoodApp()