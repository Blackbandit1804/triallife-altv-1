const DefaultLocales = {
    titles: ['Appearance', 'Facial Structure', 'Hair', 'Details', 'Makeup', 'Info', 'Done'],
    LABEL_NAME: 'Name',
    LABEL_BIRTHDAY: 'Birthday',
    LABEL_GENDER: 'Gender',
    LABEL_DAY: 'Day',
    LABEL_MONTH: 'Month',
    LABEL_YEAR: 'Year',
    LABEL_PREV: 'Prev',
    LABEL_NEXT: 'Next',
    LABEL_SAVE: 'Save',
    LABEL_FIELD_REQUIRED: 'This field is required',
    LABEL_CANNOT_EXCEED: 'cannot exceed',
    LABEL_CANNOT_BE_LESS: 'cannot be less than',
    LABEL_CHARACTER: 'character',
    LABEL_NO_SPECIAL: 'Cannot use special characters',
    LABEL_NAME_NOT_AVAILABLE: 'Name is not available',
    LABEL_CHARACTER_GENDER: 'Male, Female, Other...',
    LABEL_VERIFIED: 'All Data Verified',
    characterName: "What is your character's name?",
    characterBirth: 'When was your character born?',
    characterGender: 'What does your character identify as?',
    appearanceComponent: {
        LABEL_FRAME: 'Physical Frame',
        DESC_FRAME: 'How does your character model look?',
        LABEL_MASCULINE: 'Masculine',
        LABEL_FEMININE: 'Feminine',
        LABEL_PRESETS: 'Presets',
        DESC_PRESETS: 'Not feeling creative? Choose a preset.',
        LABEL_FATHER: 'Father',
        DESC_FATHER: 'What did your father look like?',
        LABEL_MOTHER: 'Mother',
        DESC_MOTHER: 'What did your mother look like?',
        LABEL_FACEBLEND: 'Face Blend',
        DESC_FACEBLEND: 'Blend your mother and father facial structure.',
        LABEL_SKINBLEND: 'Skin Blend',
        DESC_SKINBLEND: 'Blend your mother and father skin colours.',
        LABEL_EYECOLOUR: 'Eye Colour',
        DESC_EYECOLOUR: 'Use this slider to pick an eye colour.',
        LABEL_FACE: 'Face',
        LABEL_SKIN: 'Skin'
    },
    hairComponent: {
        LABEL_HAIRSTYLE: 'Hairstyle',
        DESC_HAIRSTYLE: `Choose your hair style, colour, and highlights.`,
        LABEL_HAIRSTYLE_COLOUR: 'Hairstyle Colour',
        LABEL_HAIRSTYLE_HIGHLIGHTS: 'Hairstyle Highlights',
        LABEL_EYEBROWS: 'Eyebrows',
        DESC_EYEBROWS: 'Choose your eyebrow shape, and colour.',
        LABEL_EYEBROWS_COLOUR: 'Eyebrows Colour',
        LABEL_FACIAL_HAIR: 'Facial Hair',
        DESC_FACIAL_HAIR: 'Choose your facial hair style, colour, opacity, and highlights.',
        LABEL_OPACITY: 'Opacity',
        LABEL_FACIAL_HAIR_COLOUR: 'Facial Hair Colour',
        masculine: [
            'Close Shave',
            'Buzzcut',
            'Faux Hawk',
            'Shaved Sides Slicked Back',
            'Raised Front Same Length',
            'Col De Sacs and Long Back',
            'Close Shave and Loose Mohawk',
            'Ponytail',
            'Corn Rows',
            'Slicked Back Curly Back',
            'Slicked Back',
            'Spiked',
            'Short Bowl Cut',
            'Messy Long Length',
            'Dreads',
            'Straight Long Length',
            'Curly Long',
            'Straight Long Partial Messy',
            'Side Part Front Short',
            'Slicked Back Short',
            'Side Part Front Long',
            'Razer Side Part Slick',
            'Mullet',
            'Nightvision',
            'Corn Rows',
            'Starfish Corn Rows',
            'Zig Zag Corn Rows',
            'Large Snakelike Corn Rows',
            'Small Snakelike Corn Rows',
            'Side Swirl Corn Rows',
            'Flat Top',
            'Front Crown Long Back',
            'Shaved Sided Slicked Back',
            'Side Parted Shaved Sides',
            'Mohawk',
            'Messy Long Back',
            'Center Parted Bob',
            'Buzz Cut',
            'Faux Hawk',
            'Shaved Sides Slicked Back',
            'Raised Front Same Length',
            'Col De Sacs and Long Back',
            'Close Shave and Loose Mohawk',
            'Ponytail',
            'Corn Rows',
            'Slicked Back Curly Back',
            'Slicked Back',
            'Spiked',
            'Short Bowl Cut',
            'Messy Long Length',
            'Dreads',
            'Straight Long Length',
            'Curly Long',
            'Straight Long Partial Messy',
            'Side Part Front Short',
            'Slicked Back Short',
            'Side Part Front Long',
            'Razer Side Part Slick',
            'Mullet',
            'Corn Rows',
            'Starfish Corn Rows',
            'Zig Zag Corn Rows',
            'Large Snakelike Corn Rows',
            'Small Snakelike Corn Rows',
            'Side Swirl Corn Rows',
            'Flat Top',
            'Front Crown Long Back',
            'Shaved Sided Slicked Back',
            'Side Parted Shaved Sides',
            'Mohawk',
            'Messy Long Back',
            'Center Parted Bob',
            'Shaved Sides Flat Top',
            'Shaved Sides Short Top',
            'Elvis'
        ],
        feminine: [
            'Close Shave',
            'Short Bob',
            'Bob',
            'Pigtails',
            'Ponytail',
            'Braided Mohawk',
            'Braids',
            'Bob',
            'Faux Hawk',
            'French Twist',
            'Long Bob',
            'Loose Tied Ponytail',
            'Pixie',
            'Side Parted Shaved Bangs',
            'Top Knot',
            'Wavy Long',
            'Messy Tied Bandana',
            'Messy Bun with Cropped Bangs',
            'Bob with Feathers',
            'Tight Bun Cropped Bangs',
            'Frizzy Curly Afro',
            'Messy Wavy Bangs',
            'Tight Top Bun Braided',
            'Mullet',
            'Night Vision',
            'Braided Corn Rows',
            'Center Part Braided Corn Rows',
            'Diamond Corn Rows',
            'Pigtails with Bangs',
            'Star Braided Corn Rows',
            'Vertical Shaved Corn Rows',
            'Loose Tied Ponytail',
            'Short Mullet',
            'Shaved Sides Slicked Back',
            'Side Parted Shaved Bangs',
            'Mohawk',
            'Tied Pigtails with Bandana',
            'The Karen',
            'Center Parted Bob',
            'Pixie',
            'Bob',
            'Pigtails',
            'Loose Tied Ponytail',
            'Braided Mohawk',
            'Braids',
            'Straight Bob',
            'Faux Hawk',
            'French Twist',
            'Long Bob',
            'Ponytail Bun',
            'Pixie',
            'Side Parted Shaved Bangs',
            'Top Knot',
            'Wavy Long',
            'Messy Tied Bandana',
            'Messy Top Knot with Bangs',
            'Bob with Feathers',
            'Tight Bun Cropped Bangs',
            'Frizzy Curly Afro',
            'Messy Wavy Bangs',
            'Tight Top Bun Braided',
            'Mullet',
            'Corn Rows',
            'Center Parted Corn Rows',
            'Diamond Corn Rows',
            'Pigtails',
            'Star Braided Corn Rows',
            'Vertical Shaved Corn Rows',
            'Loosely Tied Ponytail',
            'Short Mullet',
            'Shaved Sides Slicked Back',
            'Side Parted Shaved Bangs',
            'Mohawk',
            'Tied Pigtails with Bandana',
            'The Karen',
            'Pixie Bob',
            'Tight Pony Tail Bun',
            'Pixie Cut',
            'Elvis'
        ],
        facial: [
            'Stubble',
            'Balbo',
            'Circle Beard',
            'Goatee',
            'Chin',
            'Chin Fuzz',
            'Pencil Chin Strap',
            'Scruffy',
            'Musketeer',
            'Mustache',
            'Trimmed Beard',
            'Stubble Beard',
            'Thin Circle Beard',
            'Horseshoe',
            'Pencil and Chops',
            'Chin Strap',
            'Balbo and Sideburns',
            'Mutton Chops',
            'Scruffy Beard',
            'Curly',
            'Curly and Beard',
            'Handlebar',
            'Faustic',
            'Otto and Patch',
            'Otto and Beard',
            'Light Franz',
            'The Hampstead',
            'The Ambrose',
            'Lincoln Curtain',
            'Clean Shaven'
        ],
        eyebrows: [
            'Balanced',
            'Fashion',
            'Cleopatra',
            'Quizzical',
            'Femme',
            'Seductive',
            'Pinched',
            'Chola',
            'Triomphe',
            'Carefree',
            'Curvaceous',
            'Rodent',
            'Double Tram',
            'Thin',
            'Penciled',
            'Mother Plucker',
            'Straight and Narrow',
            'Natural',
            'Fuzzy',
            'Unkempt',
            'Caterpillar',
            'Regular',
            'Mediterranean',
            'Groomed',
            'Bushels',
            'Feathered',
            'Prickly',
            'Monobrow',
            'Winged',
            'Triple Tram',
            'Arched Tram',
            'Cutouts',
            'Fade Away',
            'Solo Tram',
            'None'
        ]
    },
    structureComponent: [
        'Nose Width',
        'Nose Bottom Height',
        'Nose Tip Length',
        'Nose Bridge Depth',
        'Nose Tip Height',
        'Nose Broken',
        'Brow Height',
        'Brow Depth',
        'Cheekbone Height',
        'Cheekbone Width',
        'Cheek Depth',
        'Eye Size',
        'Lip Thickness',
        'Jaw Width',
        'Jaw Shape',
        'Chin Height',
        'Chin Depth',
        'Chin Width',
        'Chin Indent',
        'Neck Width'
    ],
    makeupComponent: {
        LABEL_STYLE: 'Style',
        LABEL_OPACITY: 'Opacity',
        LABEL_COLOUR1: 'Colour 1',
        LABEL_COLOUR2: 'Colour 2',
        ids: {
            4: {
                name: 'Makeup',
                description: 'Enhance or alter your appearance with this cosmetic.',
                labels: [
                    'Smoky Black',
                    'Bronze',
                    'Soft Gray',
                    'Retro Glam',
                    'Natural Look',
                    'Cat Eyes',
                    'Chola',
                    'Vamp',
                    'Vinewood Glamour',
                    'Bubblegum',
                    'Aqua Dream',
                    'Pin up',
                    'Purple Passion',
                    'Smoky Cat Eye',
                    'Smoldering Ruby',
                    'Pop Princess',
                    'Kiss My Axe',
                    'Panda Pussy',
                    'The Bat',
                    'Skull in Scarlet',
                    'Serpentine',
                    'The Veldt',
                    'Unknown 1',
                    'Unknown 2',
                    'Unknown 3',
                    'Unknown 4',
                    'Tribal Lines',
                    'Tribal Swirls',
                    'Tribal Orange',
                    'Tribal Red',
                    'Trapped in A Box',
                    'Clowning',
                    'Guyliner',
                    'Unknown 5',
                    'Blood Tears',
                    'Heavy Metal',
                    'Sorrow',
                    'Prince of Darkness',
                    'Rocker',
                    'Goth',
                    'Punk',
                    'Devastated'
                ]
            },
            5: {
                name: 'Blush',
                description: 'Makeup that goes on your cheeks.',
                labels: ['Full', 'Angled', 'Round', 'Horizontal', 'High', 'Sweetheart', 'Eighties']
            },
            8: {
                name: 'Lipstick',
                description: 'Coloured cosmetic applied to the lips.',
                labels: [
                    'Color Matte',
                    'Color Gloss',
                    'Lined Matte',
                    'Lined Gloss',
                    'Heavy Lined Matte',
                    'Heavy Lined Gloss',
                    'Lined Nude Matte',
                    'Liner Nude Gloss',
                    'Smudged',
                    'Geisha'
                ]
            }
        }
    },
    overlaysComponent: {
        LABEL_STYLE: 'Style',
        LABEL_OPACITY: 'Opacity',
        ids: {
            0: {
                name: 'Blemish',
                description: 'Do you have any imperfections?',
                labels: [
                    'Measles',
                    'Pimples',
                    'Spots',
                    'Break Out',
                    'Blackheads',
                    'Build Up',
                    'Pustules',
                    'Zits',
                    'Full Acne',
                    'Acne',
                    'Cheek Rash',
                    'Face Rash',
                    'Picker',
                    'Puberty',
                    'Eyesore',
                    'Chin Rash',
                    'Two Face',
                    'T Zone',
                    'Greasy',
                    'Marked',
                    'Acne Scarring',
                    'Full Acne Scarring',
                    'Cold Sores',
                    'Impetigo'
                ]
            },
            3: {
                name: 'Age',
                description: 'How old should your character look?',
                labels: [
                    "Crow's Feet",
                    'First Signs',
                    'Middle Aged',
                    'Worry Lines',
                    'Depression',
                    'Distinguished',
                    'Aged',
                    'Weathered',
                    'Wrinkled',
                    'Sagging',
                    'Tough Life',
                    'Vintage',
                    'Retired',
                    'Junkie',
                    'Geriatric'
                ]
            },
            6: {
                name: 'Complexion',
                description: 'How about some acne, rashes, etc.',
                labels: [
                    'Rosy Cheeks',
                    'Stubble Rash',
                    'Hot Flush',
                    'Sunburn',
                    'Bruised',
                    'Alchoholic',
                    'Patchy',
                    'Totem',
                    'Blood Vessels',
                    'Damaged',
                    'Pale',
                    'Ghostly'
                ]
            },
            7: {
                name: 'Sun Damage',
                description: 'Pitted dry skin and wrinkles.',
                labels: [
                    'Uneven',
                    'Sandpaper',
                    'Patchy',
                    'Rough',
                    'Leathery',
                    'Textured',
                    'Coarse',
                    'Rugged',
                    'Creased',
                    'Cracked',
                    'Gritty'
                ]
            },
            9: {
                name: 'Freckles',
                description: 'Moles and things for your face.',
                labels: [
                    'Cherub',
                    'All Over',
                    'Irregular',
                    'Dot Dash',
                    'Over the Bridge',
                    'Baby Doll',
                    'Pixie',
                    'Sun Kissed',
                    'Beauty Marks',
                    'Line Up',
                    'Modelesque',
                    'Occasional',
                    'Speckled',
                    'Rain Drops',
                    'Double Dip',
                    'One Sided',
                    'Pairs',
                    'Growth'
                ]
            },
            11: {
                name: 'Body Blemish',
                description: 'Do you have any body imperfections?',
                labels: null
            }
        }
    },
    faces: [
        'Benjamin',
        'Daniel',
        'Joshua',
        'Noah',
        'Andrew',
        'Joan',
        'Alex',
        'Isaac',
        'Evan',
        'Ethan',
        'Vincent',
        'Angel',
        'Diego',
        'Adrian',
        'Gabriel',
        'Michael',
        'Santiago',
        'Kevin',
        'Louis',
        'Samuel',
        'Anthony',
        'Hannah',
        'Audrey',
        'Jasmine',
        'Giselle',
        'Amelia',
        'Isabella',
        'Zoe',
        'Ava',
        'Camilla',
        'Violet',
        'Sophia',
        'Eveline',
        'Nicole',
        'Ashley',
        'Grace',
        'Brianna',
        'Natalie',
        'Olivia',
        'Elizabeth',
        'Charlotte',
        'Emma',
        'Claude',
        'Niko',
        'John',
        'Misty'
    ],
    color: {
        hair: [
            'Black',
            'Dark Gray',
            'Medium Gray',
            'Darkest Brown',
            'Dark Brown',
            'Brown',
            'Light Brown',
            'Lighter Brown',
            'Lightest Brown',
            'Faded Brown',
            'Faded Blonde',
            'Lightest Blonde',
            'Lighter Blonde',
            'Light Blonde',
            'White Blonde',
            'Grayish Brown',
            'Redish Brown',
            'Red Brown',
            'Dark Red',
            'Red',
            'Very Red',
            'Vibrant Red',
            'Orangeish Red',
            'Faded Red',
            'Faded Orange',
            'Gray',
            'Light Gray',
            'Lighter Gray',
            'Lightest Gray',
            'Dark Purple',
            'Purple',
            'Light Purple',
            'Violet',
            'Vibrant Violet',
            'Candy Pink',
            'Light Pink',
            'Cyan',
            'Blue',
            'Dark Blue',
            'Green',
            'Emerald',
            'Oil Slick',
            'Shiney Green',
            'Vibrant Green',
            'Green',
            'Bleach Blonde',
            'Golden Blonde',
            'Orange Blonde',
            'Orange',
            'Vibrant Orange',
            'Shiny Orange',
            'Dark Orange',
            'Red',
            'Dark Red',
            'Very Dark Red',
            'Black',
            'Black',
            'Black',
            'Black',
            'Black'
        ],
        overlays: [
            'Red',
            'Pink',
            'Light Pink',
            'Lighter Pink',
            'Lightest Pink',
            'Light Maroon',
            'Maroon',
            'Light Brown',
            'Lighter Brown',
            'Lightest Brown',
            'White Pink',
            'Beige',
            'Brown Red',
            'Orange',
            'Orange Pink',
            'Lightest Pink',
            'Lighter Pink',
            'Pink',
            'Vibrant Pink',
            'Dark Pink',
            'Darker Pink',
            'Darkest Pink',
            'Red',
            'Lighter Red',
            'Vibrant Red',
            'Red Pink',
            'Purple',
            'Light Purple',
            'Dark Purple',
            'Darker Purple',
            'Darkest Purple',
            'Vibrant Purple',
            'Black Purple',
            'Blue',
            'Light Blue',
            'Lighter Blue',
            'Lightest Blue',
            'Cyan',
            'Sea Green',
            'Deep Sea Green',
            'Green',
            'Dark Green',
            'Light Green',
            'Yellow Green',
            'Dark Yellow',
            'Yellow',
            'Yellow Orange',
            'Dark Yellow Orange',
            'Vigrant Orange',
            'Dark Orange',
            'Blonde',
            'Blonde White',
            'White',
            'Gray',
            'Dark Gray',
            'Darkest Gray',
            'Black',
            'Light Blue',
            'Dark Blue',
            'Darkest Blue',
            'Light Brown',
            'Brown',
            'Dark Brown',
            'Darker Brown'
        ],
        eyes: [
            'Green',
            'Emerald',
            'Light Blue',
            'Ocean Blue',
            'Light Brown',
            'Dark Brown',
            'Hazel',
            'Dark Gray',
            'Light Gray',
            'Pink',
            'Yellow',
            'Purple',
            'Blackout',
            'Shades of Gray',
            'Tequila Sunrise',
            'Atomic',
            'Warp',
            'ECola',
            'Space Ranger',
            'Ying Yang',
            'Bullseye',
            'Lizard',
            'Dragon',
            'Extra Terrestrial',
            'Goat',
            'Smiley',
            'Possessed',
            'Demon',
            'Infected',
            'Alien',
            'Undead',
            'Zombie'
        ]
    }
};
