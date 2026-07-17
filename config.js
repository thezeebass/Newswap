// config.js
// Skeletor's Cabinet EXPANDED — Full Cabinet + 40 Key Americans
// All villains are from verified TV/Cartoon/Movie/Story sources (1984–2026)

const SKELETOR_CONFIG = {
  // ═══════════════════════════════════════════════════════════════
  // THE BIG BAD — He-Man and the Masters of the Universe (1983)
  // ═══════════════════════════════════════════════════════════════
  trump: {
    villain: "Skeletor",
    source: "He-Man and the Masters of the Universe (1983)",
    patterns: [
      { regex: /Donald\s+(J\.?\s*)?Trump/gi, type: "full" },
      { regex: /President\s+Trump/gi, type: "full" },
      { regex: /President\s+Donald\s+(J\.?\s*)?Trump/gi, type: "full" },
      { regex: /Donald\s+J\.?\s+Trump/gi, type: "full" },
      { regex: /\bTrump\b/g, type: "capitalized" }
    ],
    blacklist: [
      "trumpet", "trump card", "strumpet", "triumph", "trumpery",
      "trumped", "trumping", "trumpeter", "trumpeting", "trumpets"
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // FULL CABINET — All 22+ positions
  // ═══════════════════════════════════════════════════════════════
  cabinet: {

    // ── EXECUTIVE DEPARTMENTS ──

    // 1. Vice President
    "jd_vance": {
      villain: "Beast Man",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Vice President",
      patterns: [
        { regex: /J\.?D\.?\s+Vance/gi, type: "full" },
        { regex: /Vice\s+President\s+Vance/gi, type: "full" },
        { regex: /Vice\s+President\s+J\.?D\.?\s+Vance/gi, type: "full" },
        { regex: /Senator\s+Vance/gi, type: "full" },
        { regex: /\bVance\b/gi, type: "surname" }
      ]
    },

    // 2. Secretary of State
    "marco_rubio": {
      villain: "Tri-Klops",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of State",
      patterns: [
        { regex: /Marco\s+Rubio/gi, type: "full" },
        { regex: /Secretary\s+Rubio/gi, type: "full" },
        { regex: /Secretary\s+of\s+State\s+Rubio/gi, type: "full" },
        { regex: /Senator\s+Rubio/gi, type: "full" },
        { regex: /\bRubio\b/gi, type: "surname" }
      ]
    },

    // 3. Secretary of Treasury
    "scott_bessent": {
      villain: "Mer-Man",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of the Treasury",
      patterns: [
        { regex: /Scott\s+Bessent/gi, type: "full" },
        { regex: /Secretary\s+Bessent/gi, type: "full" },
        { regex: /Treasury\s+Secretary\s+Bessent/gi, type: "full" },
        { regex: /Secretary\s+of\s+the\s+Treasury\s+Bessent/gi, type: "full" },
        { regex: /\bBessent\b/gi, type: "surname" }
      ]
    },

    // 4. Secretary of Defense
    "pete_hegseth": {
      villain: "Trap Jaw",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of Defense",
      patterns: [
        { regex: /Pete\s+Hegseth/gi, type: "full" },
        { regex: /Secretary\s+Hegseth/gi, type: "full" },
        { regex: /Defense\s+Secretary\s+Hegseth/gi, type: "full" },
        { regex: /Secretary\s+of\s+Defense\s+Hegseth/gi, type: "full" },
        { regex: /\bHegseth\b/gi, type: "surname" }
      ]
    },

    // 5. Attorney General
    "pam_bondi": {
      villain: "Evil-Lyn",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Attorney General",
      patterns: [
        { regex: /Pam\s+Bondi/gi, type: "full" },
        { regex: /Attorney\s+General\s+Bondi/gi, type: "full" },
        { regex: /AG\s+Bondi/gi, type: "full" },
        { regex: /Pamela\s+Bondi/gi, type: "full" },
        { regex: /\bBondi\b/gi, type: "surname" }
      ],
      note: "Removed April 2026; Todd Blanche nominated."
    },

    // 6. Secretary of Interior
    "doug_burgum": {
      villain: "Clawful",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of the Interior",
      patterns: [
        { regex: /Doug\s+Burgum/gi, type: "full" },
        { regex: /Secretary\s+Burgum/gi, type: "full" },
        { regex: /Interior\s+Secretary\s+Burgum/gi, type: "full" },
        { regex: /Governor\s+Burgum/gi, type: "full" },
        { regex: /\bBurgum\b/gi, type: "surname" }
      ]
    },

    // 7. Secretary of Agriculture
    "brooke_rollins": {
      villain: "Whiplash",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of Agriculture",
      patterns: [
        { regex: /Brooke\s+Rollins/gi, type: "full" },
        { regex: /Secretary\s+Rollins/gi, type: "full" },
        { regex: /Agriculture\s+Secretary\s+Rollins/gi, type: "full" },
        { regex: /\bRollins\b/gi, type: "surname" }
      ]
    },

    // 8. Secretary of Commerce
    "howard_lutnick": {
      villain: "Two Bad",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of Commerce",
      patterns: [
        { regex: /Howard\s+Lutnick/gi, type: "full" },
        { regex: /Secretary\s+Lutnick/gi, type: "full" },
        { regex: /Commerce\s+Secretary\s+Lutnick/gi, type: "full" },
        { regex: /Secretary\s+of\s+Commerce\s+Lutnick/gi, type: "full" },
        { regex: /\bLutnick\b/gi, type: "surname" }
      ]
    },

    // 9. Secretary of Labor
    "lori_chavez_deremer": {
      villain: "Shadow Weaver",
      source: "She-Ra and the Princesses of Power (2018)",
      role: "Secretary of Labor",
      patterns: [
        { regex: /Lori\s+Chavez-DeRemer/gi, type: "full" },
        { regex: /Secretary\s+Chavez-DeRemer/gi, type: "full" },
        { regex: /Labor\s+Secretary\s+Chavez-DeRemer/gi, type: "full" },
        { regex: /\bChavez-DeRemer\b/gi, type: "surname" },
        { regex: /\bDeRemer\b/gi, type: "surname" }
      ],
      note: "Resigned April 2026."
    },

    // 10. Secretary of Health & Human Services
    "rfk_jr": {
      villain: "Stinkor",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of Health and Human Services",
      patterns: [
        { regex: /Robert\s+F\.?\s+Kennedy\s+Jr\.?/gi, type: "full" },
        { regex: /RFK\s+Jr\.?/gi, type: "full" },
        { regex: /Secretary\s+Kennedy/gi, type: "full" },
        { regex: /Robert\s+Kennedy\s+Jr\.?/gi, type: "full" },
        { regex: /Kennedy\s+Jr\.?/gi, type: "full" }
      ]
    },

    // 11. Secretary of Housing & Urban Development
    "scott_turner": {
      villain: "Modulok",
      source: "He-Man and the Masters of the Universe (1985)",
      role: "Secretary of Housing and Urban Development",
      patterns: [
        { regex: /Scott\s+Turner/gi, type: "full" },
        { regex: /Secretary\s+Turner/gi, type: "full" },
        { regex: /HUD\s+Secretary\s+Turner/gi, type: "full" },
        { regex: /\bTurner\b/gi, type: "surname" }
      ]
    },

    // 12. Secretary of Transportation
    "sean_duffy": {
      villain: "Webstor",
      source: "He-Man and the Masters of the Universe (1985)",
      role: "Secretary of Transportation",
      patterns: [
        { regex: /Sean\s+Duffy/gi, type: "full" },
        { regex: /Secretary\s+Duffy/gi, type: "full" },
        { regex: /Transportation\s+Secretary\s+Duffy/gi, type: "full" },
        { regex: /\bDuffy\b/gi, type: "surname" }
      ]
    },

    // 13. Secretary of Energy
    "chris_wright": {
      villain: "Kobra Khan",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Secretary of Energy",
      patterns: [
        { regex: /Chris\s+Wright/gi, type: "full" },
        { regex: /Secretary\s+Wright/gi, type: "full" },
        { regex: /Energy\s+Secretary\s+Wright/gi, type: "full" },
        { regex: /\bWright\b/gi, type: "surname" }
      ]
    },

    // 14. Secretary of Education
    "linda_mcmahon": {
      villain: "Catra",
      source: "She-Ra and the Princesses of Power (2018)",
      role: "Secretary of Education",
      patterns: [
        { regex: /Linda\s+McMahon/gi, type: "full" },
        { regex: /Secretary\s+McMahon/gi, type: "full" },
        { regex: /Education\s+Secretary\s+McMahon/gi, type: "full" },
        { regex: /\bMcMahon\b/gi, type: "surname" }
      ]
    },

    // 15. Secretary of Veterans Affairs
    "doug_collins": {
      villain: "Spikor",
      source: "He-Man and the Masters of the Universe (1985)",
      role: "Secretary of Veterans Affairs",
      patterns: [
        { regex: /Doug\s+Collins/gi, type: "full" },
        { regex: /Secretary\s+Collins/gi, type: "full" },
        { regex: /VA\s+Secretary\s+Collins/gi, type: "full" },
        { regex: /\bCollins\b/gi, type: "surname" }
      ]
    },

    // 16. Secretary of Homeland Security
    "markwayne_mullin": {
      villain: "Blast-Attak",
      source: "He-Man and the Masters of the Universe (1986)",
      role: "Secretary of Homeland Security",
      patterns: [
        { regex: /Markwayne\s+Mullin/gi, type: "full" },
        { regex: /Secretary\s+Mullin/gi, type: "full" },
        { regex: /Homeland\s+Security\s+Secretary\s+Mullin/gi, type: "full" },
        { regex: /DHS\s+Secretary\s+Mullin/gi, type: "full" },
        { regex: /\bMullin\b/gi, type: "surname" }
      ],
      note: "Replaced Kristi Noem (March 2026)."
    },

    // ── CABINET-LEVEL POSITIONS ──

    // 17. White House Chief of Staff
    "susie_wiles": {
      villain: "Screeech",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "White House Chief of Staff",
      patterns: [
        { regex: /Susie\s+Wiles/gi, type: "full" },
        { regex: /Chief\s+of\s+Staff\s+Wiles/gi, type: "full" },
        { regex: /White\s+House\s+Chief\s+of\s+Staff\s+Wiles/gi, type: "full" },
        { regex: /Susannah\s+Wiles/gi, type: "full" },
        { regex: /\bWiles\b/gi, type: "surname" }
      ]
    },

    // 18. EPA Administrator
    "lee_zeldin": {
      villain: "Ninjor",
      source: "He-Man and the Masters of the Masters of the Universe (1985)",
      role: "EPA Administrator",
      patterns: [
        { regex: /Lee\s+Zeldin/gi, type: "full" },
        { regex: /Administrator\s+Zeldin/gi, type: "full" },
        { regex: /EPA\s+Administrator\s+Zeldin/gi, type: "full" },
        { regex: /\bZeldin\b/gi, type: "surname" }
      ]
    },

    // 19. Director of OMB
    "russ_vought": {
      villain: "Faker",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "Director of OMB",
      patterns: [
        { regex: /Russ\s+Vought/gi, type: "full" },
        { regex: /Russell\s+Vought/gi, type: "full" },
        { regex: /Director\s+Vought/gi, type: "full" },
        { regex: /OMB\s+Director\s+Vought/gi, type: "full" },
        { regex: /\bVought\b/gi, type: "surname" }
      ]
    },

    // 20. U.S. Trade Representative
    "jamieson_greer": {
      villain: "Panthor",
      source: "He-Man and the Masters of the Universe (1983)",
      role: "U.S. Trade Representative",
      patterns: [
        { regex: /Jamieson\s+Greer/gi, type: "full" },
        { regex: /Ambassador\s+Greer/gi, type: "full" },
        { regex: /Trade\s+Representative\s+Greer/gi, type: "full" },
        { regex: /\bGreer\b/gi, type: "surname" }
      ]
    },

    // 21. Director of CIA
    "john_ratcliffe": {
      villain: "Sssqueeze",
      source: "He-Man and the Masters of the Universe (1986)",
      role: "Director of the CIA",
      patterns: [
        { regex: /John\s+Ratcliffe/gi, type: "full" },
        { regex: /Director\s+Ratcliffe/gi, type: "full" },
        { regex: /CIA\s+Director\s+Ratcliffe/gi, type: "full" },
        { regex: /\bRatcliffe\b/gi, type: "surname" }
      ]
    },

    // 22. Director of National Intelligence
    "tulsi_gabbard": {
      villain: "Scorpia",
      source: "She-Ra and the Princesses of Power (2018)",
      role: "Director of National Intelligence",
      patterns: [
        { regex: /Tulsi\s+Gabbard/gi, type: "full" },
        { regex: /Director\s+Gabbard/gi, type: "full" },
        { regex: /DNI\s+Gabbard/gi, type: "full" },
        { regex: /Director\s+of\s+National\s+Intelligence\s+Gabbard/gi, type: "full" },
        { regex: /\bGabbard\b/gi, type: "surname" }
      ]
    },

    // 23. SBA Administrator
    "kelly_loeffler": {
      villain: "Entrapta",
      source: "She-Ra and the Princesses of Power (2018)",
      role: "SBA Administrator",
      patterns: [
        { regex: /Kelly\s+Loeffler/gi, type: "full" },
        { regex: /Senator\s+Loeffler/gi, type: "full" },
        { regex: /Administrator\s+Loeffler/gi, type: "full" },
        { regex: /\bLoeffler\b/gi, type: "surname" }
      ]
    },

    // 24. UN Ambassador
    "michael_waltz": {
      villain: "Hordak",
      source: "She-Ra and the Princesses of Power (2018)",
      role: "U.S. Ambassador to the UN",
      patterns: [
        { regex: /Michael\s+Waltz/gi, type: "full" },
        { regex: /Ambassador\s+Waltz/gi, type: "full" },
        { regex: /UN\s+Ambassador\s+Waltz/gi, type: "full" },
        { regex: /\bWaltz\b/gi, type: "surname" }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // INDUSTRY — Tech, Business, Finance (10)
  // ═══════════════════════════════════════════════════════════════
  industry: {

    // 1. Elon Musk — Tesla, SpaceX, X, xAI
    "elon_musk": {
      villain: "Shredder",
      source: "Teenage Mutant Ninja Turtles (1987)",
      sector: "Tech / Space / Social Media",
      patterns: [
        { regex: /Elon\s+Musk/gi, type: "full" },
        { regex: /\bMusk\b/gi, type: "surname" }
      ]
    },

    // 2. Jeff Bezos — Amazon
    "jeff_bezos": {
      villain: "Megatron",
      source: "Transformers (1984)",
      sector: "E-commerce / Space",
      patterns: [
        { regex: /Jeff\s+Bezos/gi, type: "full" },
        { regex: /\bBezos\b/gi, type: "surname" }
      ]
    },

    // 3. Mark Zuckerberg — Meta
    "mark_zuckerberg": {
      villain: "Krang",
      source: "Teenage Mutant Ninja Turtles (1987)",
      sector: "Social Media / Metaverse",
      patterns: [
        { regex: /Mark\s+Zuckerberg/gi, type: "full" },
        { regex: /\bZuckerberg\b/gi, type: "surname" }
      ]
    },

    // 4. Tim Cook — Apple
    "tim_cook": {
      villain: "Starscream",
      source: "Transformers (1984)",
      sector: "Technology",
      patterns: [
        { regex: /Tim\s+Cook/gi, type: "full" },
        { regex: /CEO\s+Cook/gi, type: "full" },
        { regex: /\bCook\b/gi, type: "surname" }
      ]
    },

    // 5. Sundar Pichai — Google/Alphabet
    "sundar_pichai": {
      villain: "Mumm-Ra",
      source: "ThunderCats (1985)",
      sector: "Technology / AI",
      patterns: [
        { regex: /Sundar\s+Pichai/gi, type: "full" },
        { regex: /CEO\s+Pichai/gi, type: "full" },
        { regex: /\bPichai\b/gi, type: "surname" }
      ]
    },

    // 6. Jamie Dimon — JPMorgan Chase
    "jamie_dimon": {
      villain: "Cobra Commander",
      source: "G.I. Joe: A Real American Hero (1983)",
      sector: "Banking / Finance",
      patterns: [
        { regex: /Jamie\s+Dimon/gi, type: "full" },
        { regex: /CEO\s+Dimon/gi, type: "full" },
        { regex: /\bDimon\b/gi, type: "surname" }
      ]
    },

    // 7. Warren Buffett — Berkshire Hathaway
    "warren_buffett": {
      villain: "Destro",
      source: "G.I. Joe: A Real American Hero (1983)",
      sector: "Investment",
      patterns: [
        { regex: /Warren\s+Buffett/gi, type: "full" },
        { regex: /\bBuffett\b/gi, type: "surname" }
      ]
    },

    // 8. Larry Ellison — Oracle
    "larry_ellison": {
      villain: "Skeletor",
      source: "He-Man and the Masters of the Universe (2002)",
      sector: "Technology / Database",
      patterns: [
        { regex: /Larry\s+Ellison/gi, type: "full" },
        { regex: /\bEllison\b/gi, type: "surname" }
      ]
    },

    // 9. Jensen Huang — NVIDIA
    "jensen_huang": {
      villain: "Frieza",
      source: "Dragon Ball Z (1989)",
      sector: "AI Hardware / GPUs",
      patterns: [
        { regex: /Jensen\s+Huang/gi, type: "full" },
        { regex: /CEO\s+Huang/gi, type: "full" },
        { regex: /\bHuang\b/gi, type: "surname" }
      ]
    },

    // 10. Satya Nadella — Microsoft
    "satya_nadella": {
      villain: "Cell",
      source: "Dragon Ball Z (1989)",
      sector: "Technology / Cloud",
      patterns: [
        { regex: /Satya\s+Nadella/gi, type: "full" },
        { regex: /CEO\s+Nadella/gi, type: "full" },
        { regex: /\bNadella\b/gi, type: "surname" }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // SPORTS (10)
  // ═══════════════════════════════════════════════════════════════
  sports: {

    // 1. LeBron James — NBA
    "lebron_james": {
      villain: "M. Bison",
      source: "Street Fighter II: The Animated Movie (1994)",
      sport: "Basketball",
      patterns: [
        { regex: /LeBron\s+James/gi, type: "full" },
        { regex: /King\s+James/gi, type: "full" },
        { regex: /\bJames\b/gi, type: "surname" }
      ]
    },

    // 2. Patrick Mahomes — NFL
    "patrick_mahomes": {
      villain: "Bane",
      source: "Batman: The Animated Series (1992)",
      sport: "Football",
      patterns: [
        { regex: /Patrick\s+Mahomes/gi, type: "full" },
        { regex: /\bMahomes\b/gi, type: "surname" }
      ]
    },

    // 3. Tom Brady — NFL (retired but ever-present)
    "tom_brady": {
      villain: "Thanos",
      source: "Avengers: Infinity War (2018)",
      sport: "Football",
      patterns: [
        { regex: /Tom\s+Brady/gi, type: "full" },
        { regex: /\bBrady\b/gi, type: "surname" }
      ]
    },

    // 4. Serena Williams — Tennis
    "serena_williams": {
      villain: "Azula",
      source: "Avatar: The Last Airbender (2005)",
      sport: "Tennis",
      patterns: [
        { regex: /Serena\s+Williams/gi, type: "full" },
        { regex: /\bWilliams\b/gi, type: "surname" }
      ]
    },

    // 5. Shohei Ohtani — MLB
    "shohei_ohtani": {
      villain: "Freeza",
      source: "Dragon Ball Z (1989)",
      sport: "Baseball",
      patterns: [
        { regex: /Shohei\s+Ohtani/gi, type: "full" },
        { regex: /\bOhtani\b/gi, type: "surname" }
      ]
    },

    // 6. Caitlin Clark — WNBA
    "caitlin_clark": {
      villain: "Shego",
      source: "Kim Possible (2002)",
      sport: "Basketball",
      patterns: [
        { regex: /Caitlin\s+Clark/gi, type: "full" },
        { regex: /\bClark\b/gi, type: "surname" }
      ]
    },

    // 7. Travis Kelce — NFL
    "travis_kelce": {
      villain: "The Joker",
      source: "Batman: The Animated Series (1992)",
      sport: "Football",
      patterns: [
        { regex: /Travis\s+Kelce/gi, type: "full" },
        { regex: /\bKelce\b/gi, type: "surname" }
      ]
    },

    // 8. Stephen Curry — NBA
    "stephen_curry": {
      villain: "Magneto",
      source: "X-Men: The Animated Series (1992)",
      sport: "Basketball",
      patterns: [
        { regex: /Stephen\s+Curry/gi, type: "full" },
        { regex: /Steph\s+Curry/gi, type: "full" },
        { regex: /\bCurry\b/gi, type: "surname" }
      ]
    },

    // 9. Lionel Messi — Soccer (plays in MLS)
    "lionel_messi": {
      villain: "Venom",
      source: "Spider-Man: The Animated Series (1994)",
      sport: "Soccer",
      patterns: [
        { regex: /Lionel\s+Messi/gi, type: "full" },
        { regex: /\bMessi\b/gi, type: "surname" }
      ]
    },

    // 10. Taylor Swift — Music/Entertainment (crossover with sports)
    "taylor_swift": {
      villain: "Harley Quinn",
      source: "Batman: The Animated Series (1992)",
      sport: "Entertainment / NFL crossover",
      patterns: [
        { regex: /Taylor\s+Swift/gi, type: "full" },
        { regex: /\bSwift\b/gi, type: "surname" }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // POPULAR CULTURE — Music, Film, TV, Influencers (20)
  // ═══════════════════════════════════════════════════════════════
  pop_culture: {

    // 1. Beyonce — Music
    "beyonce": {
      villain: "Ursula",
      source: "The Little Mermaid (1989)",
      field: "Music / Entertainment",
      patterns: [
        { regex: /Beyonc\u00e9/gi, type: "full" },
        { regex: /Beyonce/gi, type: "full" },
        { regex: /Queen\s+Bey/gi, type: "full" }
      ]
    },

    // 2. Drake — Music
    "drake": {
      villain: "Plankton",
      source: "SpongeBob SquarePants (1999)",
      field: "Music",
      patterns: [
        { regex: /\bDrake\b/gi, type: "full" }
      ]
    },

    // 3. Kanye West — Music/Fashion
    "kanye_west": {
      villain: "Darth Vader",
      source: "Star Wars: The Clone Wars (2008)",
      field: "Music / Fashion",
      patterns: [
        { regex: /Kanye\s+West/gi, type: "full" },
        { regex: /Ye\b/gi, type: "full" },
        { regex: /\bWest\b/gi, type: "surname" }
      ]
    },

    // 4. Kim Kardashian — Reality TV / Business
    "kim_kardashian": {
      villain: "Cruella de Vil",
      source: "One Hundred and One Dalmatians: The Series (1997)",
      field: "Reality TV / Business",
      patterns: [
        { regex: /Kim\s+Kardashian/gi, type: "full" },
        { regex: /\bKardashian\b/gi, type: "surname" }
      ]
    },

    // 5. MrBeast — YouTube
    "mrbeast": {
      villain: "Rick Sanchez",
      source: "Rick and Morty (2013)",
      field: "YouTube / Content Creation",
      patterns: [
        { regex: /MrBeast/gi, type: "full" },
        { regex: /Mr\.\s*Beast/gi, type: "full" },
        { regex: /Jimmy\s+Donaldson/gi, type: "full" }
      ]
    },

    // 6. Joe Rogan — Podcasting
    "joe_rogan": {
      villain: "Stewie Griffin",
      source: "Family Guy (1999)",
      field: "Podcasting / Comedy",
      patterns: [
        { regex: /Joe\s+Rogan/gi, type: "full" },
        { regex: /\bRogan\b/gi, type: "surname" }
      ]
    },

    // 7. Dave Chappelle — Comedy
    "dave_chappelle": {
      villain: "Eric Cartman",
      source: "South Park (1997)",
      field: "Comedy",
      patterns: [
        { regex: /Dave\s+Chappelle/gi, type: "full" },
        { regex: /\bChappelle\b/gi, type: "surname" }
      ]
    },

    // 8. Dwayne Johnson — Film
    "dwayne_johnson": {
      villain: "Red Hulk",
      source: "Hulk and the Agents of S.M.A.S.H. (2013)",
      field: "Film / Wrestling",
      patterns: [
        { regex: /Dwayne\s+Johnson/gi, type: "full" },
        { regex: /The\s+Rock/gi, type: "full" },
        { regex: /\bJohnson\b/gi, type: "surname" }
      ]
    },

    // 9. Ryan Reynolds — Film / Business
    "ryan_reynolds": {
      villain: "Deadpool",
      source: "Ultimate Spider-Man (2012)",
      field: "Film / Business",
      patterns: [
        { regex: /Ryan\s+Reynolds/gi, type: "full" },
        { regex: /\bReynolds\b/gi, type: "surname" }
      ]
    },

    // 10. Zendaya — Film / Fashion
    "zendaya": {
      villain: "Azula",
      source: "Avatar: The Last Airbender (2005)",
      field: "Film / Fashion",
      patterns: [
        { regex: /Zendaya/gi, type: "full" }
      ]
    },

    // 11. Billie Eilish — Music
    "billie_eilish": {
      villain: "Marceline",
      source: "Adventure Time (2010)",
      field: "Music",
      patterns: [
        { regex: /Billie\s+Eilish/gi, type: "full" },
        { regex: /\bEilish\b/gi, type: "surname" }
      ]
    },

    // 12. Post Malone — Music
    "post_malone": {
      villain: "Ice King",
      source: "Adventure Time (2010)",
      field: "Music",
      patterns: [
        { regex: /Post\s+Malone/gi, type: "full" },
        { regex: /\bMalone\b/gi, type: "surname" }
      ]
    },

    // 13. Olivia Rodrigo — Music
    "olivia_rodrigo": {
      villain: "Star Butterfly",
      source: "Star vs. the Forces of Evil (2015)",
      field: "Music",
      patterns: [
        { regex: /Olivia\s+Rodrigo/gi, type: "full" },
        { regex: /\bRodrigo\b/gi, type: "surname" }
      ]
    },

    // 14. Bad Bunny — Music
    "bad_bunny": {
      villain: "Mojo Jojo",
      source: "The Powerpuff Girls (1998)",
      field: "Music",
      patterns: [
        { regex: /Bad\s+Bunny/gi, type: "full" },
        { regex: /Benito\s+Martinez/gi, type: "full" }
      ]
    },

    // 15. The Weeknd — Music
    "the_weeknd": {
      villain: "Aku",
      source: "Samurai Jack (2001)",
      field: "Music",
      patterns: [
        { regex: /The\s+Weeknd/gi, type: "full" },
        { regex: /Abel\s+Tesfaye/gi, type: "full" }
      ]
    },

    // 16. Kendrick Lamar — Music
    "kendrick_lamar": {
      villain: "Oogie Boogie",
      source: "The Nightmare Before Christmas (1993)",
      field: "Music",
      patterns: [
        { regex: /Kendrick\s+Lamar/gi, type: "full" },
        { regex: /\bLamar\b/gi, type: "surname" }
      ]
    },

    // 17. Travis Scott — Music
    "travis_scott": {
      villain: "Lord Hater",
      source: "Wander Over Yonder (2013)",
      field: "Music",
      patterns: [
        { regex: /Travis\s+Scott/gi, type: "full" },
        { regex: /\bScott\b/gi, type: "surname" }
      ]
    },

    // 18. Charli XCX — Music
    "charli_xcx": {
      villain: "Lord Dominator",
      source: "Wander Over Yonder (2013)",
      field: "Music",
      patterns: [
        { regex: /Charli\s+XCX/gi, type: "full" },
        { regex: /Charli\s+xcx/gi, type: "full" }
      ]
    },

    // 19. Sabrina Carpenter — Music/Acting
    "sabrina_carpenter": {
      villain: "Pacifica Northwest",
      source: "Gravity Falls (2012)",
      field: "Music / Acting",
      patterns: [
        { regex: /Sabrina\s+Carpenter/gi, type: "full" },
        { regex: /\bCarpenter\b/gi, type: "surname" }
      ]
    },

    // 20. Chappell Roan — Music
    "chappell_roan": {
      villain: "Peridot",
      source: "Steven Universe (2013)",
      field: "Music",
      patterns: [
        { regex: /Chappell\s+Roan/gi, type: "full" },
        { regex: /\bRoan\b/gi, type: "surname" }
      ]
    }
  }
};
