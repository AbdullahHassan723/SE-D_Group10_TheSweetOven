(function (global) {
  "use strict";

  var CATEGORIES = [
    { id: "all", label: "All Bakes" },
    { id: "Signature Cakes", label: "Signature Cakes" },
    { id: "Milk Cakes", label: "Milk Cakes & Tubs" },
    { id: "Cupcakes", label: "Cupcakes" },
    { id: "Brownies & Bars", label: "Brownies & Bars" },
    { id: "Breakfast Pastries", label: "Breakfast Pastries" },
    { id: "Viennoiserie", label: "Viennoiserie" },
    { id: "Cookies & Loaves", label: "Cookies & Loaves" }
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
      id: "cake-belgian-fudge",
      name: "Belgian Chocolate Fudge Cake",
      category: "Signature Cakes",
      weight: "1 lb (Serves 4-6)",
      price: 2850,
      image: "../images/chocolate-fudge-cake.svg",
      alt: "Belgian Chocolate Fudge Cake topped with chocolate ganache",
      badge: "Best Seller",
      featured: true,
      rating: 4.9,
      reviewCount: 48,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["best-seller", "eggless-option", "nut-free"],
      shortDescription: "Moist dark cocoa sponge layered with silky 54% Belgian chocolate ganache.",
      description: "Our signature home-kitchen showstopper. Three tender layers of Dutch-processed cocoa sponge soaked lightly with espresso-kissed syrup and finished in glossy 54% Belgian dark chocolate fudge ganache.",
      bakerNote: "Best served at room temperature for a melt-in-the-mouth fudge texture. Can be warmed for 10 seconds per slice.",
      storage: "Refrigerate for up to 4 days in an airtight cake box.",
      ingredients: [
        "54% Belgian dark couverture chocolate",
        "Dutch-processed cocoa powder",
        "Cultured dairy butter",
        "Farm-fresh eggs (eggless yoghurt base available)",
        "Brown cane sugar & vanilla bean extract"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
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
      featured: true,
      rating: 4.9,
      reviewCount: 62,
      prepTime: "Fresh daily batch",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Ultra-soft vanilla sponge soaked in spiced three-milk blend with warm Biscoff swirl.",
      description: "Fluffy sponge baked in-house and steeped overnight in a three-milk infusion (evaporated milk, condensed milk, and fresh cream), crowned with whipped chantilly, melted Lotus Biscoff spread, and crushed caramelized biscuits.",
      bakerNote: "Keep chilled until serving; spoon straight from the reusable glass-safe tub.",
      storage: "Keep refrigerated at 4°C; enjoy within 3 days.",
      ingredients: [
        "Fresh dairy cream & evaporated milk",
        "Condensed milk & caramelized Biscoff spread",
        "Lotus Biscoff biscuit crumble",
        "Madagascar vanilla essence & sponge flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Soy (in Biscoff)"],
      variants: [
        { id: "default", label: "500 g Family Tub", price: 1650, note: "Serves 3-4" },
        { id: "1kg", label: "1 kg Party Tray", price: 3100, note: "Serves 7-8" }
      ]
    },
    {
      id: "box-cinnamon-rolls",
      name: "Warm Cream-Cheese Cinnamon Rolls",
      category: "Breakfast Pastries",
      weight: "Box of 4",
      price: 1400,
      image: "../images/cinnamon-rolls.svg",
      alt: "Box of four glazed cinnamon rolls with vanilla cream-cheese icing",
      badge: "Morning Batch",
      featured: true,
      rating: 4.8,
      reviewCount: 37,
      prepTime: "Morning & afternoon slots",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Pillow-soft brioche spirals swirled with Ceylon cinnamon butter and tangy glaze.",
      description: "Slow-proofed enriched brioche dough rolled generously with brown sugar and aromatic Ceylon cinnamon, baked until golden and slathered warm with vanilla cream-cheese frosting.",
      bakerNote: "Reheat in a microwave for 15-20 seconds before eating for fresh-out-of-the-oven softness.",
      storage: "Store covered at room temperature for 1 day or refrigerate up to 3 days.",
      ingredients: [
        "Enriched brioche flour & salted butter",
        "Ceylon cinnamon & dark muscovado sugar",
        "Cream cheese & icing sugar glaze",
        "Whole milk & active baker's yeast"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      variants: [
        { id: "default", label: "Box of 4", price: 1400, note: "Classic cream-cheese glaze" },
        { id: "box8", label: "Box of 8", price: 2650, note: "Family brunch box" }
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
      reviewCount: 29,
      prepTime: "Same-day (4 hrs notice)",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Velvety cocoa-buttermilk cupcakes piped high with silky cream-cheese swirls.",
      description: "Tender crimson buttermilk sponge with a subtle cocoa finish, topped with whipped cream-cheese frosting and delicate red velvet crumbs. Ideal for birthdays, tea tables, and gifting.",
      bakerNote: "Available with complimentary ribbon box wrapping on request in order notes.",
      storage: "Refrigerate and bring to cool room temperature 15 minutes before serving.",
      ingredients: [
        "Fresh buttermilk & unsweetened cocoa",
        "Cream cheese & unsalted butter",
        "Caster sugar & apple cider vinegar",
        "Pure vanilla extract"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      variants: [
        { id: "default", label: "Box of 6", price: 1800, note: "Standard gift box" },
        { id: "box12", label: "Box of 12", price: 3400, note: "Party dozen" },
        { id: "eggless6", label: "Box of 6 (Eggless)", price: 1950, note: "Egg-free recipe" }
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
      reviewCount: 41,
      prepTime: "Fresh daily batch",
      dietary: ["best-seller"],
      shortDescription: "Crinkle-top dark chocolate fudge brownies ribboned with sea-salted caramel and walnuts.",
      description: "Dense, intensely chocolatey squares baked with browned butter and 70% dark chocolate, studded with toasted Kashmiri walnuts and finished with house-made salted caramel drizzle.",
      bakerNote: "Pair a warmed square with vanilla ice cream for an instant restaurant-style dessert.",
      storage: "Airtight container at room temperature for 4 days or chilled for 7 days.",
      ingredients: [
        "70% dark chocolate & browned butter",
        "Toasted Kashmiri walnuts",
        "House-cooked salted caramel",
        "Flaky sea salt & cocoa"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Walnuts)"],
      variants: [
        { id: "default", label: "Box of 6", price: 1550, note: "6 generous fudge squares" },
        { id: "box12", label: "Box of 12", price: 2950, note: "12 squares sharing box" },
        { id: "nutfree6", label: "Box of 6 (No Walnuts)", price: 1500, note: "Pure salted caramel fudge" }
      ]
    },
    {
      id: "pack-almond-croissants",
      name: "Butter Almond Croissants",
      category: "Viennoiserie",
      weight: "Pack of 2",
      price: 950,
      image: "../images/almond-croissants.svg",
      alt: "Flaky golden almond croissants dusted with toasted almonds",
      badge: "Artisan Bake",
      featured: false,
      rating: 4.7,
      reviewCount: 24,
      prepTime: "Morning batch (24 hrs for 6+)",
      dietary: [],
      shortDescription: "Twice-baked laminated French-butter croissants filled with roasted almond frangipane.",
      description: "Hand-laminated over three days using cultured butter, filled with fragrant almond cream, brushed with orange-blossom syrup, and baked crisp with flaked almonds and snow sugar.",
      bakerNote: "Crisp up in an oven or air fryer at 160°C for 3 minutes before serving.",
      storage: "Best eaten the same day; keep wrapped up to 2 days.",
      ingredients: [
        "Cultured laminated pastry butter",
        "Blanched ground almond frangipane",
        "Flaked toasted almonds",
        "High-protein bread flour & icing sugar"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Almonds)"],
      variants: [
        { id: "default", label: "Pack of 2", price: 950, note: "Morning tea pair" },
        { id: "pack4", label: "Box of 4", price: 1800, note: "Weekend brunch pack" }
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
      featured: true,
      rating: 5.0,
      reviewCount: 33,
      prepTime: "Same-day (5 hrs notice)",
      dietary: ["best-seller"],
      shortDescription: "Cardamom-infused milk sponge layered with Iranian pistachio cream and golden toasted kunafa.",
      description: "Inspired by Middle Eastern patisserie: airy sponge soaked in cardamom-rose milk, topped with velvety roasted pistachio praline and buttery toasted kataifi pastry for irresistible crunch.",
      bakerNote: "We toast the kunafa right before dispatch so every spoonful keeps its signature crunch.",
      storage: "Keep refrigerated; consume within 48 hours for peak crunch.",
      ingredients: [
        "Roasted pistachio paste & crushed pistachios",
        "Toasted buttered kataifi (kunafa) strands",
        "Three-milk cardamom infusion",
        "Whipped fresh dairy cream"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs", "Tree Nuts (Pistachios)"],
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
      reviewCount: 27,
      prepTime: "Chilled overnight",
      dietary: ["nut-free"],
      shortDescription: "House-baked savoiardi fingers dipped in dark roast espresso and layered with mascarpone cream.",
      description: "Our alcohol-free artisan tiramisu pairs freshly pulled Arabica espresso with whipped cream-cheese mascarpone mousse and bitter Dutch cocoa dusting.",
      bakerNote: "Zero alcohol, zero gelatin — made purely with fresh dairy cream and brewed coffee.",
      storage: "Keep refrigerated; tastes even better on day two. Enjoy within 3 days.",
      ingredients: [
        "Freshly brewed Arabica espresso",
        "Mascarpone-style whipped cream",
        "House-baked ladyfinger sponge",
        "Dark Dutch cocoa powder"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      variants: [
        { id: "default", label: "450 g Tub", price: 1750, note: "Serves 3-4" },
        { id: "900g", label: "900 g Dinner Party Tray", price: 3350, note: "Serves 6-8" }
      ]
    },
    {
      id: "loaf-lemon-blueberry",
      name: "Lemon Blueberry Tea Loaf",
      category: "Cookies & Loaves",
      weight: "700 g Whole Loaf",
      price: 1450,
      image: "../images/lemon-blueberry-loaf.svg",
      alt: "Glazed lemon blueberry pound cake loaf studded with berries",
      badge: "Tea Time",
      featured: false,
      rating: 4.7,
      reviewCount: 19,
      prepTime: "Fresh daily batch",
      dietary: ["eggless-option", "nut-free"],
      shortDescription: "Bright zesty lemon yoghurt pound cake bursting with blueberries and citrus drizzle.",
      description: "A tender, fine-crumbed loaf baked with fresh lemon zest, Greek-style yoghurt, and plump blueberries, finished with a crisp tangy lemon sugar glaze.",
      bakerNote: "Slices cleanly into 8-10 tea-time pieces; wonderful alongside afternoon chai or Earl Grey.",
      storage: "Wrap well at room temperature for 3 days or refrigerate up to 6 days.",
      ingredients: [
        "Fresh lemon zest & pressed lemon juice",
        "Whole blueberries & cultured yoghurt",
        "Unsalted butter & caster sugar",
        "Unbleached pastry flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs (unless Eggless selected)"],
      variants: [
        { id: "default", label: "700 g Whole Loaf", price: 1450, note: "8-10 slices" },
        { id: "eggless", label: "700 g Loaf (Eggless)", price: 1550, note: "Egg-free yoghurt crumb" }
      ]
    },
    {
      id: "box-choc-chunk-cookies",
      name: "Brown-Butter Chocolate Chunk Cookies",
      category: "Cookies & Loaves",
      weight: "Box of 6",
      price: 1350,
      image: "../images/chocolate-chunk-cookies.svg",
      alt: "Golden brown-butter cookies loaded with melted dark chocolate chunks",
      badge: "Crispy Edge",
      featured: false,
      rating: 4.9,
      reviewCount: 44,
      prepTime: "Baked to order (3 hrs)",
      dietary: ["best-seller", "nut-free"],
      shortDescription: "Thick bakery-style cookies with caramelized brown butter, dark chocolate puddles, and sea salt.",
      description: "Chilled 24-hour cookie dough baked golden on the edges and gooey in the centre, generously folded with hand-chopped 54% and milk chocolate chunks.",
      bakerNote: "Warm for 8 seconds before biting in for molten chocolate pools.",
      storage: "Airtight jar at room temperature for up to 5 days.",
      ingredients: [
        "Toasted brown butter & muscovado sugar",
        "Hand-chopped dark & milk chocolate chunks",
        "Pure vanilla extract & sea salt flakes",
        "Unbleached flour"
      ],
      allergens: ["Dairy", "Wheat / Gluten", "Eggs"],
      variants: [
        { id: "default", label: "Box of 6", price: 1350, note: "6 chunky 85g cookies" },
        { id: "box12", label: "Box of 12", price: 2550, note: "12 chunky 85g cookies" }
      ]
    },
    {
      id: "cake-hazelnut-praline",
      name: "Roasted Hazelnut Praline Gateau",
      category: "Signature Cakes",
      weight: "1.5 lb (Serves 6-8)",
      price: 3650,
      image: "../images/hazelnut-praline-cake.svg",
      alt: "Roasted hazelnut praline layer cake with chocolate swirl and crunch",
      badge: "Chef Special",
      featured: true,
      rating: 4.9,
      reviewCount: 22,
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
      variants: [
        { id: "default", label: "1.5 lb (Serves 6-8)", price: 3650, note: "Standard 6-inch gateau" },
        { id: "2.5lb", label: "2.5 lb (Serves 10-14)", price: 5900, note: "8-inch celebration size" }
      ]
    }
  ];

  var CUSTOM_CAKE_OPTIONS = {
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
      { id: "1lb", label: "1 lb Single Tier (6\" — Serves 4-6)", basePrice: 3200, servings: "4-6 guests" },
      { id: "2lb", label: "2 lb Single Tier (7\" — Serves 8-10)", basePrice: 5800, servings: "8-10 guests" },
      { id: "3lb", label: "3 lb Tall Tier (8\" — Serves 14-18)", basePrice: 8200, servings: "14-18 guests" },
      { id: "4lb-2tier", label: "4 lb Two-Tier Celebration (Serves 20-25)", basePrice: 11800, servings: "20-25 guests" },
      { id: "6lb-2tier", label: "6 lb Grand Two-Tier (Serves 30-38)", basePrice: 16800, servings: "30-38 guests" }
    ],
    sponges: [
      { id: "belgian-choc", label: "Belgian Dark Chocolate", extraPrice: 0 },
      { id: "vanilla-bean", label: "Madagascar Vanilla Bean", extraPrice: 0 },
      { id: "red-velvet", label: "Classic Red Velvet", extraPrice: 250 },
      { id: "lemon-zest", label: "Zesty Lemon Sponge", extraPrice: 200 },
      { id: "pistachio-rose", label: "Cardamom Pistachio Sponge", extraPrice: 550 }
    ],
    fillings: [
      { id: "choc-ganache", label: "54% Chocolate Fudge Ganache", extraPrice: 0 },
      { id: "cream-cheese", label: "Whipped Vanilla Cream Cheese", extraPrice: 200 },
      { id: "salted-caramel", label: "House Salted Caramel & Crunch", extraPrice: 350 },
      { id: "biscoff-cream", label: "Lotus Biscoff Mascarpone", extraPrice: 450 },
      { id: "strawberry-compote", label: "Fresh Strawberry Compote", extraPrice: 400 },
      { id: "hazelnut-praline", label: "Roasted Hazelnut Gianduja", extraPrice: 550 }
    ],
    frostings: [
      { id: "swiss-buttercream", label: "Silky Swiss Meringue Buttercream", extraPrice: 0 },
      { id: "fudge-ganache", label: "Glossy Dark Chocolate Ganache", extraPrice: 300 },
      { id: "whipped-cream", label: "Light Fresh Dairy Whipped Cream", extraPrice: 0 },
      { id: "fondant-finish", label: "Smooth Semi-Fondant Custom Finish", extraPrice: 1200 }
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

  global.SweetOvenData = {
    CATEGORIES: CATEGORIES,
    DIETARY_FILTERS: DIETARY_FILTERS,
    SORT_OPTIONS: SORT_OPTIONS,
    MENU_ITEMS: MENU_ITEMS,
    CUSTOM_CAKE_OPTIONS: CUSTOM_CAKE_OPTIONS,
    getItemById: getItemById
  };
})(window);
