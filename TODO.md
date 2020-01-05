# To-Do








## API


- [ ] add to popularity algorithm that will increase if it's new, frequently
    brought and decrease if item is not brought much


### Schema additions
- [ ] add discounted price to api and db
- [ ] add rate info to api and db
- [ ] add popularity (from 1 to 10)
- [ ] add guaranty upgrade
- [ ] add manufactures
- [ ] short description for each item


### Orders

- [ ] add option to access orders with cognito auth token
- [ ] option to cancel orders if not locked (shipped)

### Newsletter
- [ ] handle newsletter subscriptions (add email with hash)
- [ ] handle newsletter unsubscribes (only with email and hash or logged in)

### Admin
- [x] implement cognito auth checking for CRUD actions
- [x] update item
- [ ] create item
- [ ] delete item








## Client

- [ ] change html lang on language change
- [ ] optimize logo and convert it to svg
- [ ] crop logo for small sizes
- [ ] 404 page
- [ ] style main carousel buttons
- [ ] add search icon to search component and make it bigger
- [ ] create reusable list component with infinite scroll
- [ ] create reusable card component
- [ ] add crisp chat
- [ ] style buttons for currency, language and cart

### Cart

- [ ] add number of items near icon
- [ ] implement like hamburger menu
- [ ] appear from right, push content


### My orders

- [ ] setup aws amplify
- [ ] add login form with email field
- [ ] then add field for sent code
- [ ] add hidden field to catch bot
- [ ] fetch orders
- [ ] orders list
- [ ] cancel orders

### Landing

#### Brand slider

- [ ] on bottom slider that shows mono logos of brands in slider 5 cols
- [ ] on click link to brands page

#### Item slider

- [ ] use lib for regular carousel
- [ ] 3 items in view
- [ ] on items page used for recent on main for popular items

#### categories

- [ ] add list of 8 categories
- [ ] each link to /category/ or /kategorija/ page
- [ ] add category pages
- [ ] add something like All items with category on the top and link for back
- [ ] add sort and number of shown items buttons

#### all items

- [ ] available as component but accessible on items / proizvodi page
- [ ] add sort and number of shown items buttons


### Header top

- [ ] add contact number
- [ ] add contact email
- [ ] add link to location component
- [ ] add link to my orders page

### Footer

- [ ] Amadeus logo with change color on hover animation like embedded in terrain look
- [ ] follow us list with social media links
- [ ] newsletter signup with email input
- [ ] short sitemap. about us, contact, my orders,...
- [ ] legal stuff. ubjeti koristenja, nacini placanja, nacini dostave, privacy
    policy


### About us

- [ ] as component short paragraph
- [ ] as page more content & images
- [ ] google maps location component



### Filtering state
- [ ] implement sort querying and categories in its own useEffects
- [ ] categories that add hidden true on items


### Item page

- [ ] item name big text
- [ ] under that availability and quantity
- [ ] price & discounted price
- [ ] add to cart button
- [ ] display bank rate info
- [ ] display guaranty info
- [ ] image carousel without next buttons, just pictures on bottom
- [ ] details that get pre-rendered html
- [ ] items slider with recent items
- [ ] about us component

### Brand page

- [ ] each manufacturer has its own page that shows all items from them like
    categories page

### Search page

- [ ] on main domain
- [ ] unloads all other components
- [ ] state to url
- [ ] url to state
- [ ] categories on side 1 col, items in grid with 3 col
- [ ] calculate price ranges
- [ ] categories have manufactures, categories and price ranges











## Dashboard
...








## Social media images
...










## Backups
- [ ] dynamodb all tables backup to s3
