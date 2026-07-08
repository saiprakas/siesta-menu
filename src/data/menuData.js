/* ============================================================
   SIESTA DESSERT CAFE — Default Data
   This is the seed data. Once the site runs, all edits happen
   in the Ops Panel (ops.html) and are stored in the backend.
   ============================================================ */

export const DEFAULT_DATA = {
  version: 1,
  updatedAt: 0,

  settings: {
    name: "Siesta Dessert Cafe",
    tagline: "Sweet Moments • Warm Memories • Just a Siesta Away",
    phone: "+91 89770 57699",
    whatsapp: "918977057699",
    instagram: "Siesta_dessert_cafe",
    address: "23-2-17/1, G S Raju Rd, Lakshmi Nagar, Satyanarayana Puram, Vijayawada, Andhra Pradesh 520011",
    mapQuery: "23-2-17/1, G S Raju Rd, Lakshmi Nagar, Satyanarayana Puram, Vijayawada, Andhra Pradesh 520011",
    hours: [
      { label: "Every Day", time: "10:00 AM – 11:00 PM" }
    ],
    about: "Siesta Dessert Cafe is Vijayawada's cosy corner for handcrafted desserts, wood-fired style pizzas, Belgian waffles, artisan cakes and comfort food — all 100% vegetarian. Born on 27th April 2026, Siesta was built on a simple idea: every sweet moment deserves a warm memory. Step in, slow down, and treat yourself — you're just a siesta away.",
    announcement: "",
    opsPassword: "siesta2704"
  },

  categories: [
    {
      id: "fries", name: "Fries & Snacks", icon: "🍟",
      desc: "Crispy, golden and impossible to share.",
      addons: [{ name: "Cheese Dip", price: 30 }, { name: "Peri Peri Sprinkle", price: 15 }],
      items: [
        { id: "french-fries", name: "French Fries", price: 140, veg: true, inStock: true, tags: [], desc: "Golden, crispy fries with a sprinkle of salt — the classic you can't resist." },
        { id: "peri-peri-fries", name: "Peri Peri Fries", price: 150, veg: true, inStock: true, tags: ["spicy", "bestseller"], desc: "Crispy fries dusted generously with fiery peri peri seasoning." },
        { id: "loaded-fries", name: "Loaded Fries", price: 180, veg: true, inStock: true, tags: ["bestseller"], desc: "Fries loaded with molten cheese sauce, veggies and our signature seasoning." },
        { id: "veg-nuggets", name: "Veg Nuggets", price: 160, veg: true, inStock: true, tags: [], desc: "Crunchy golden nuggets with a soft veggie centre, served with dip." },
        { id: "cheese-shots", name: "Cheese Shots", price: 160, veg: true, inStock: true, tags: [], desc: "Bite-sized crispy shots bursting with molten cheese." },
        { id: "veg-fingers", name: "Veg Fingers", price: 160, veg: true, inStock: true, tags: [], desc: "Golden-fried crispy veg fingers served with a tangy dip." }
      ]
    },
    {
      id: "pizza", name: "Pizza", icon: "🍕",
      desc: "Hand-stretched bases, house sauces, bubbling cheese.",
      addons: [{ name: "Extra Cheese", price: 40 }, { name: "Cheese Burst", price: 60 }],
      items: [
        { id: "margherita", name: "Margherita Pizza", price: 129, veg: true, inStock: true, tags: [], desc: "The classic — rich tomato sauce, mozzarella and Italian herbs." },
        { id: "cheese-corn-pizza", name: "Cheese & Corn Pizza", price: 179, veg: true, inStock: true, tags: [], desc: "Sweet golden corn under a generous blanket of mozzarella." },
        { id: "farmhouse", name: "Farmhouse Pizza", price: 210, veg: true, inStock: true, tags: ["bestseller"], desc: "Loaded with capsicum, onion, tomato and mushroom on herbed sauce." },
        { id: "veggie-delight", name: "Veggie Delight Pizza", price: 220, veg: true, inStock: true, tags: [], desc: "A colourful garden of fresh veggies over gooey cheese." },
        { id: "white-sauce-delight", name: "White Sauce Delight", price: 230, veg: true, inStock: true, tags: ["chefs-special"], desc: "Creamy white sauce base topped with crunchy veggies and cheese." },
        { id: "veggie-supreme", name: "Veggie Supreme", price: 179, veg: true, inStock: true, tags: [], desc: "Generously topped with garden veggies and extra cheese." },
        { id: "tandoori-paneer-pizza", name: "Tandoori Paneer Pizza", price: 199, veg: true, inStock: true, tags: ["spicy"], desc: "Smoky tandoori paneer chunks with onion, capsicum and spiced sauce." },
        { id: "tandoori-mushroom-pizza", name: "Tandoori Mushroom Pizza", price: 199, veg: true, inStock: true, tags: ["spicy"], desc: "Char-grilled tandoori mushrooms on a spiced tomato base." }
      ]
    },
    {
      id: "burgers", name: "Burgers", icon: "🍔",
      desc: "Soft buns, crunchy patties, big flavours.",
      addons: [{ name: "Extra Cheese Slice", price: 25 }],
      items: [
        { id: "aloo-tikka-burger", name: "Aloo Tikka Burger", price: 129, veg: true, inStock: true, tags: [], desc: "Crispy spiced potato patty with fresh veggies and creamy mayo." },
        { id: "paneer-tikka-burger", name: "Paneer Tikka Burger", price: 149, veg: true, inStock: true, tags: ["bestseller"], desc: "Grilled paneer tikka patty with crunchy salad and tangy sauce." },
        { id: "mushroom-plantation", name: "Mushroom Plantation Burger", price: 180, veg: true, inStock: true, tags: ["chefs-special"], desc: "Juicy mushroom patty stacked with cheese and our house sauce." }
      ]
    },
    {
      id: "waffles", name: "Waffles", icon: "🧇",
      desc: "Fresh Belgian waffles, pressed to order.",
      addons: [{ name: "Ice Cream Scoop", price: 40 }, { name: "Extra Chocolate Drizzle", price: 20 }],
      items: [
        { id: "triple-waffle", name: "Triple Chocolate Waffle", price: 110, veg: true, inStock: true, tags: [], desc: "Triple indulgence — dark, milk and white chocolate together." },
        { id: "kitkat-waffle", name: "KitKat Waffle", price: 120, veg: true, inStock: true, tags: ["bestseller"], desc: "Crunchy KitKat chunks over a chocolate-drizzled waffle." },
        { id: "oreo-waffle", name: "Oreo Waffle", price: 110, veg: true, inStock: true, tags: [], desc: "Crushed Oreos and chocolate sauce on a fresh golden waffle." },
        { id: "brownie-waffle", name: "Brownie Waffle", price: 110, veg: true, inStock: true, tags: [], desc: "Warm brownie chunks and chocolate sauce over crisp waffle." },
        { id: "biscoff-waffle", name: "Biscoff Waffle", price: 110, veg: true, inStock: true, tags: [], desc: "Caramelised Lotus Biscoff spread with a crunchy crumble." },
        { id: "almond-waffle", name: "Almond Waffle", price: 130, veg: true, inStock: true, tags: [], desc: "Roasted almond flakes with rich chocolate drizzle." },
        { id: "blueberry-waffle", name: "Blueberry Waffle", price: 150, veg: true, inStock: true, tags: [], desc: "Sweet-tart blueberry compote on a golden Belgian waffle." },
        { id: "strawberry-waffle", name: "Strawberry Waffle", price: 150, veg: true, inStock: true, tags: [], desc: "Fresh strawberry compote with white chocolate drizzle." },
        { id: "mixed-berry-waffle", name: "Mixed Berry Waffle", price: 160, veg: true, inStock: true, tags: ["chefs-special"], desc: "A juicy medley of berries over a crisp waffle." }
      ]
    },
    {
      id: "cakes", name: "Cakes", icon: "🎂",
      desc: "Baked fresh for birthdays, celebrations & cravings.",
      addons: [{ name: "Personalised Message", price: 0 }, { name: "Candles & Knife", price: 0 }],
      items: [
        { id: "vanilla-cake", name: "Vanilla Cake", price: 579, veg: true, inStock: true, tags: [], desc: "Light vanilla sponge layered with silky vanilla cream." },
        { id: "pineapple-cake", name: "Pineapple Cake", price: 579, veg: true, inStock: true, tags: [], desc: "Fluffy sponge layered with juicy pineapple and fresh cream." },
        { id: "blueberry-cake", name: "Blueberry Cake", price: 579, veg: true, inStock: true, tags: [], desc: "Vanilla sponge crowned with luscious blueberry compote." },
        { id: "mango-cake", name: "Mango Cake", price: 579, veg: true, inStock: true, tags: [], desc: "Seasonal mango cream layered in a soft sponge." },
        { id: "butterscotch-cake", name: "Butterscotch Cake", price: 559, veg: true, inStock: true, tags: [], desc: "Crunchy praline with golden butterscotch cream." },
        { id: "chocolate-cake", name: "Chocolate Cake", price: 530, veg: true, inStock: true, tags: ["bestseller"], desc: "Rich, moist chocolate layers finished with dark ganache." },
        { id: "honey-almond-cake", name: "Honey Almond Cake", price: 530, veg: true, inStock: true, tags: [], desc: "Honey-kissed sponge with roasted almond crunch." },
        { id: "black-forest-cake", name: "Black Forest Cake", price: 530, veg: true, inStock: true, tags: [], desc: "Chocolate sponge, cherries and clouds of whipped cream." },
        { id: "white-forest-cake", name: "White Forest Cake", price: 530, veg: true, inStock: true, tags: [], desc: "A white chocolate twist on the classic forest cake." },
        { id: "kitkat-cake", name: "KitKat Cake", price: 650, veg: true, inStock: true, tags: [], desc: "Chocolate cake fenced with KitKat fingers and gems." },
        { id: "oreo-cake", name: "Oreo Cake", price: 650, veg: true, inStock: true, tags: [], desc: "Cookies & cream cake loaded with crushed Oreo." },
        { id: "red-velvet-cake", name: "Red Velvet Cake", price: 700, veg: true, inStock: true, tags: ["bestseller"], note: "500 g", desc: "Classic red velvet with smooth cream cheese frosting." },
        { id: "tiramisu-cake", name: "Tiramisu Cake", price: 799, veg: true, inStock: true, tags: ["chefs-special"], note: "500 g", desc: "Coffee-soaked layers with airy mascarpone cream." },
        { id: "passion-delight-cake", name: "Passion Delight Cake", price: 860, veg: true, inStock: true, tags: ["chefs-special"], desc: "Our signature passion fruit celebration cake." },
        { id: "apricot-delight-cake", name: "Apricot Delight Cake", price: 850, veg: true, inStock: true, tags: [], desc: "Delicate apricot layers with fresh cream." }
      ]
    },
    {
      id: "sandwiches", name: "Sandwiches", icon: "🥪",
      desc: "Grilled golden, stuffed generous.",
      addons: [{ name: "Extra Cheese", price: 25 }],
      items: [
        { id: "bombay-sandwich", name: "Bombay Style Sandwich", price: 130, veg: true, inStock: true, tags: [], desc: "Street-style layers of spiced potato, chutney and crunchy veggies." },
        { id: "cheese-grilled-sandwich", name: "Cheese Grilled Sandwich", price: 159, veg: true, inStock: true, tags: ["bestseller"], desc: "Grilled golden with an epic molten cheese pull." },
        { id: "corn-sandwich", name: "Corn Sandwich", price: 149, veg: true, inStock: true, tags: [], desc: "Creamy sweet corn filling, grilled to perfection." },
        { id: "aloo-tikka-sandwich", name: "Aloo Tikka Sandwich", price: 149, veg: true, inStock: true, tags: [], desc: "Spiced potato tikka with cooling mint chutney." },
        { id: "paneer-tikka-sandwich", name: "Paneer Tikka Sandwich", price: 159, veg: true, inStock: true, tags: [], desc: "Smoky paneer tikka with crunchy veggies and house sauce." },
        { id: "chocolate-sandwich", name: "Chocolate Sandwich", price: 119, veg: true, inStock: true, tags: [], desc: "Melted chocolate in crisp golden bread — dessert in a sandwich." },
        { id: "mushroom-sandwich", name: "Mushroom Sandwich", price: 119, veg: true, inStock: true, tags: [], desc: "Buttery sautéed mushrooms with herbs and cheese." }
      ]
    },
    {
      id: "pasta", name: "Pasta", icon: "🍝",
      desc: "Slow-tossed sauces, al dente always.",
      addons: [{ name: "Extra Cheese", price: 30 }, { name: "Garlic Bread (2 pc)", price: 60 }],
      items: [
        { id: "red-sauce-pasta", name: "Red Sauce Pasta", price: 210, veg: true, inStock: true, tags: [], desc: "Penne tossed in a tangy, herby tomato sauce." },
        { id: "alfredo-pasta", name: "Alfredo Pasta", price: 230, veg: true, inStock: true, tags: ["bestseller"], desc: "Creamy white sauce pasta with herbs and parmesan." },
        { id: "pesto-pasta", name: "Pesto Pasta", price: 250, veg: true, inStock: true, tags: ["chefs-special"], desc: "Fresh basil pesto tossed pasta finished with cheese." }
      ]
    },
    {
      id: "desserts", name: "Desserts", icon: "🍮",
      desc: "The reason we exist. Handcrafted daily.",
      addons: [{ name: "Ice Cream Scoop", price: 40 }],
      items: [
        { id: "apricot-delight", name: "Apricot Delight", price: 140, veg: true, inStock: true, tags: [], desc: "Layered apricot dessert with cream and a golden crunch." },
        { id: "passion-delight", name: "Passion Delight", price: 140, veg: true, inStock: true, tags: [], desc: "Tangy-sweet passion fruit layered dessert." },
        { id: "tres-leches", name: "Tres Leches", price: 170, veg: true, inStock: true, tags: [], desc: "Milk-soaked sponge cake, chilled, creamy and dreamy." },
        { id: "mango-tres-leches", name: "Mango Tres Leches", price: 200, veg: true, inStock: true, tags: ["chefs-special"], desc: "Our tres leches crowned with fresh mango." },
        { id: "biscoff-cheesecake", name: "Lotus Biscoff Cheesecake", price: 210, veg: true, inStock: true, tags: ["bestseller"], desc: "Creamy baked-style cheesecake on a Biscoff crumble base." },
        { id: "death-by-chocolate", name: "Death by Chocolate Pastry", price: 210, veg: true, inStock: true, tags: ["bestseller"], desc: "Decadent layers of pure chocolate overload." },
        { id: "nutella-brownie", name: "Nutella Brownie", price: 120, veg: true, inStock: true, tags: [], desc: "Fudgy brownie swirled with Nutella." },
        { id: "choco-truffle-brownie", name: "Choco Truffle Brownie", price: 120, veg: true, inStock: true, tags: [], desc: "Fudgy brownie topped with silky chocolate truffle." },
        { id: "biscoff-brownie", name: "Biscoff Brownie", price: 130, veg: true, inStock: true, tags: [], desc: "Fudgy brownie layered with caramelised Biscoff." },
        { id: "regular-brownie", name: "Regular Brownie", price: 90, veg: true, inStock: true, tags: [], desc: "The classic — dense, fudgy, chocolatey." }
      ]
    },
    {
      id: "shakes", name: "Shakes & Thickshakes", icon: "🥤",
      desc: "Blended thick, topped generous, served chilled.",
      addons: [{ name: "Ice Cream Scoop", price: 40 }, { name: "Whipped Cream", price: 20 }],
      items: [
        { id: "mexican-vanilla-ms", name: "Mexican Vanilla Milkshake", price: 130, veg: true, inStock: true, tags: [], desc: "Creamy vanilla shake with a warm Mexican twist." },
        { id: "very-berry-ms", name: "Very Berry Milkshake", price: 130, veg: true, inStock: true, tags: [], desc: "Mixed berries blended into a creamy dream." },
        { id: "blueberry-plunge-ms", name: "Blueberry Plunge Milkshake", price: 130, veg: true, inStock: true, tags: [], desc: "Deep blueberry indulgence in every sip." },
        { id: "crunchy-caramel-ms", name: "Crunchy Caramel Milkshake", price: 130, veg: true, inStock: true, tags: [], desc: "Golden caramel shake with a crunchy praline topping." },
        { id: "nutella-brownie-ms", name: "Nutella Brownie Milkshake", price: 160, veg: true, inStock: true, tags: ["bestseller"], desc: "Nutella and brownie chunks blended thick and creamy." },
        { id: "cookie-cream-ms", name: "Cookies & Cream Milkshake", price: 160, veg: true, inStock: true, tags: [], desc: "The Oreo-loaded classic, done right." },
        { id: "nutella-latte-ms", name: "Nutella Latte Milkshake", price: 160, veg: true, inStock: true, tags: [], desc: "Coffee meets Nutella in one dreamy shake." },
        { id: "mexican-vanilla-ts", name: "Mexican Vanilla Thickshake", price: 230, veg: true, inStock: true, tags: [], desc: "Extra thick, extra creamy Mexican vanilla." },
        { id: "very-berry-ts", name: "Very Berry Thickshake", price: 230, veg: true, inStock: true, tags: [], desc: "A thick, spoonable berry indulgence." },
        { id: "blueberry-ts", name: "Blueberry Thickshake", price: 230, veg: true, inStock: true, tags: [], desc: "Ultra-thick blueberry, topped generously." },
        { id: "crunchy-caramel-ts", name: "Crunchy Caramel Thickshake", price: 230, veg: true, inStock: true, tags: [], desc: "Thick caramel shake with praline crunch." },
        { id: "belgian-chocolate-ts", name: "Belgian Chocolate Thickshake", price: 250, veg: true, inStock: true, tags: ["bestseller"], desc: "Premium Belgian chocolate, ultra thick and rich." },
        { id: "nutella-brownie-ts", name: "Nutella Brownie Thickshake", price: 250, veg: true, inStock: true, tags: [], desc: "Nutella, brownie and cream — thick enough for a spoon." },
        { id: "cookie-cream-ts", name: "Cookies & Cream Thickshake", price: 250, veg: true, inStock: true, tags: [], desc: "Thick cookies & cream loaded with Oreo." },
        { id: "nutella-latte-ts", name: "Nutella Latte Thickshake", price: 250, veg: true, inStock: true, tags: [], desc: "Thick, creamy coffee-Nutella indulgence." }
      ]
    },
    {
      id: "maggie", name: "Maggie", icon: "🍜",
      desc: "2-minute nostalgia, café style.",
      addons: [{ name: "Extra Cheese", price: 25 }, { name: "Extra Veggies", price: 20 }],
      items: [
        { id: "masala-maggie", name: "Masala Maggie", price: 70, veg: true, inStock: true, tags: [], desc: "The classic comfort — hot, saucy masala Maggie." },
        { id: "double-masala-maggie", name: "Double Masala Maggie", price: 80, veg: true, inStock: true, tags: ["spicy"], desc: "Double the masala punch for spice lovers." },
        { id: "butter-maggie", name: "Butter Maggie", price: 80, veg: true, inStock: true, tags: [], desc: "Slow-cooked in creamy butter for extra richness." },
        { id: "corn-maggie", name: "Corn Maggie", price: 85, veg: true, inStock: true, tags: [], desc: "Sweet corn tossed masala Maggie." },
        { id: "mayo-maggie", name: "Mayo Maggie", price: 85, veg: true, inStock: true, tags: [], desc: "Creamy mayo swirled through masala Maggie." },
        { id: "butter-peri-peri-maggie", name: "Butter Peri Peri Maggie", price: 95, veg: true, inStock: true, tags: ["spicy"], desc: "Buttery Maggie with a fiery peri peri kick." },
        { id: "peri-peri-maggie", name: "Peri Peri Maggie", price: 90, veg: true, inStock: true, tags: ["spicy"], desc: "Tossed in bold peri peri seasoning." },
        { id: "cheesy-maggie", name: "Cheesseyyy Maggie", price: 100, veg: true, inStock: true, tags: ["bestseller"], desc: "Loaded with gooey melted cheese." },
        { id: "korean-maggie", name: "Korean Style Maggie", price: 110, veg: true, inStock: true, tags: ["spicy"], desc: "Sweet-spicy Korean sauce tossed Maggie." },
        { id: "maggie-masala-pasta", name: "Maggie Masala Pasta", price: 130, veg: true, inStock: true, tags: [], desc: "A fun fusion of Maggie masala and pasta." },
        { id: "schezwan-maggie", name: "Schezwan Maggie", price: 140, veg: true, inStock: true, tags: ["spicy"], desc: "Fiery schezwan sauce tossed Maggie." },
        { id: "white-sauce-maggie", name: "White Sauce Maggie", price: 150, veg: true, inStock: true, tags: [], desc: "Creamy white sauce Maggie indulgence." },
        { id: "pesto-maggie", name: "Pesto Maggie", price: 160, veg: true, inStock: true, tags: ["chefs-special"], desc: "A basil pesto twist on your favourite Maggie." },
        { id: "paneer-maggie", name: "Paneer Maggie", price: 90, veg: true, inStock: true, tags: [], desc: "Masala Maggie topped with soft paneer cubes." },
        { id: "corn-paneer-maggie", name: "Corn Paneer Maggie", price: 95, veg: true, inStock: true, tags: [], desc: "Sweet corn and paneer over masala Maggie." },
        { id: "paneer-mayo-maggie", name: "Paneer Mayo Maggie", price: 100, veg: true, inStock: true, tags: [], desc: "Creamy mayo Maggie loaded with paneer." },
        { id: "peri-peri-paneer-maggie", name: "Peri Peri Paneer Maggie", price: 100, veg: true, inStock: true, tags: ["spicy"], desc: "Peri peri Maggie with spiced paneer cubes." },
        { id: "schezwan-paneer-maggie", name: "Schezwan Paneer Maggie", price: 90, veg: true, inStock: true, tags: ["spicy"], desc: "Fiery schezwan Maggie with paneer." },
        { id: "korean-paneer-maggie", name: "Korean Paneer Maggie", price: 110, veg: true, inStock: true, tags: ["spicy"], desc: "Korean-style Maggie topped with paneer." },
        { id: "cheesy-paneer-maggie", name: "Cheesseyyy Paneer Maggie", price: 110, veg: true, inStock: true, tags: [], desc: "Cheese-loaded Maggie with soft paneer cubes." }
      ]
    },
    {
      id: "eatright", name: "Eat-Right Dishes", icon: "🥗",
      desc: "Lighter picks for mindful cravings.",
      addons: [],
      items: [
        { id: "er-chocolate-sandwich", name: "Chocolate Sandwich", price: 119, veg: true, inStock: true, tags: [], desc: "Our chocolate sandwich, made the eat-right way." },
        { id: "er-mushroom-sandwich", name: "Mushroom Sandwich", price: 119, veg: true, inStock: true, tags: [], desc: "Herby mushroom sandwich, light and wholesome." }
      ]
    }
  ],

  callbacks: []
};
