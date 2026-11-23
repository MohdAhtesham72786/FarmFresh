"""Marketplace catalog used by seed. Keep the original 10 featured products first."""

from app.models.product import ProductStatus

IMG = {
    "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    "strawberry": "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&w=800&q=80",
    "eggs": "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=800&q=80",
    "honey": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
    "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    "carrot": "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80",
    "blueberry": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
    "milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    "bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    "avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    "produce": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    "farm": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
    "fruit": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
    "apple": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=800&q=80",
    "cheese": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
    "dairy": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    "broccoli": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80",
    "pepper": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    "olive": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "cherry": "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80",
    "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    "pineapple": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
}

LANDING_PRODUCTS = [
    ("Organic Heirloom Tomatoes", IMG["tomato"]),
    ("Fresh Strawberries", IMG["strawberry"]),
    ("Farm Eggs (Dozen)", IMG["eggs"]),
    ("Raw Wildflower Honey", IMG["honey"]),
    ("Rainbow Carrots", IMG["carrot"]),
    ("Blueberry Pint", IMG["blueberry"]),
    ("Whole Milk (1L)", IMG["milk"]),
    ("Sourdough Loaf", IMG["bread"]),
    ("Hass Avocados (3 pack)", IMG["avocado"]),
    ("Honeycrisp Apples", IMG["apple"]),
    ("Sharp Cheddar Wedge", IMG["cheese"]),
    ("Extra Virgin Olive Oil", IMG["olive"]),
    ("Broccoli Crowns", IMG["broccoli"]),
    ("Red Bell Peppers", IMG["pepper"]),
    ("Bing Cherries", IMG["cherry"]),
    ("Navel Oranges", IMG["orange"]),
    ("Cauliflower Head", IMG["cauliflower"]),
    ("Cavendish Bananas", IMG["banana"]),
    ("Yukon Gold Potatoes", IMG["potato"]),
    ("Gold Pineapple", IMG["pineapple"]),
]

FARMERS = {
    "Vegetables": ["Green Valley Farms", "Riverbend Organics", "Hilltop Harvest", "Coastal Fields"],
    "Fruits": ["Berry Brook Orchard", "Sunset Grove", "Cedar Creek Farm", "Hilltop Harvest"],
    "Dairy & Eggs": ["Sunny Side Poultry", "Maple Ridge Dairy", "Meadow Bee Co-op"],
    "Pantry": ["Meadow Bee Co-op", "Cedar Creek Farm", "Riverbend Organics"],
}

FEATURED_PRODUCTS = [
    {
        "name": "Organic Heirloom Tomatoes",
        "category": "Vegetables",
        "farmer_name": "Green Valley Farms",
        "description": "Vine-ripened organic tomatoes, perfect for salads and sauces.",
        "price": "4.99",
        "available_quantity": 120,
        "image_url": IMG["tomato"],
    },
    {
        "name": "Fresh Strawberries",
        "category": "Fruits",
        "farmer_name": "Berry Brook Orchard",
        "description": "Sweet, hand-picked strawberries from local fields.",
        "price": "6.50",
        "available_quantity": 80,
        "image_url": IMG["strawberry"],
    },
    {
        "name": "Farm Eggs (Dozen)",
        "category": "Dairy & Eggs",
        "farmer_name": "Sunny Side Poultry",
        "description": "Free-range brown eggs, collected daily.",
        "price": "5.25",
        "available_quantity": 50,
        "image_url": IMG["eggs"],
    },
    {
        "name": "Raw Wildflower Honey",
        "category": "Pantry",
        "farmer_name": "Meadow Bee Co-op",
        "description": "Unfiltered honey from regional wildflowers.",
        "price": "12.00",
        "available_quantity": 35,
        "image_url": IMG["honey"],
    },
    {
        "name": "Baby Spinach Bundle",
        "category": "Vegetables",
        "farmer_name": "Green Valley Farms",
        "description": "Tender baby spinach, washed and ready to cook.",
        "price": "3.75",
        "available_quantity": 0,
        "image_url": IMG["spinach"],
        "status": ProductStatus.INACTIVE,
    },
    {
        "name": "Rainbow Carrots",
        "category": "Vegetables",
        "farmer_name": "Green Valley Farms",
        "description": "Colorful sweet carrots harvested at peak crunch.",
        "price": "3.49",
        "available_quantity": 90,
        "image_url": IMG["carrot"],
    },
    {
        "name": "Blueberry Pint",
        "category": "Fruits",
        "farmer_name": "Berry Brook Orchard",
        "description": "Plump blueberries, packed the same morning they were picked.",
        "price": "7.25",
        "available_quantity": 40,
        "image_url": IMG["blueberry"],
    },
    {
        "name": "Whole Milk (1L)",
        "category": "Dairy & Eggs",
        "farmer_name": "Sunny Side Poultry",
        "description": "Creamy farm-fresh whole milk from grass-fed cows.",
        "price": "4.10",
        "available_quantity": 60,
        "image_url": IMG["milk"],
    },
    {
        "name": "Sourdough Loaf",
        "category": "Pantry",
        "farmer_name": "Meadow Bee Co-op",
        "description": "Naturally leavened sourdough baked in a wood-fired oven.",
        "price": "8.00",
        "available_quantity": 18,
        "image_url": IMG["bread"],
    },
    {
        "name": "Hass Avocados (3 pack)",
        "category": "Fruits",
        "farmer_name": "Berry Brook Orchard",
        "description": "Ripe and ready Hass avocados for toast, salads, and bowls.",
        "price": "5.99",
        "available_quantity": 45,
        "image_url": IMG["avocado"],
    },
]

# name|category|description|price|qty|image_key
_EXTRA = """
Cherry Tomatoes|Vegetables|Sweet bite-size tomatoes for snacking and salads.|4.25|96|tomato
Roma Tomatoes|Vegetables|Meaty tomatoes ideal for sauces and roasting.|3.99|110|tomato
Beefsteak Tomatoes|Vegetables|Large slicing tomatoes with rich summer flavor.|5.10|64|tomato
Grape Tomatoes|Vegetables|Firm, candy-sweet tomatoes packed by the pint.|4.40|88|tomato
English Cucumbers|Vegetables|Crisp seedless cucumbers, thin-skinned and refreshing.|2.75|130|produce
Garden Cucumbers|Vegetables|Classic farm cucumbers for salads and pickling.|2.25|140|farm
Pickling Cucumbers|Vegetables|Small firm cucumbers grown for homemade pickles.|3.10|75|farm
Red Bell Peppers|Vegetables|Sweet red peppers harvested at full color.|3.80|90|produce
Yellow Bell Peppers|Vegetables|Sunny yellow peppers with a mild, juicy bite.|3.80|82|produce
Green Bell Peppers|Vegetables|Crunchy green peppers for stuffing and stir-fries.|2.95|100|farm
Orange Bell Peppers|Vegetables|Bright orange peppers with extra natural sweetness.|3.85|70|produce
Jalapeño Peppers|Vegetables|Fresh green jalapeños with lively heat.|2.40|120|farm
Poblano Peppers|Vegetables|Mild smoky peppers perfect for roasting.|3.20|55|produce
Shishito Peppers|Vegetables|Blister-ready shishitos, mostly mild with a surprise.|4.60|48|produce
Zucchini|Vegetables|Tender summer zucchini picked young and glossy.|2.80|150|farm
Yellow Squash|Vegetables|Buttery yellow squash for grilling and baking.|2.80|125|farm
Butternut Squash|Vegetables|Sweet winter squash with a velvety texture.|4.50|60|produce
Acorn Squash|Vegetables|Nutty acorn squash, ideal for roasting halves.|3.90|52|produce
Spaghetti Squash|Vegetables|Mild squash that shreds into pasta-like strands.|4.20|44|produce
Sugar Pie Pumpkin|Vegetables|Compact pumpkins grown for pies and roasting.|5.75|36|farm
Broccoli Crowns|Vegetables|Tight green broccoli crowns, farm-fresh and crisp.|3.30|95|produce
Broccolini|Vegetables|Tender-stem broccolini with a sweet, delicate flavor.|4.15|58|produce
Cauliflower Head|Vegetables|Snowy cauliflower, dense and freshly cut.|3.60|80|produce
Romanesco|Vegetables|Chartreuse romanesco with a nutty crunch.|5.40|28|produce
Brussels Sprouts|Vegetables|Firm sprouts on the stalk, sweet after a frost.|4.05|72|farm
Curly Kale Bunch|Vegetables|Hearty curly kale, washed and bunched.|3.15|90|spinach
Lacinato Kale|Vegetables|Dark dinosaur kale with a deeper, earthy taste.|3.35|78|spinach
Swiss Chard|Vegetables|Rainbow chard with tender leaves and colorful stems.|3.45|66|spinach
Collard Greens|Vegetables|Classic collards for slow cooking and braising.|2.95|70|spinach
Wild Arugula|Vegetables|Peppery arugula with a bright, lemony finish.|3.85|84|spinach
Spring Mix|Vegetables|Tender baby lettuces and greens, ready to eat.|4.50|100|spinach
Romaine Hearts|Vegetables|Crisp romaine hearts, trimmed and boxed.|3.20|110|produce
Butter Lettuce|Vegetables|Soft butterhead lettuce with sweet inner leaves.|3.05|92|produce
Iceberg Lettuce|Vegetables|Classic crunchy iceberg, harvested cool-morning.|2.40|88|produce
Radicchio|Vegetables|Bitter-sweet radicchio for salads and grilling.|3.70|40|produce
Watercress|Vegetables|Peppery watercress bunches from spring beds.|3.95|34|spinach
Mature Spinach Bunch|Vegetables|Full-leaf spinach for sautés and soups.|2.85|105|spinach
Sunflower Microgreens|Vegetables|Crunchy sunflower shoots packed with flavor.|5.50|42|spinach
Nantes Carrots|Vegetables|Sweet cylindrical carrots with almost no core.|3.15|118|carrot
Baby Carrots|Vegetables|True baby carrots, tender enough to eat whole.|3.60|86|carrot
Parsnips|Vegetables|Creamy parsnips with a honeyed, earthy sweetness.|3.40|50|carrot
Red Beets|Vegetables|Earthy red beets, bunched with greens attached.|3.25|68|produce
Golden Beets|Vegetables|Mild golden beets that will not bleed in salads.|3.55|46|produce
Breakfast Radishes|Vegetables|Peppery breakfast radishes, crisp and pretty.|2.65|90|farm
Hakurei Turnips|Vegetables|Salad turnips that are sweet enough to eat raw.|3.10|54|farm
Rutabaga|Vegetables|Hearty rutabaga for roasting and winter mash.|2.90|38|produce
Red Potatoes|Vegetables|Waxy red potatoes that hold their shape.|4.20|140|produce
Yukon Gold Potatoes|Vegetables|Buttery gold potatoes for mashing and roasting.|4.45|132|produce
Fingerling Potatoes|Vegetables|Petite fingerlings with a creamy, nutty center.|5.10|64|produce
Garnet Sweet Potatoes|Vegetables|Orange-fleshed sweets, rich and caramel-like.|4.80|76|produce
Russet Potatoes|Vegetables|Classic baking russets from sandy loam soil.|3.90|160|produce
Yellow Onions|Vegetables|All-purpose yellow onions with a mellow bite.|2.20|180|farm
Red Onions|Vegetables|Crisp red onions for salads and pickling.|2.45|150|farm
Shallots|Vegetables|Delicate shallots with a hint of garlic.|4.90|48|produce
Garlic Bulbs|Vegetables|Pungent hardneck garlic, cured on the farm.|3.75|95|produce
Leeks|Vegetables|Mild leeks, cleaned and ready for soup.|3.50|58|farm
Green Onions|Vegetables|Fresh scallions with bright white bulbs.|1.95|170|farm
Fennel Bulbs|Vegetables|Anise-scented fennel, crunchy and aromatic.|3.65|44|produce
Celery Hearts|Vegetables|Crisp celery hearts cut the same morning.|2.85|102|produce
Asparagus Spears|Vegetables|Pencil asparagus, tender from tip to stem.|6.40|50|farm
Globe Artichokes|Vegetables|Fresh artichokes with tight, meaty leaves.|4.75|32|produce
Italian Eggplant|Vegetables|Glossy purple eggplant for grilling and caponata.|3.55|70|produce
Japanese Eggplant|Vegetables|Slender eggplant that cooks quickly and sweetly.|3.80|52|produce
Sweet Corn (4 ears)|Vegetables|Just-picked sweet corn, still in the husk.|4.00|88|farm
Okra Pods|Vegetables|Tender okra pods, perfect for frying or stews.|3.35|40|farm
Sugar Snap Peas|Vegetables|Crunchy snap peas you can eat pod and all.|5.20|62|farm
Snow Peas|Vegetables|Flat snow peas for quick stir-fries.|4.85|58|farm
Green Beans|Vegetables|Stringless green beans, snapped and fresh.|3.45|120|farm
Wax Beans|Vegetables|Buttery yellow wax beans with a gentle snap.|3.55|64|farm
Green Cabbage|Vegetables|Dense green cabbage heads for slaw and braises.|2.70|78|produce
Red Cabbage|Vegetables|Vibrant red cabbage with a peppery crunch.|2.95|66|produce
Napa Cabbage|Vegetables|Tender napa cabbage for kimchi and salads.|3.25|48|produce
Bok Choy|Vegetables|Crisp bok choy with juicy white stems.|3.15|72|produce
Cremini Mushrooms|Vegetables|Earthy cremini mushrooms, farm-packed.|4.60|80|produce
Shiitake Mushrooms|Vegetables|Meaty shiitakes with a deep forest aroma.|6.80|36|produce
Oyster Mushrooms|Vegetables|Delicate oyster mushrooms, harvested daily.|5.90|30|produce
Portobello Caps|Vegetables|Large portobellos ready for the grill.|5.40|42|produce
Ginger Root|Vegetables|Knobby young ginger with thin, fragrant skin.|4.25|55|produce
Fresh Turmeric|Vegetables|Golden turmeric rhizomes, earthy and bright.|5.10|28|produce
Horseradish Root|Vegetables|Pungent horseradish for sauces and roasting.|3.85|22|produce
Sweet Basil|Vegetables|Fragrant Genovese basil bunches.|3.40|90|spinach
Cilantro Bunch|Vegetables|Bright cilantro, bunched with tender stems.|1.85|140|spinach
Flat-Leaf Parsley|Vegetables|Classic parsley for finishing almost anything.|1.75|150|spinach
Spearmint Bunch|Vegetables|Cool spearmint for tea, salads, and lamb.|2.40|70|spinach
Rosemary Sprigs|Vegetables|Woody rosemary, intensely aromatic.|2.60|64|spinach
Thyme Bundle|Vegetables|Tiny-leaf thyme for roasting and stocks.|2.50|68|spinach
Fresh Dill|Vegetables|Feathery dill with a clean anise note.|2.35|74|spinach
Oregano Bunch|Vegetables|Peppery oregano, excellent dried or fresh.|2.20|50|spinach
Garden Sage|Vegetables|Velvety sage leaves for brown butter and stuffing.|2.55|46|spinach
Garlic Chives|Vegetables|Mild garlic chives with a delicate onion finish.|2.15|80|spinach
Honeycrisp Apples|Fruits|Snap-crisp Honeycrisps with honeyed juice.|4.80|100|apple
Gala Apples|Fruits|Everyday Gala apples, sweet and aromatic.|3.40|130|apple
Granny Smith Apples|Fruits|Tart green apples that hold up in baking.|3.25|110|apple
Fuji Apples|Fruits|Dense Fuji apples with lasting sweetness.|3.55|118|apple
Pink Lady Apples|Fruits|Pink Ladies with a sweet-tart, sparkling bite.|4.10|90|apple
Bartlett Pears|Fruits|Blush Bartlett pears, fragrant when ripe.|3.90|70|fruit
Bosc Pears|Fruits|Cinnamon-skinned Bosc pears, firm and honeyed.|4.05|62|fruit
Anjou Pears|Fruits|Juicy Anjou pears for snacking and poaching.|3.85|74|fruit
Tree-Ripened Peaches|Fruits|Freestone peaches picked at peak perfume.|5.60|55|fruit
White Nectarines|Fruits|Smooth white nectarines, floral and juicy.|5.40|48|fruit
Santa Rosa Plums|Fruits|Tart-skin plums with amber, jammy flesh.|4.70|60|fruit
Blenheim Apricots|Fruits|Classic apricots with concentrated sunshine flavor.|5.90|36|fruit
Rainier Cherries|Fruits|Blush Rainier cherries, extra sweet and delicate.|8.50|28|fruit
Bing Cherries|Fruits|Dark Bing cherries, plump and wine-like.|7.80|40|fruit
Navel Oranges|Fruits|Easy-peel navels, bursting with juice.|3.20|140|fruit
Satsuma Mandarins|Fruits|Kid-friendly mandarins with zipper skin.|4.15|96|fruit
Ruby Grapefruit|Fruits|Blush grapefruit, sweet with a gentle bitter edge.|3.45|80|fruit
Meyer Lemons|Fruits|Thin-skinned Meyer lemons, floral and less acidic.|4.60|72|fruit
Key Limes|Fruits|Aromatic Key limes for pies and sparkling drinks.|3.90|64|fruit
Blood Oranges|Fruits|Ruby-fleshed blood oranges with berry notes.|4.85|50|fruit
Red Table Grapes|Fruits|Crisp red grapes, seedless and chilled.|5.25|88|fruit
Green Grapes|Fruits|Snappy green grapes packed in family punnets.|5.10|92|fruit
Cotton Candy Grapes|Fruits|Novelty grapes with a spun-sugar aroma.|6.75|34|fruit
Seeded Watermelon|Fruits|Picnic watermelons, deep red and dripping sweet.|7.50|22|fruit
Cantaloupe|Fruits|Musky cantaloupes harvested at full slip.|4.95|40|fruit
Honeydew Melon|Fruits|Pale honeydew with a cooling, floral sweetness.|4.70|38|fruit
Cavendish Bananas|Fruits|Ripe bananas for breakfast and baking.|1.80|200|fruit
Ripe Plantains|Fruits|Spotting plantains ready to fry or mash.|2.40|70|fruit
Ataulfo Mangoes|Fruits|Buttery Ataulfo mangoes, fiber-free and tropical.|3.60|58|fruit
Gold Pineapple|Fruits|Extra-sweet pineapple, cored-ready and fragrant.|5.80|30|fruit
Green Kiwifruit|Fruits|Fuzzy kiwis with bright emerald flesh.|3.15|84|fruit
Maradol Papaya|Fruits|Sunrise papaya with silky, tropical pulp.|4.40|26|fruit
Passion Fruit|Fruits|Wrinkled passion fruit, intensely aromatic.|6.20|24|fruit
Wonderful Pomegranates|Fruits|Ruby pomegranates packed with juicy arils.|4.90|42|fruit
Black Mission Figs|Fruits|Jammy figs with honeyed centers.|7.10|32|fruit
Medjool Dates|Fruits|Soft Medjool dates, caramel-sweet and plump.|8.40|46|fruit
Fresh Cranberries|Fruits|Tart cranberries for sauce, baking, and juice.|3.80|54|blueberry
Red Currants|Fruits|Jewel-like currants with a sparkling acidity.|6.50|20|blueberry
Young Coconuts|Fruits|Chilled coconuts for water and fresh meat.|3.95|28|fruit
Golden Raspberries|Fruits|Delicate golden raspberries, floral and sweet.|6.90|38|strawberry
Red Raspberries|Fruits|Classic red raspberries, fragile and fragrant.|6.40|52|strawberry
Blackberries|Fruits|Inky blackberries with a wine-dark sweetness.|5.85|60|blueberry
Gooseberries|Fruits|Tart gooseberries for pies and preserves.|5.20|24|fruit
Concord Grapes|Fruits|Slip-skin Concords with classic grape-jelly flavor.|5.55|44|fruit
Persimmons|Fruits|Fuyu persimmons, crisp and honeyed.|4.35|36|fruit
Starfruit|Fruits|Sliced starfruit, tart and tropical.|3.75|22|fruit
Guava|Fruits|Aromatic pink guava with floral perfume.|3.50|30|fruit
Lychee Pint|Fruits|Peel-and-eat lychees, floral and juicy.|7.20|18|fruit
Dragon Fruit|Fruits|Magenta dragon fruit with tiny crunchy seeds.|6.10|20|fruit
Clementines (3 lb)|Fruits|Seedless clementines, easy to share.|6.80|48|fruit
Large Brown Eggs (Dozen)|Dairy & Eggs|Extra-large brown eggs from pasture hens.|5.75|70|eggs
Duck Eggs (Half dozen)|Dairy & Eggs|Rich duck eggs with sunset yolks.|7.40|24|eggs
Quail Eggs (Dozen)|Dairy & Eggs|Petite quail eggs, delicate and speckled.|6.10|30|eggs
2% Milk (1L)|Dairy & Eggs|Everyday 2% milk from grass-fed cows.|3.85|90|milk
Skim Milk (1L)|Dairy & Eggs|Light skim milk, cold-chain packed.|3.55|80|milk
Chocolate Milk (1L)|Dairy & Eggs|Farmstead chocolate milk, lightly sweetened.|4.25|55|milk
Goat Milk (1L)|Dairy & Eggs|Gentle goat milk with a clean finish.|5.60|32|milk
Heavy Cream (473ml)|Dairy & Eggs|High-fat cream for whipping and sauces.|4.80|48|dairy
Half & Half (473ml)|Dairy & Eggs|Balanced half-and-half for coffee and cooking.|3.40|66|dairy
Cultured Buttermilk|Dairy & Eggs|Tangy buttermilk for biscuits and brines.|3.20|50|dairy
Plain Greek Yogurt|Dairy & Eggs|Thick strained yogurt, unsweetened.|4.50|74|dairy
Vanilla Yogurt|Dairy & Eggs|Creamy vanilla yogurt from whole milk.|4.15|68|dairy
Honey Yogurt Cup|Dairy & Eggs|Whole-milk yogurt swirled with farm honey.|3.60|80|dairy
Salted Butter (250g)|Dairy & Eggs|Cultured salted butter, slow-churned.|5.90|60|dairy
Unsalted Butter (250g)|Dairy & Eggs|Sweet cream unsalted butter for baking.|5.70|62|dairy
Brown Butter Sticks|Dairy & Eggs|Toasted cultured butter with nutty depth.|6.40|28|dairy
Farmstead Ghee|Dairy & Eggs|Clarified ghee with a long pantry life.|9.20|22|dairy
Sharp Cheddar Wedge|Dairy & Eggs|Aged cheddar with a crystalline crunch.|7.80|40|cheese
Smoked Gouda|Dairy & Eggs|Creamy gouda with a gentle wood-smoke.|8.10|34|cheese
Fresh Mozzarella|Dairy & Eggs|Milky mozzarella packed in brine.|6.50|46|cheese
Feta Crumbles|Dairy & Eggs|Tangy sheep-milk feta, ready to sprinkle.|5.40|52|cheese
Goat Cheese Log|Dairy & Eggs|Soft chèvre with a clean, lemony tang.|6.90|38|cheese
Cottage Cheese|Dairy & Eggs|Small-curd cottage cheese, high protein.|3.95|70|dairy
Whole Milk Ricotta|Dairy & Eggs|Fluffy ricotta drained the same day.|5.25|44|dairy
Parmesan Wedge|Dairy & Eggs|Nutty aged parmesan for shaving and grating.|9.80|26|cheese
Sour Cream|Dairy & Eggs|Rich sour cream for baking and toppings.|3.30|78|dairy
Cream Cheese|Dairy & Eggs|Spreadable cream cheese, cultured overnight.|3.85|64|dairy
Kefir (1L)|Dairy & Eggs|Drinkable kefir with live cultures.|4.70|42|milk
Butter Milk Kefir|Dairy & Eggs|Tangy cultured kefir, lightly effervescent.|4.90|30|milk
Mascarpone|Dairy & Eggs|Silk-smooth mascarpone for desserts.|7.20|24|dairy
Halloumi|Dairy & Eggs|Grillable halloumi that squeaks when sliced.|8.40|20|cheese
Camembert Wheel|Dairy & Eggs|Bloomy-rind camembert, ripe and spoonable.|9.50|16|cheese
Blue Cheese Wedge|Dairy & Eggs|Bold blue with a creamy, salty finish.|8.75|18|cheese
String Cheese Pack|Dairy & Eggs|Kid-friendly mozzarella sticks from farm milk.|4.20|90|cheese
Egg Whites Carton|Dairy & Eggs|Pasteurized whites for omelets and baking.|4.35|40|eggs
Pasture Yolks (Pint)|Dairy & Eggs|Liquid yolks from pasture-raised eggs.|6.80|22|eggs
Clover Honey|Pantry|Mild clover honey with a floral finish.|11.00|40|honey
Orange Blossom Honey|Pantry|Citrus-scented honey from spring blossoms.|12.50|28|honey
Cut Comb Honey|Pantry|Chewy honeycomb packed in its own wax.|14.80|18|honey
Grade A Maple Syrup|Pantry|Dark maple syrup boiled in a wood-fired evaporator.|16.00|32|honey
Sorghum Syrup|Pantry|Old-fashioned sorghum with molasses depth.|9.40|20|honey
Extra Virgin Olive Oil|Pantry|Peppery first-press olive oil in a dark bottle.|14.50|36|produce
Sunflower Oil|Pantry|Neutral cold-pressed sunflower oil.|8.20|44|produce
Apple Cider Vinegar|Pantry|Raw cider vinegar with the mother.|6.10|58|apple
Aged Balsamic|Pantry|Syrupy balsamic for finishing salads and fruit.|11.80|26|produce
Rolled Oats|Pantry|Thick rolled oats from regional mills.|4.40|90|bread
Steel-Cut Oats|Pantry|Hearty steel-cut oats with a nutty chew.|4.90|70|bread
Maple Granola|Pantry|Toasted granola clustered with maple and nuts.|7.60|48|bread
Brown Lentils|Pantry|Earth-grown lentils, quick-cooking and protein-rich.|3.80|80|produce
Dried Chickpeas|Pantry|Creamy chickpeas for hummus and stews.|3.50|86|produce
Black Beans (Dry)|Pantry|Heirloom black beans with a deep, chocolate note.|3.65|78|produce
Strawberry Jam|Pantry|Low-sugar jam from Berry Brook fruit.|6.25|54|strawberry
Peach Preserves|Pantry|Sunny peach preserves with visible fruit.|6.40|46|fruit
Apple Butter|Pantry|Slow-cooked apple butter, spiced and thick.|5.80|50|apple
Fresh Egg Pasta|Pantry|Farm-egg fettuccine, dried in small batches.|7.20|38|bread
Wide Egg Noodles|Pantry|Old-world egg noodles for soups and stroganoff.|5.10|60|bread
All-Purpose Flour|Pantry|Unbleached flour milled from local wheat.|4.30|100|bread
Whole Wheat Flour|Pantry|Stone-ground whole wheat with the bran left in.|4.70|72|bread
Fine Cornmeal|Pantry|Sunny cornmeal for breads and polenta.|3.90|64|bread
Flake Sea Salt|Pantry|Crunchy sea salt harvested from coastal pans.|5.50|88|produce
Black Peppercorns|Pantry|Whole peppercorns for grinding at the table.|4.80|74|produce
Herbal Tea Blend|Pantry|Farm mint, lemon balm, and chamomile.|8.10|40|spinach
Dried Lavender|Pantry|Culinary lavender buds for baking and tea.|6.90|28|spinach
English Walnuts|Pantry|Fresh-crack walnuts from orchard trees.|9.40|36|produce
Raw Almonds|Pantry|Unroasted almonds with papery skins.|8.80|42|produce
Pecan Halves|Pantry|Buttery pecans from the autumn harvest.|10.20|30|produce
Roasted Pumpkin Seeds|Pantry|Salted pepitas, roasted in small batches.|5.60|56|produce
Dill Pickle Spears|Pantry|Crunchy spears brined with farm dill.|5.30|62|farm
Classic Sauerkraut|Pantry|Fermented cabbage, naturally fizzy and tangy.|4.75|50|produce
Mild Kimchi|Pantry|Napa kimchi with ginger and farm garlic.|6.80|34|produce
Roasted Tomato Sauce|Pantry|Jarred sauce from field tomatoes and basil.|6.10|58|tomato
Garden Salsa|Pantry|Chunky salsa with peppers, onion, and lime.|5.40|66|tomato
Chili Crisp Oil|Pantry|Crunchy chili oil for eggs, noodles, and greens.|8.50|40|produce
Hot Pepper Jelly|Pantry|Sweet-heat jelly for cheese boards.|6.20|38|produce
Beetroot Relish|Pantry|Ruby beet relish with apple cider tang.|5.15|32|produce
Mustard Seed Jar|Pantry|Stone-ground mustard with a sharp finish.|4.60|54|produce
Farmhouse Ketchup|Pantry|Tomato ketchup slow-simmered with spices.|4.90|60|tomato
Bone Broth (1L)|Pantry|Rich chicken bone broth, frozen fresh.|8.90|24|dairy
Vegetable Broth|Pantry|Allium-forward vegetable broth, unsalted.|6.40|36|produce
Polenta Rounds|Pantry|Ready-to-sear polenta cut from farm corn.|5.70|28|bread
Corn Tortillas|Pantry|Nixtamal tortillas, soft and toasty.|3.80|80|bread
Sourdough Crackers|Pantry|Crisp crackers made from leftover starter.|4.50|52|bread
Multigrain Loaf|Pantry|Seeded sandwich loaf baked before dawn.|7.40|26|bread
Rye Boule|Pantry|Dense rye with caraway and a chewy crust.|7.80|20|bread
Focaccia Square|Pantry|Olive-oil focaccia with rosemary and salt.|6.60|22|bread
Cinnamon Swirl Bread|Pantry|Breakfast loaf swirled with cinnamon sugar.|7.10|24|bread
""".strip().splitlines()


def _parse_extra() -> list[dict]:
    products = []
    for index, line in enumerate(_EXTRA):
        name, category, description, price, qty, image_key = [part.strip() for part in line.split("|")]
        farmers = FARMERS[category]
        products.append(
            {
                "name": name,
                "category": category,
                "farmer_name": farmers[index % len(farmers)],
                "description": description,
                "price": price,
                "available_quantity": int(qty),
                "image_url": IMG[image_key],
            }
        )
    return products


def build_catalog() -> list[dict]:
    products = list(FEATURED_PRODUCTS)
    seen = {item["name"] for item in products}
    extras = _parse_extra()
    by_category: dict[str, list[dict]] = {
        "Vegetables": [],
        "Fruits": [],
        "Dairy & Eggs": [],
        "Pantry": [],
    }
    for item in extras:
        if item["name"] not in seen:
            by_category[item["category"]].append(item)

    # Featured already includes the original marketplace items per category.
    # Baby Spinach is inactive for admin/catalog filter tests → 199 in the public shop, 200 in the DB.
    targets = {"Vegetables": 76, "Fruits": 50, "Dairy & Eggs": 38, "Pantry": 36}
    for category, target in targets.items():
        current = sum(1 for product in products if product["category"] == category)
        for item in by_category[category]:
            if current >= target:
                break
            products.append(item)
            seen.add(item["name"])
            current += 1

    expected = sum(targets.values())
    for item in extras:
        if len(products) >= expected:
            break
        if item["name"] not in seen:
            products.append(item)
            seen.add(item["name"])

    if len(products) != expected:
        raise RuntimeError(f"Catalog must contain exactly {expected} unique products, got {len(products)}")

    names = [p["name"] for p in products]
    if len(names) != len(set(names)):
        raise RuntimeError("Catalog product names must be unique")

    from app.product_images import assign_catalog_images, validate_catalog_images

    assign_catalog_images(products)
    validate_catalog_images(products)

    skus = set()
    for index, product in enumerate(products, start=1):
        sku = f"FF-{index:04d}"
        if sku in skus:
            raise RuntimeError(f"Duplicate SKU generated: {sku}")
        skus.add(sku)
        product["sku"] = sku

    return products
