Name - Morrison MacEachern
Student Number - 040902367
Chosen Project - Pokedex

Part 4 Design Decisions:

-luckily i was able to preserve most of my existing javascript from part-3 with very few changes to achieve the api integration and localStorage
-one significant shift from part-3 is that i made a pokemon object literal containing an array where each item in the array contains info about the corresponding pokemon which can be added to as that info is gathered (name, img src, type), that way it's easier to find the info for the corresponding pokemon
-i made type 2 only appear if the pokemon HAS a type 2
-i initially struggled with the api integration but after getting the link right it came together pretty swiftly from there
-by reusing code for getting pokemon info it was a bit difficult to make everything work right at first but it was ultimately more efficient
-i was originally using the official art url for both the sprite and the full image, until i realized that there was also a link provided for the sprite version of each pokemon. it loaded faster after that too since they're smaller images
-this took much less time than part 3 but I did use a fair bit of javascript in part 3 while making the website layout so I probably ate into the part-4 workload
-the site looks a little plain in all honesty but i was closely referencing the in game pokedex from gen 4 (platinum's one in particular) so it's not exactly unintentional