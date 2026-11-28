(function (global) {
  "use strict";

  var CATEGORIES = [
    { id: "all", label: "All" },
    { id: "Cakes", label: "Cakes" },
    { id: "Cupcakes", label: "Cupcakes" },
    { id: "Custom", label: "Custom" },
    { id: "Milk Cakes", label: "Milk Cakes" },
    { id: "Brownies & Bars", label: "Brownies & Bars" },
    { id: "Pastries & Cookies", label: "Pastries & Cookies" }
  ];

  var DIETARY_FILTERS = [
    { id: "best-seller", label: "Best Seller" },
    { id: "eggless-option", label: "Eggless Option" },
    { id: "nut-free", label: "Nut-Free" }
  ];

  var SORT_OPTIONS = [
    { id: "featured", label: "Featured First" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "name-asc", label: "Name: A to Z" },
    { id: "rating-desc", label: "Highest Rated" }
  ];

  var MENU_ITEMS = [
    {
      id: "cake-chocolate",
      name: "Chocolate Cake",
      category: "Cakes",
      weight: "1 kg (Serves 6-8)",
      price: 1800,
      image: "../images/chocolate-fudge-cake.svg",
      alt: "Rich Chocolate Cake topped with smooth chocolate cream and curls",
      badge: "Best Seller",
      featured: true,
      rating: 4.8,
      reviewCount: 1200,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["best-seller", "eggless-option", "nut-free"],
      shortDescription: "Rich chocolate cake with smooth cream.",
      description: "Rich chocolate cake with smooth cream. Baked fresh in small batches using Dutch-processed cocoa, fresh dairy butter, and whipped dark chocolate cream frosting.",
      bakerNote: "Best enjoyed at cool room temperature so the smooth chocolate cream stays silky.",
      storage: "Refrigerate in an airtight cake box for up to 4 days.",
      ingredients: [
        "Dutch-processed cocoa powder & dark chocolate",
        "Fresh dairy whipping cream & cultured butter",
        "Unbleached pastry flour & caster sugar",
        "Farm-fresh eggs (eggless yoghurt option available)",
        "Pure Madagascar vanilla extract"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Prepared in a home kitchen that also handles tree nuts and soy. Nut-free recipe.",
      variants: [
        { id: "default", label: "Small (1 kg)", price: 1800, note: "Serves 6-8 guests" },
        { id: "2kg", label: "Large (2 kg)", price: 3400, note: "Double celebration layer" },
        { id: "eggless-1kg", label: "Small (1 kg) Eggless", price: 1950, note: "100% egg-free sponge" }
      ]
    },
    {
      id: "cake-strawberry",
      name: "Strawberry Cake",
      category: "Cakes",
      weight: "1 kg (Serves 6-8)",
      price: 1800,
      image: "../images/strawberry-cake.svg",
      alt: "Strawberry Cake layered with pink strawberry cream and fresh berries",
      badge: "Fresh Fruit",
      featured: true,
      rating: 4.9,
      reviewCount: 860,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["best-seller", "eggless-option", "nut-free"],
      shortDescription: "Soft vanilla sponge layered with fresh strawberry compote and cream.",
      description: "Light, fluffy sponge cake filled with slow-simmered fresh strawberry compote and finished with pastel pink strawberry whipped dairy cream.",
      bakerNote: "Keep chilled until 15 minutes before slicing for clean berry layers.",
      storage: "Refrigerate at 4°C; best consumed within 3 days.",
      ingredients: [
        "Fresh crushed strawberries & house berry compote",
        "Fresh dairy cream & unsalted butter",
        "Unbleached cake flour & caster sugar",
        "Farm-fresh eggs (eggless option available)",
        "Pure vanilla bean essence"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Contains no artificial strawberry essence or nuts. Shared kitchen equipment may touch nuts.",
      variants: [
        { id: "default", label: "Small (1 kg)", price: 1800, note: "Serves 6-8 guests" },
        { id: "2kg", label: "Large (2 kg)", price: 3400, note: "Party celebration size" },
        { id: "eggless-1kg", label: "Small (1 kg) Eggless", price: 1950, note: "100% egg-free sponge" }
      ]
    },
    {
      id: "cake-vanilla",
      name: "Vanilla Cake",
      category: "Cakes",
      weight: "1 kg (Serves 6-8)",
      price: 1600,
      image: "../images/vanilla-cake.svg",
      alt: "Classic Vanilla Cake with whipped vanilla buttercream and pink rosettes",
      badge: "Classic Bake",
      featured: true,
      rating: 4.7,
      reviewCount: 640,
      prepTime: "Same-day (3 hrs notice)",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Fluffy Madagascar vanilla sponge frosted with silky buttercream.",
      description: "Timeless home-baked vanilla celebration cake infused with real vanilla bean paste and layered with light, whipped buttercream frosting.",
      bakerNote: "Pairs wonderfully with afternoon chai or coffee; ask for complimentary birthday candles.",
      storage: "Keep covered in the fridge up to 4 days; soften 20 mins before serving.",
      ingredients: [
        "Madagascar vanilla bean paste",
        "Cultured dairy butter & fresh cream",
        "Fine pastry flour & caster sugar",
        "Whole milk & fresh eggs"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Nut-free and soy-free formula. Made in a kitchen where walnuts and almonds are baked.",
      variants: [
        { id: "default", label: "Small (1 kg)", price: 1600, note: "Serves 6-8 guests" },
        { id: "2kg", label: "Large (2 kg)", price: 3000, note: "Serves 12-16 guests" },
        { id: "eggless-1kg", label: "Small (1 kg) Eggless", price: 1750, note: "Egg-free yoghurt sponge" }
      ]
    },
    {
      id: "cake-red-velvet",
      name: "Red Velvet Cake",
      category: "Cakes",
      weight: "1 kg (Serves 6-8)",
      price: 1900,
      image: "../images/red-velvet-cake.svg",
      alt: "Red Velvet Cake frosted with smooth cream cheese icing and red crumbs",
      badge: "Favourite",
      featured: true,
      rating: 4.9,
      reviewCount: 980,
      prepTime: "Same-day (5 hrs notice)",
      dietary: ["best-seller", "eggless-option", "nut-free"],
      shortDescription: "Velvety crimson cocoa sponge with tangy cream-cheese frosting.",
      description: "Tender buttermilk red velvet layers with a subtle cocoa finish, frosted in silky whipped cream-cheese icing and finished with fine velvet crumbs.",
      bakerNote: "Our #1 choice for anniversaries, birthdays, and bridal showers.",
      storage: "Keep refrigerated; slice chilled for crisp cream-cheese layers.",
      ingredients: [
        "Fresh cultured buttermilk & unsweetened cocoa",
        "Cream cheese & unsalted dairy butter",
        "Caster sugar & apple cider vinegar",
        "Pure vanilla extract & cake flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Nut-free sponge and icing; produced in a home kitchen handling tree nuts.",
      variants: [
        { id: "default", label: "Small (1 kg)", price: 1900, note: "Serves 6-8 guests" },
        { id: "2kg", label: "Large (2 kg)", price: 3600, note: "Serves 12-16 guests" },
        { id: "eggless-1kg", label: "Small (1 kg) Eggless", price: 2050, note: "Egg-free buttermilk base" }
      ]
    },
    {
      id: "box-red-velvet-cupcakes",
      name: "Classic Red Velvet Cupcakes",
      category: "Cupcakes",
      weight: "Box of 6",
      price: 1800,
      image: "../images/red-velvet-cupcakes.svg",
      alt: "Red velvet cupcakes swirled with cream cheese frosting",
      badge: "Gift Pick",
      featured: true,
      rating: 4.8,
      reviewCount: 310,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Velvety cocoa-buttermilk cupcakes piped high with cream-cheese swirls.",
      description: "Tender crimson buttermilk cupcakes with a subtle cocoa finish, topped with whipped cream-cheese frosting and delicate red velvet crumbs. Ideal for birthdays and gifting.",
      bakerNote: "Available with complimentary ribbon box wrapping on request in order notes.",
      storage: "Refrigerate and bring to cool room temperature 15 minutes before serving.",
      ingredients: [
        "Fresh buttermilk & unsweetened cocoa",
        "Cream cheese & unsalted butter",
        "Caster sugar & apple cider vinegar",
        "Pure vanilla extract"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Nut-free cupcake box; prepared in a kitchen that also uses almonds and walnuts.",
      variants: [
        { id: "default", label: "Box of 6", price: 1800, note: "Standard gift box" },
        { id: "box12", label: "Box of 12", price: 3400, note: "Party dozen" },
        { id: "eggless6", label: "Box of 6 (Eggless)", price: 1950, note: "Egg-free recipe" }
      ]
    },
    {
      id: "box-assorted-cupcakes",
      name: "Assorted Swirl Cupcakes",
      category: "Cupcakes",
      weight: "Box of 6",
      price: 1550,
      image: "../images/assorted-cupcakes.svg",
      alt: "Assorted chocolate and vanilla cupcakes topped with pink and cream swirls",
      badge: "Tea Time",
      featured: false,
      rating: 4.8,
      reviewCount: 215,
      prepTime: "Same-day (3 hrs notice)",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Three rich chocolate and three vanilla bean cupcakes with buttercream swirls.",
      description: "A crowd-pleasing gift box combining three moist Belgian cocoa cupcakes and three fluffy Madagascar vanilla cupcakes, finished with pink strawberry and vanilla swirls.",
      bakerNote: "Great for office treats, kids' birthdays, and family tea tables.",
      storage: "Store covered at cool room temperature for 2 days or refrigerate up to 4 days.",
      ingredients: [
        "Belgian cocoa & vanilla bean paste",
        "Cultured dairy butter & icing sugar",
        "Whole milk & unbleached flour",
        "Farm-fresh eggs"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "100% nut-free recipe; baked in a home kitchen that handles tree nuts.",
      variants: [
        { id: "default", label: "Box of 6", price: 1550, note: "3 Chocolate + 3 Vanilla" },
        { id: "box12", label: "Box of 12", price: 2950, note: "6 Chocolate + 6 Vanilla" }
      ]
    },
    {
      id: "custom-signature-cake",
      name: "Custom Celebration Cake",
      category: "Custom",
      weight: "1 kg Custom Design",
      price: 2500,
      image: "../images/custom-cake.svg",
      alt: "Custom celebration cake decorated with pastel buttercream and topper",
      badge: "Made to Order",
      featured: false,
      rating: 4.9,
      reviewCount: 420,
      prepTime: "48 hrs advance notice",
      isCustomPageLink: true,
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Upload your inspiration photo and pick size, flavour, and custom message.",
      description: "Bespoke single-tier celebration cake crafted to match your colour palette, custom inscription, and preferred flavour. Design your exact specifications in our Custom Cake Studio.",
      bakerNote: "Need a specific theme or photo cake? Use our 5-step Custom Cake page to upload your design.",
      storage: "Refrigerate at 4°C; bring out 20 minutes before cutting.",
      ingredients: [
        "Choice of Chocolate, Vanilla, Strawberry, or Red Velvet sponge",
        "Swiss meringue buttercream or dark chocolate ganache",
        "Food-safe pastel colours & custom plaque"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (Eggless available)", "Optional Tree Nuts"],
      allergenNote: "Allergens depend on your chosen sponge and toppings. Specify allergies in the Custom Cake form.",
      variants: [
        { id: "default", label: "Small (1 kg) Custom", price: 2500, note: "Single-tier bespoke design" },
        { id: "2kg", label: "Large (2 kg) Custom", price: 4600, note: "Extended celebration size" }
      ]
    },
    {
      id: "cake-belgian-fudge",
      name: "Belgian Chocolate Fudge Cake",
      category: "Cakes",
      weight: "1 lb (Serves 4-6)",
      price: 2850,
      image: "../images/chocolate-fudge-cake.svg",
      alt: "Belgian Chocolate Fudge Cake topped with chocolate ganache",
      badge: "Signature",
      featured: false,
      rating: 4.9,
      reviewCount: 480,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["best-seller", "eggless-option", "nut-free"],
      shortDescription: "Moist dark cocoa sponge layered with silky 54% Belgian chocolate ganache.",
      description: "Our indulgent signature fudge cake: three tender layers of Dutch-processed cocoa sponge soaked lightly with espresso-kissed syrup and finished in glossy 54% Belgian dark chocolate ganache.",
      bakerNote: "Best served at room temperature for a melt-in-the-mouth fudge texture.",
      storage: "Refrigerate for up to 4 days in an airtight cake box.",
      ingredients: [
        "54% Belgian dark couverture chocolate",
        "Dutch-processed cocoa powder",
        "Cultured dairy butter",
        "Farm-fresh eggs (eggless yoghurt base available)",
        "Brown cane sugar & vanilla bean extract"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Contains dairy, wheat, and eggs (eggless option available). Nut-free recipe.",
      variants: [
        { id: "default", label: "1 lb (Serves 4-6)", price: 2850, note: "Standard celebration cake" },
        { id: "2lb", label: "2 lb (Serves 8-10)", price: 5400, note: "Double-layer gathering size" },
        { id: "eggless-1lb", label: "1 lb Eggless", price: 3000, note: "100% egg-free sponge" }
      ]
    },
    {
      id: "tub-lotus-tres-leches",
      name: "Lotus Biscoff Tres Leches Tub",
      category: "Milk Cakes",
      weight: "500 g Family Tub",
      price: 1650,
      image: "../images/lotus-tres-leches.svg",
      alt: "Lotus Biscoff Tres Leches milk cake tub with caramel biscuit crumble",
      badge: "Customer Favourite",
      featured: false,
      rating: 4.9,
      reviewCount: 620,
      prepTime: "Fresh daily batch",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Ultra-soft vanilla sponge soaked in three-milk blend with warm Biscoff swirl.",
      description: "Fluffy sponge baked in-house and steeped overnight in a three-milk infusion, crowned with whipped chantilly, melted Lotus Biscoff spread, and crushed caramelized biscuits.",
      bakerNote: "Keep chilled until serving; spoon straight from the reusable tub.",
      storage: "Keep refrigerated at 4°C; enjoy within 3 days.",
      ingredients: [
        "Fresh dairy cream & evaporated milk",
        "Condensed milk & caramelized Biscoff spread",
        "Lotus Biscoff biscuit crumble",
        "Madagascar vanilla essence & sponge flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Soy (in Biscoff)"],
      allergenNote: "Contains soy lecithin from Lotus Biscoff biscuits. Nut-free recipe.",
      variants: [
        { id: "default", label: "500 g Family Tub", price: 1650, note: "Serves 3-4" },
        { id: "1kg", label: "1 kg Party Tray", price: 3100, note: "Serves 7-8" }
      ]
    },
    {
      id: "tub-pistachio-kunafa",
      name: "Pistachio Kunafa Milk Cake",
      category: "Milk Cakes",
      weight: "500 g Family Tub",
      price: 1950,
      image: "../images/pistachio-kunafa-tres-leches.svg",
      alt: "Pistachio kunafa milk cake tub topped with roasted pistachio cream and crisp kataifi",
      badge: "Limited Batch",
      featured: false,
      rating: 5.0,
      reviewCount: 330,
      prepTime: "Same-day (5 hrs notice)",
      dietary: ["best-seller"],
      shortDescription: "Cardamom milk sponge layered with pistachio cream and toasted kunafa.",
      description: "Inspired by Middle Eastern patisserie: airy sponge soaked in cardamom-rose milk, topped with velvety roasted pistachio praline and buttery toasted kataifi pastry.",
      bakerNote: "We toast the kunafa right before dispatch so every spoonful keeps its crunch.",
      storage: "Keep refrigerated; consume within 48 hours for peak crunch.",
      ingredients: [
        "Roasted pistachio paste & crushed pistachios",
        "Toasted buttered kataifi (kunafa) strands",
        "Three-milk cardamom infusion",
        "Whipped fresh dairy cream"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Pistachios)"],
      allergenNote: "Contains generous roasted pistachios. Not suitable for tree-nut allergies.",
      variants: [
        { id: "default", label: "500 g Family Tub", price: 1950, note: "Serves 3-4" },
        { id: "1kg", label: "1 kg Celebration Tray", price: 3700, note: "Serves 7-8" }
      ]
    },
    {
      id: "tub-classic-tiramisu",
      name: "Artisan Espresso Tiramisu Tub",
      category: "Milk Cakes",
      weight: "450 g Tub",
      price: 1750,
      image: "../images/tiramisu-tub.svg",
      alt: "Layered espresso tiramisu tub dusted with dark cocoa powder",
      badge: "100% Halal",
      featured: false,
      rating: 4.8,
      reviewCount: 270,
      prepTime: "Chilled overnight",
      dietary: ["nut-free"],
      shortDescription: "House-baked savoiardi fingers dipped in dark espresso and mascarpone cream.",
      description: "Our alcohol-free artisan tiramisu pairs freshly pulled Arabica espresso with whipped cream-cheese mascarpone mousse and bitter Dutch cocoa dusting.",
      bakerNote: "Zero alcohol, zero gelatin — made purely with fresh dairy cream and brewed coffee.",
      storage: "Keep refrigerated; enjoy within 3 days.",
      ingredients: [
        "Freshly brewed Arabica espresso",
        "Mascarpone-style whipped cream",
        "House-baked ladyfinger sponge",
        "Dark Dutch cocoa powder"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      allergenNote: "Contains caffeine from freshly brewed espresso. Nut-free.",
      variants: [
        { id: "default", label: "450 g Tub", price: 1750, note: "Serves 3-4" },
        { id: "900g", label: "900 g Dinner Party Tray", price: 3350, note: "Serves 6-8" }
      ]
    },
    {
      id: "box-caramel-brownies",
      name: "Salted Caramel Walnut Brownies",
      category: "Brownies & Bars",
      weight: "Box of 6",
      price: 1550,
      image: "../images/caramel-walnut-brownies.svg",
      alt: "Fudge brownies drizzled with salted caramel and toasted walnuts",
      badge: "Rich & Gooey",
      featured: false,
      rating: 4.9,
      reviewCount: 410,
      prepTime: "Fresh daily batch",
      dietary: ["best-seller"],
      shortDescription: "Dark chocolate fudge brownies ribboned with sea-salted caramel and walnuts.",
      description: "Dense, intensely chocolatey squares baked with browned butter and 70% dark chocolate, studded with toasted Kashmiri walnuts and finished with house-made salted caramel.",
      bakerNote: "Warm a square for 10 seconds and serve with vanilla ice cream.",
      storage: "Airtight container at room temperature for 4 days or chilled for 7 days.",
      ingredients: [
        "70% dark chocolate & browned butter",
        "Toasted Kashmiri walnuts",
        "House-cooked salted caramel",
        "Flaky sea salt & cocoa"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Walnuts)"],
      allergenNote: "Standard box contains walnuts; select the No Walnuts variant if nut-free is needed.",
      variants: [
        { id: "default", label: "Box of 6", price: 1550, note: "6 generous fudge squares" },
        { id: "box12", label: "Box of 12", price: 2950, note: "12 squares sharing box" },
        { id: "nutfree6", label: "Box of 6 (No Walnuts)", price: 1500, note: "Pure salted caramel fudge" }
      ]
    },
    {
      id: "box-cinnamon-rolls",
      name: "Warm Cream-Cheese Cinnamon Rolls",
      category: "Pastries & Cookies",
      weight: "Box of 4",
      price: 1400,
      image: "../images/cinnamon-rolls.svg",
      alt: "Box of four glazed cinnamon rolls with vanilla cream-cheese icing",
      badge: "Morning Batch",
      featured: false,
      rating: 4.8,
      reviewCount: 370,
      prepTime: "Morning & afternoon slots",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Pillow-soft brioche spirals swirled with Ceylon cinnamon and tangy glaze.",
      description: "Slow-proofed enriched brioche dough rolled generously with brown sugar and aromatic Ceylon cinnamon, baked until golden and slathered warm with vanilla cream-cheese frosting.",
      bakerNote: "Reheat for 15-20 seconds before eating for fresh-out-of-the-oven softness.",
      storage: "Store covered at room temperature for 1 day or refrigerate up to 3 days.",
      ingredients: [
        "Enriched brioche flour & salted butter",
        "Ceylon cinnamon & dark muscovado sugar",
        "Cream cheese & icing sugar glaze",
        "Whole milk & active baker's yeast"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      allergenNote: "Nut-free recipe. Contains wheat gluten, dairy, and egg-enriched brioche dough.",
      variants: [
        { id: "default", label: "Box of 4", price: 1400, note: "Classic cream-cheese glaze" },
        { id: "box8", label: "Box of 8", price: 2650, note: "Family brunch box" }
      ]
    },
    {
      id: "pack-almond-croissants",
      name: "Butter Almond Croissants",
      category: "Pastries & Cookies",
      weight: "Pack of 2",
      price: 950,
      image: "../images/almond-croissants.svg",
      alt: "Flaky golden almond croissants dusted with toasted almonds",
      badge: "Artisan Bake",
      featured: false,
      rating: 4.7,
      reviewCount: 240,
      prepTime: "Morning batch (24 hrs for 6+)",
      dietary: [],
      shortDescription: "Twice-baked French-butter croissants filled with roasted almond frangipane.",
      description: "Hand-laminated over three days using cultured butter, filled with fragrant almond cream, brushed with orange-blossom syrup, and baked crisp with flaked almonds.",
      bakerNote: "Crisp in an oven or air fryer at 160°C for 3 minutes before serving.",
      storage: "Best eaten the same day; keep wrapped up to 2 days.",
      ingredients: [
        "Cultured laminated pastry butter",
        "Blanched ground almond frangipane",
        "Flaked toasted almonds",
        "High-protein bread flour & icing sugar"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Almonds)"],
      allergenNote: "Contains whole and ground almonds inside the frangipane filling and topping.",
      variants: [
        { id: "default", label: "Pack of 2", price: 950, note: "Morning tea pair" },
        { id: "pack4", label: "Box of 4", price: 1800, note: "Weekend brunch pack" }
      ]
    },
    {
      id: "loaf-lemon-blueberry",
      name: "Lemon Blueberry Tea Loaf",
      category: "Pastries & Cookies",
      weight: "700 g Whole Loaf",
      price: 1450,
      image: "../images/lemon-blueberry-loaf.svg",
      alt: "Glazed lemon blueberry pound cake loaf studded with berries",
      badge: "Tea Time",
      featured: false,
      rating: 4.7,
      reviewCount: 190,
      prepTime: "Fresh daily batch",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Zesty lemon yoghurt pound cake bursting with blueberries and citrus drizzle.",
      description: "A tender, fine-crumbed loaf baked with fresh lemon zest, Greek-style yoghurt, and plump blueberries, finished with a crisp tangy lemon sugar glaze.",
      bakerNote: "Slices cleanly into 8-10 tea-time pieces; wonderful alongside afternoon chai.",
      storage: "Wrap well at room temperature for 3 days or refrigerate up to 6 days.",
      ingredients: [
        "Fresh lemon zest & pressed lemon juice",
        "Whole blueberries & cultured yoghurt",
        "Unsalted butter & caster sugar",
        "Unbleached pastry flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      allergenNote: "Nut-free loaf; eggless yoghurt version available in size options.",
      variants: [
        { id: "default", label: "700 g Whole Loaf", price: 1450, note: "8-10 slices" },
        { id: "eggless", label: "700 g Loaf (Eggless)", price: 1550, note: "Egg-free yoghurt crumb" }
      ]
    },
    {
      id: "box-choc-chunk-cookies",
      name: "Brown-Butter Chocolate Chunk Cookies",
      category: "Pastries & Cookies",
      weight: "Box of 6",
      price: 1350,
      image: "../images/chocolate-chunk-cookies.svg",
      alt: "Golden brown-butter cookies loaded with melted dark chocolate chunks",
      badge: "Crispy Edge",
      featured: false,
      rating: 4.9,
      reviewCount: 440,
      prepTime: "Baked to order (3 hrs)",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Thick bakery-style cookies with browned butter, chocolate puddles, and sea salt.",
      description: "Chilled 24-hour cookie dough baked golden on the edges and gooey in the centre, generously folded with hand-chopped 54% dark and milk chocolate chunks.",
      bakerNote: "Warm for 8 seconds before biting in for molten chocolate pools.",
      storage: "Airtight jar at room temperature for up to 5 days.",
      ingredients: [
        "Toasted brown butter & muscovado sugar",
        "Hand-chopped dark & milk chocolate chunks",
        "Pure vanilla extract & sea salt flakes",
        "Unbleached flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      allergenNote: "Nut-free cookie batch; chocolate chunks may contain trace soy lecithin.",
      variants: [
        { id: "default", label: "Box of 6", price: 1350, note: "6 chunky 85g cookies" },
        { id: "box12", label: "Box of 12", price: 2550, note: "12 chunky 85g cookies" }
      ]
    },
    {
      id: "cake-hazelnut-praline",
      name: "Roasted Hazelnut Praline Gateau",
      category: "Cakes",
      weight: "1.5 lb (Serves 6-8)",
      price: 3650,
      image: "../images/hazelnut-praline-cake.svg",
      alt: "Roasted hazelnut praline layer cake with chocolate swirl and crunch",
      badge: "Chef Special",
      featured: false,
      rating: 4.9,
      reviewCount: 220,
      prepTime: "24 hrs advance notice",
      dietary: [],
      shortDescription: "Silky gianduja mousse, roasted hazelnut crunch, and moist chocolate-nut sponge.",
      description: "Our elevated celebration cake combining tender hazelnut-cocoa sponge, crunchy caramelized hazelnut feuilletine, and whipped milk-chocolate gianduja cream.",
      bakerNote: "Includes complimentary golden acrylic birthday topper on request.",
      storage: "Keep chilled at 4°C; enjoy within 3 days.",
      ingredients: [
        "Roasted Piedmont-style hazelnuts & praline paste",
        "Belgian milk & dark chocolate",
        "Crisp feuilletine wafer crunch",
        "Fresh dairy whipping cream"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Hazelnuts)"],
      allergenNote: "Contains roasted hazelnuts throughout the sponge, praline crunch, and mousse.",
      variants: [
        { id: "default", label: "1.5 lb (Serves 6-8)", price: 3650, note: "Standard 6-inch gateau" },
        { id: "2.5lb", label: "2.5 lb (Serves 10-14)", price: 5900, note: "8-inch celebration size" }
      ]
    }
  ];

  var CUSTOM_CAKE_OPTIONS = {
    designPresets: [
      { id: "classic-swirl", label: "Classic Buttercream Swirl", note: "Piped rosettes & pearl border" },
      { id: "ganache-drip", label: "Glossy Chocolate Drip", note: "Rich drip with cocoa truffles" },
      { id: "pastel-floral", label: "Pastel Pink Floral", note: "Soft pink icing with blooms" },
      { id: "minimal-ribbon", label: "Minimalist Ribbon Bow", note: "Clean cream finish & bow" }
    ],
    occasions: [
      "Birthday Celebration",
      "Nikkah / Engagement",
      "Anniversary",
      "Baby Shower / Welcoming",
      "Graduation / Achievement",
      "Eid / Family Tea Gathering",
      "Just Because"
    ],
    sizes: [
      { id: "small-1kg", label: "Small (1kg)", basePrice: 1800, servings: "6-8 guests" },
      { id: "medium-1.5kg", label: "Medium (1.5kg)", basePrice: 2600, servings: "10-12 guests" },
      { id: "large-2kg", label: "Large (2kg)", basePrice: 3400, servings: "14-18 guests" },
      { id: "party-3kg", label: "Two-Tier Party (3kg)", basePrice: 5400, servings: "22-26 guests" },
      { id: "grand-4kg", label: "Grand Two-Tier (4kg)", basePrice: 7600, servings: "30-36 guests" }
    ],
    sponges: [
      { id: "chocolate", label: "Chocolate", extraPrice: 0 },
      { id: "vanilla", label: "Vanilla", extraPrice: 0 },
      { id: "strawberry", label: "Strawberry", extraPrice: 200 },
      { id: "red-velvet", label: "Red Velvet", extraPrice: 250 },
      { id: "lotus-biscoff", label: "Lotus Biscoff", extraPrice: 400 },
      { id: "pistachio-rose", label: "Cardamom Pistachio", extraPrice: 550 }
    ],
    fillings: [
      { id: "choc-ganache", label: "Smooth Chocolate Cream", extraPrice: 0 },
      { id: "cream-cheese", label: "Whipped Vanilla Cream Cheese", extraPrice: 200 },
      { id: "strawberry-compote", label: "Fresh Strawberry Compote", extraPrice: 300 },
      { id: "salted-caramel", label: "House Salted Caramel & Crunch", extraPrice: 350 },
      { id: "biscoff-cream", label: "Lotus Biscoff Mascarpone", extraPrice: 450 },
      { id: "hazelnut-praline", label: "Roasted Hazelnut Gianduja", extraPrice: 550 }
    ],
    frostings: [
      { id: "swiss-buttercream", label: "Silky Swiss Meringue Buttercream", extraPrice: 0 },
      { id: "whipped-cream", label: "Light Fresh Dairy Whipped Cream", extraPrice: 0 },
      { id: "fudge-ganache", label: "Glossy Dark Chocolate Ganache", extraPrice: 300 },
      { id: "fondant-finish", label: "Smooth Semi-Fondant Custom Finish", extraPrice: 1000 }
    ],
    dietaryOptions: [
      { id: "standard", label: "Classic Recipe (Contains Eggs & Dairy)", extraPrice: 0 },
      { id: "eggless", label: "100% Eggless Recipe", extraPrice: 350 },
      { id: "reduced-sugar", label: "Lightly Sweetened / Reduced Sugar", extraPrice: 300 }
    ],
    toppings: [
      { id: "fresh-berries", label: "Seasonal Fresh Berries", price: 650 },
      { id: "macarons", label: "4 Handmade Pastel Macarons", price: 750 },
      { id: "gold-leaf", label: "Edible Gold Leaf & Pearls", price: 500 },
      { id: "fresh-florals", label: "Food-Safe Fresh Roses & Baby's Breath", price: 600 },
      { id: "acrylic-topper", label: "Custom Acrylic Cake Topper", price: 450 },
      { id: "choc-drip", label: "Caramel or Chocolate Ganache Drip", price: 350 }
    ],
    deliveryAreas: [
      { id: "pickup-f8", label: "Self-Pickup — F-8/3 Home Kitchen (Free)", fee: 0 },
      { id: "isb-f6-f8", label: "Islamabad Sectors F-6, F-7 & F-8", fee: 200 },
      { id: "isb-f10-f11", label: "Islamabad Sectors F-10 & F-11", fee: 250 },
      { id: "isb-g9-g11", label: "Islamabad Sectors G-9, G-10 & G-11", fee: 250 },
      { id: "isb-e11-d12", label: "Islamabad Sectors E-11 & D-12", fee: 300 },
      { id: "rwp-chaklala", label: "Rawalpindi (Chaklala III & Saddar)", fee: 350 },
      { id: "isb-dha-bahria", label: "DHA Islamabad & Bahria Town", fee: 450 }
    ]
  };

  function getItemById(itemId) {
    for (var i = 0; i < MENU_ITEMS.length; i += 1) {
      if (MENU_ITEMS[i].id === itemId) {
        return MENU_ITEMS[i];
      }
    }
    return null;
  }

  function formatRs(amount) {
    var num = Number(amount);
    if (!Number.isFinite(num)) {
      num = 0;
    }
    return "Rs. " + Math.round(num).toLocaleString("en-PK");
  }

  function formatReviews(count) {
    var num = Number(count) || 0;
    if (num >= 1000) {
      var k = (num / 1000).toFixed(1).replace(/\.0$/, "");
      return k + "k reviews";
    }
    return num + " reviews";
  }

  global.SweetOvenData = {
    CATEGORIES: CATEGORIES,
    DIETARY_FILTERS: DIETARY_FILTERS,
    SORT_OPTIONS: SORT_OPTIONS,
    MENU_ITEMS: MENU_ITEMS,
    CUSTOM_CAKE_OPTIONS: CUSTOM_CAKE_OPTIONS,
    getItemById: getItemById,
    formatRs: formatRs,
    formatReviews: formatReviews
  };
})(window);
