/*
  All website content lives in this one file.
  Every entry has a "source" so the Sources page and each listing can cite it.
  "checked" is the date we last confirmed the information. Re-check everything before competition.

  type:   organization | program | service | event | resource
  topics: Food, Health & Counseling, Youth & Family, Seniors, Learning, Legal & Safety, Recreation, Civic Life, Volunteer
*/

window.SOURCES = {
  cityContact: { title: "City of Sammamish: Contact Info", publisher: "City of Sammamish", url: "https://www.sammamishwa.gov/government/contact-info" },
  cityHumanServices: { title: "Sammamish 101: Human Services", publisher: "City of Sammamish", url: "https://www.sammamish.us/news/sammamish-101-human-services/" },
  cityServices: { title: "Our Community: Services", publisher: "City of Sammamish", url: "https://www.sammamish.us/our-community/services/" },
  cityCouncil2026: { title: "2026 City Council Meetings", publisher: "City of Sammamish", url: "https://www.sammamish.us/news/events/2026-city-council-meetings/" },
  cityLanding: { title: "Sammamish Landing Park", publisher: "City of Sammamish", url: "https://sammamishwa.gov/our-community/recreation/parks-trails/sammamish-landing-park/" },
  hoodline: { title: "Sammamish partners with 44 nonprofits to serve over 12,000 residents", publisher: "Hoodline, May 2025", url: "https://hoodline.com/2025/05/sammamish-partners-with-44-nonprofits-to-serve-over-12-000-residents-through-human-services-program/" },
  kcls: { title: "Sammamish Library location page", publisher: "King County Library System", url: "https://kcls.org/locations/SAMMAMISH" },
  burbioLibrary: { title: "Sammamish Library events", publisher: "Burbio", url: "https://login.burbio.com/states/Washington/Sammamish/sammamish-library" },
  ymca: { title: "About the Sammamish Community Y", publisher: "YMCA of Greater Seattle", url: "https://seattleymca.org/node/3664031" },
  aquaticCenter: { title: "Sammamish Community and Aquatic Center", publisher: "Athletic Business", url: "https://www.athleticbusiness.com/project-galleries/aquatic-design-portfolio/gHhSw3bsVF/sammamish-community-and-aquatic-center-sammamish-wa" },
  foodBank211: { title: "Issaquah Food & Clothing Bank listing", publisher: "Washington 211", url: "https://search.wa211.org/search/5ca795f8-be43-5b35-872e-d4d3b5ca09b3" },
  foodBankHours: { title: "Client Service Hours", publisher: "Issaquah Food & Clothing Bank", url: "https://issaquahfoodbank.org/client-service-hours" },
  redmondFunding: { title: "2023–2024 Human Services Funding (Hopelink, LifeWire)", publisher: "City of Redmond", url: "https://www.redmond.gov/DocumentCenter/View/29676/2023_09-28---Human-Services-Element-20---Attachment-B---2023-2024-Funding" },
  bellevueFunding: { title: "Human Services 2017–2018 Funded Agencies (ELAP, Kindering)", publisher: "City of Bellevue", url: "https://bellevuewa.gov/UserFiles/Servers/Server_4779004/File/Parks & Community Services/Human-Services/2018/human-services-2017-2018-funded-agencies.pdf" },
  sammamishFriends: { title: "Sammamish Friends nonprofit profile", publisher: "Idealist", url: "https://www.idealist.org/en/nonprofit/6cf8d6c799e5454bb81d6605fd8a6471-sammamish-friends-sammamish" },
  farmersMarket2026: { title: "Sammamish Farmers Market opens for 2026", publisher: "Sammamish Independent, May 2026", url: "https://sammamishindependent.com/2026/05/sammamish-farmers-market-opens-for-2026/" },
  diwaliBazaar: { title: "Sammamish Diwali Bazaar 2026", publisher: "The Craft Map", url: "https://www.thecraftmap.com/fair/sammamish-diwali-bazaar-2026-sammamish-wa" },
  lifeline988: { title: "988 Suicide & Crisis Lifeline", publisher: "U.S. Department of Health and Human Services (SAMHSA)", url: "https://988lifeline.org/" },
  wa211: { title: "Washington 211", publisher: "Washington 211", url: "https://wa211.org/" },
  kingCountyFind: { title: "Find Human Services", publisher: "King County", url: "https://find-human-services.kingcounty.gov/" }
};

window.ENTRIES = [
  /* ---------------- ORGANIZATIONS ---------------- */
  {
    id: "city-of-sammamish", type: "organization", name: "City of Sammamish",
    topics: ["Civic Life"],
    summary: "City government for Sammamish. City Hall handles permits, parks, and human services, and connects residents to its 44 nonprofit partners.",
    address: "801 228th Ave SE, Sammamish, WA 98075", phone: "(425) 295-0500",
    hours: "Mon–Fri, 8:30 am–5:00 pm", website: "https://www.sammamish.us",
    image: "assets/img/sammamish-commons.jpg", imageAlt: "Cedar-sided Sammamish Commons building with tall wood columns at the entrance",
    source: "cityContact", checked: "2026-10-21"
  },
  {
    id: "sammamish-library", type: "organization", name: "Sammamish Library (KCLS)",
    topics: ["Learning", "Youth & Family"],
    summary: "Free public library run by the King County Library System. Books, study rooms, computers, English classes, tutoring, and teen programs.",
    address: "825 228th Ave SE, Sammamish, WA 98075", phone: "(425) 392-3130",
    hours: "Mon 10–6 · Tue–Wed 10–8 · Thu–Fri 10–6 · Sat–Sun 11–6", website: "https://kcls.org/sammamish",
    image: "assets/img/sammamish-library.jpg", imageAlt: "Sammamish Library at dusk, its glass walls glowing under a wide overhanging roof",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "sammamish-ymca", type: "organization", name: "Sammamish Community YMCA",
    topics: ["Recreation", "Youth & Family"],
    summary: "Runs the city-owned Sammamish Community & Aquatic Center: lap and leisure pools, two gyms, a jogging track, fitness classes, and youth programs.",
    address: "Sammamish Commons, 228th Ave SE, Sammamish, WA 98075", phone: "",
    hours: "See YMCA website for current hours", website: "https://www.seattleymca.org",
    image: "assets/img/community-center-dusk.jpg", imageAlt: "Sammamish Community and Aquatic Center at dusk with a landscaped roundabout in front",
    source: "ymca", checked: "2026-10-21"
  },
  {
    id: "issaquah-food-bank", type: "organization", name: "Issaquah Food & Clothing Bank",
    topics: ["Food"],
    summary: "The closest food bank to Sammamish (Sammamish has none of its own). Market shopping and referrals are open to everyone; home delivery covers ZIP codes 98074 and 98075.",
    address: "179 1st Ave SE, Issaquah, WA 98027", phone: "(425) 392-4123",
    hours: "Varies by week, check the calendar or call", website: "https://issaquahfoodbank.org",
    source: "foodBank211", checked: "2026-10-21"
  },
  {
    id: "hopelink", type: "organization", name: "Hopelink",
    topics: ["Food", "Legal & Safety"],
    summary: "Food, emergency financial help, energy assistance, housing, and employment services for residents of east and north King County.",
    address: "", phone: "(425) 869-6000", hours: "", website: "https://www.hopelink.org",
    source: "redmondFunding", checked: "2026-10-21"
  },
  {
    id: "sammamish-friends", type: "organization", name: "Sammamish Friends",
    topics: ["Volunteer", "Seniors", "Recreation"],
    summary: "Local volunteer nonprofit focused on community and the environment. Runs Sammamish Walks and Sammamish Seniors.",
    address: "", phone: "", hours: "", website: "",
    source: "sammamishFriends", checked: "2026-10-21"
  },
  {
    id: "friends-of-youth", type: "organization", name: "Friends of Youth",
    topics: ["Youth & Family", "Health & Counseling"],
    summary: "Services for young people on the Eastside: homeless youth and young adult services and behavioral health care.",
    address: "", phone: "(425) 869-6490", hours: "Youth drop-in line", website: "https://www.friendsofyouth.org",
    source: "kingCountyFind", checked: "2026-10-21"
  },
  {
    id: "lifewire", type: "organization", name: "LifeWire",
    topics: ["Legal & Safety"],
    summary: "Support for survivors of domestic violence: advocacy, safety planning, and housing stability help.",
    address: "", phone: "1-800-827-8840", hours: "", website: "https://www.lifewire.org",
    source: "redmondFunding", checked: "2026-10-21"
  },
  {
    id: "kindering", type: "organization", name: "Kindering",
    topics: ["Youth & Family"],
    summary: "Early intervention for young children with developmental needs, plus Families in Transition support for families facing homelessness.",
    address: "", phone: "", hours: "", website: "https://kindering.org",
    source: "bellevueFunding", checked: "2026-10-21"
  },

  /* ---------------- PROGRAMS ---------------- */
  {
    id: "senior-program", type: "program", name: "Senior Program at Beaver Lake Lodge",
    topics: ["Seniors"],
    summary: "A weekly city program for older adults that about 200 residents attend each week. Ask the Senior Human Services Coordinator about schedules.",
    address: "Beaver Lake Lodge, Sammamish, WA", phone: "(425) 295-0579",
    hours: "Weekly", website: "https://www.sammamish.us/news/sammamish-101-human-services/",
    image: "assets/img/sammamish-commons-winter.jpg", imageAlt: "Sammamish Commons in winter under a clear blue sky",
    source: "cityHumanServices", checked: "2026-10-21"
  },
  {
    id: "sammamish-walks", type: "program", name: "Sammamish Walks",
    topics: ["Recreation", "Seniors"],
    summary: "Group walks around Sammamish led by volunteers from Sammamish Friends. A free way to stay active and meet neighbors.",
    address: "", phone: "", hours: "", website: "",
    source: "sammamishFriends", checked: "2026-10-21"
  },
  {
    id: "library-tutors", type: "program", name: "Tutors & Reading Buddies",
    topics: ["Learning", "Youth & Family"],
    summary: "Free homework help and reading practice for students at Sammamish Library.",
    address: "825 228th Ave SE, Sammamish, WA 98075", phone: "(425) 392-3130",
    hours: "See KCLS event calendar", website: "https://kcls.org/sammamish",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "teens-around-the-fire", type: "program", name: "Teens Around the Fire",
    topics: ["Youth & Family"],
    summary: "A relaxed hangout space for teens at Sammamish Library.",
    address: "825 228th Ave SE, Sammamish, WA 98075", phone: "",
    hours: "See KCLS event calendar", website: "https://kcls.org/sammamish",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "ell-classes", type: "program", name: "English Language Learner Classes",
    topics: ["Learning"],
    summary: "Free classes and conversation practice (Talk Time) for adults learning English.",
    address: "825 228th Ave SE, Sammamish, WA 98075", phone: "(425) 392-3130",
    hours: "See KCLS event calendar", website: "https://kcls.org/sammamish",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "ymca-youth", type: "program", name: "YMCA Youth & Teen Programs",
    topics: ["Youth & Family", "Recreation"],
    summary: "Youth sports, swim lessons, and teen and tween drop-in activities at the Community & Aquatic Center.",
    address: "Sammamish Commons, 228th Ave SE, Sammamish, WA 98075", phone: "",
    hours: "See YMCA schedule", website: "https://www.seattleymca.org",
    image: "assets/img/community-center-day.jpg", imageAlt: "Sammamish Community and Aquatic Center on a sunny day",
    source: "aquaticCenter", checked: "2026-10-21"
  },

  /* ---------------- SERVICES ---------------- */
  {
    id: "crosspath", type: "service", name: "CrossPath Counseling",
    topics: ["Health & Counseling", "Youth & Family"],
    summary: "Counseling for children, youth, and families through a city partnership that started in 2008. Based at Sammamish Town Center.",
    address: "Town Center, Lower Commons Park area, Sammamish, WA", phone: "",
    hours: "", website: "",
    source: "hoodline", checked: "2026-10-21"
  },
  {
    id: "211-line", type: "service", name: "2-1-1 Community Information Line",
    topics: ["Food", "Legal & Safety", "Health & Counseling"],
    summary: "Free referrals to local help with housing, food and clothing, legal aid, utility bills, and health care. Dial 2-1-1, or use the toll-free number if 2-1-1 doesn't connect.",
    address: "", phone: "2-1-1 or 1-800-621-4636", hours: "", website: "https://wa211.org",
    source: "cityServices", checked: "2026-10-21"
  },
  {
    id: "elap", type: "service", name: "Free Legal Advice (Eastside Legal Assistance Program)",
    topics: ["Legal & Safety"],
    summary: "Advice clinics with volunteer attorneys, consultations for domestic violence survivors, and help with simple legal documents.",
    address: "", phone: "(425) 747-7274", hours: "", website: "https://elap.org",
    source: "bellevueFunding", checked: "2026-10-21"
  },
  {
    id: "energy-assistance", type: "service", name: "Energy & Emergency Bill Assistance",
    topics: ["Food", "Legal & Safety"],
    summary: "Help paying heating and utility bills, plus emergency financial assistance, through Hopelink.",
    address: "", phone: "(425) 869-6000", hours: "", website: "https://www.hopelink.org",
    source: "redmondFunding", checked: "2026-10-21"
  },
  {
    id: "tech-help", type: "service", name: "Library Tech Help",
    topics: ["Learning", "Seniors"],
    summary: "One-on-one help with phones, computers, email, and online forms at Sammamish Library.",
    address: "825 228th Ave SE, Sammamish, WA 98075", phone: "(425) 392-3130",
    hours: "See KCLS event calendar", website: "https://kcls.org/sammamish",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "immigrant-resources", type: "service", name: "Immigrant & Refugee Resources",
    topics: ["Legal & Safety", "Civic Life"],
    summary: "City-collected information and referrals for immigrant and refugee residents, including legal help and community connections.",
    address: "801 228th Ave SE, Sammamish, WA 98075", phone: "(425) 295-0500",
    hours: "Mon–Fri, 8:30 am–5:00 pm", website: "https://www.sammamish.us/our-community/services/",
    source: "cityServices", checked: "2026-10-21"
  },

  /* ---------------- EVENTS ----------------
     "recur" lets the website calculate the next date automatically:
       { weekdays: [n,...] 0=Sun..6=Sat, nth: [1,3] which weeks of the month (optional), time: "6:30 pm" }
     "date" is used for one-time events (YYYY-MM-DD).
  */
  {
    id: "council-meeting", type: "event", name: "City Council Regular Meeting",
    topics: ["Civic Life"],
    summary: "Open to the public, with up to three minutes per person for public comment. Agendas are posted the Tuesday before.",
    address: "City Hall, 801 228th Ave SE, Sammamish, WA 98075",
    recur: { weekdays: [2], nth: [1, 3], time: "6:30 pm" }, when: "1st & 3rd Tuesdays, 6:30 pm",
    website: "https://www.sammamish.us/news/events/2026-city-council-meetings/",
    source: "cityCouncil2026", checked: "2026-10-21"
  },
  {
    id: "council-study", type: "event", name: "City Council Study Session",
    topics: ["Civic Life"],
    summary: "Council members discuss upcoming topics in detail. Open to the public.",
    address: "City Hall, 801 228th Ave SE, Sammamish, WA 98075",
    recur: { weekdays: [2], nth: [2], time: "6:30 pm" }, when: "2nd Tuesday, 6:30 pm",
    website: "https://www.sammamish.us/news/events/2026-city-council-meetings/",
    source: "cityCouncil2026", checked: "2026-10-21"
  },
  {
    id: "friends-library", type: "event", name: "Friends of the Sammamish Library Meeting",
    topics: ["Learning", "Volunteer"],
    summary: "Monthly meeting of the volunteer group that supports the library. New members welcome.",
    address: "Sammamish Library, 825 228th Ave SE, Sammamish, WA 98075",
    recur: { weekdays: [4], nth: [1], time: "6:15 pm" }, when: "1st Thursday, 6:15 pm",
    website: "https://kcls.org/sammamish",
    source: "kcls", checked: "2026-10-21"
  },
  {
    id: "youth-chess", type: "event", name: "Youth Chess Club",
    topics: ["Youth & Family", "Learning"],
    summary: "Drop-in chess for kids and teens at the library. All skill levels.",
    address: "Sammamish Library, 825 228th Ave SE, Sammamish, WA 98075",
    recur: { weekdays: [2], nth: [1, 3, 5], time: "6:00–8:00 pm" }, when: "1st, 3rd & 5th Tuesdays, 6–8 pm",
    website: "https://kcls.org/sammamish",
    source: "burbioLibrary", checked: "2026-10-21"
  },
  {
    id: "diwali-bazaar", type: "event", name: "Sammamish Diwali Bazaar",
    topics: ["Civic Life", "Recreation"],
    summary: "A festival market with Diwali pooja items, jewelry, and clothing vendors.",
    address: "Pine Lake Community Center, 21333 SE 20th St, Sammamish, WA",
    date: "2026-11-01", when: "Sunday, November 1, 2026",
    website: "https://www.thecraftmap.com/fair/sammamish-diwali-bazaar-2026-sammamish-wa",
    source: "diwaliBazaar", checked: "2026-10-21"
  },
  {
    id: "farmers-market", type: "event", name: "Sammamish Farmers Market",
    topics: ["Food", "Recreation"],
    summary: "Local produce, handmade goods, and about six food trucks every Wednesday in season. The 2026 season has ended. It returns in May 2027.",
    address: "Sammamish Commons, 801 228th Ave SE, Sammamish, WA 98075",
    season: { startMonth: 5, endMonth: 9 }, recur: { weekdays: [3], time: "4:00–8:00 pm" }, when: "Wednesdays, 4–8 pm, May–September",
    website: "https://sammamishindependent.com/2026/05/sammamish-farmers-market-opens-for-2026/",
    source: "farmersMarket2026", checked: "2026-10-21"
  },

  /* ---------------- RESOURCES ---------------- */
  {
    id: "988", type: "resource", name: "988 Suicide & Crisis Lifeline",
    topics: ["Health & Counseling"], urgent: true,
    summary: "Call or text 988 any time, day or night, for free and confidential support in a mental health or emotional crisis.",
    phone: "988", hours: "24/7", website: "https://988lifeline.org",
    source: "lifeline988", checked: "2026-10-21"
  },
  {
    id: "911", type: "resource", name: "Emergency: 911",
    topics: ["Legal & Safety"], urgent: true,
    summary: "For police, fire, or medical emergencies where someone is in danger right now.",
    phone: "911", hours: "24/7", website: "",
    source: "cityContact", checked: "2026-10-21"
  },
  {
    id: "king-county-find", type: "resource", name: "King County Find Human Services",
    topics: ["Food", "Health & Counseling", "Legal & Safety"],
    summary: "Online search for food banks, shelters, clinics, and other services across King County.",
    website: "https://find-human-services.kingcounty.gov/",
    source: "kingCountyFind", checked: "2026-10-21"
  },
  {
    id: "wa211-search", type: "resource", name: "Washington 211 Online Search",
    topics: ["Food", "Legal & Safety"],
    summary: "Statewide directory of social services that you can search by ZIP code (try 98074 or 98075).",
    website: "https://wa211.org", source: "wa211", checked: "2026-10-21"
  },
  {
    id: "city-human-services", type: "resource", name: "City Human Services Guide",
    topics: ["Seniors", "Health & Counseling", "Food"],
    summary: "The city's guide to its nonprofit partners: senior services, food and housing help, mental health, and legal assistance.",
    phone: "(425) 295-0579", website: "https://www.sammamish.us/our-community/services/",
    source: "cityServices", checked: "2026-10-21"
  },
  {
    id: "sammamish-landing", type: "resource", name: "Sammamish Landing Park",
    topics: ["Recreation"], place: true,
    summary: "Lakefront park on Lake Sammamish with a swim dock, beach, and picnic shelter, right on the East Lake Sammamish Trail. Parking is across the road.",
    address: "4607 East Lake Sammamish Pkwy NE, Sammamish, WA 98074",
    website: "https://sammamishwa.gov/our-community/recreation/parks-trails/sammamish-landing-park/",
    image: "assets/img/sammamish-landing.jpg", imageAlt: "Swimmers on the dock at Sammamish Landing Park on a sunny day, with Lake Sammamish behind",
    source: "cityLanding", checked: "2026-10-21"
  },
  {
    id: "sammamish-commons", type: "resource", name: "Sammamish Commons",
    topics: ["Civic Life", "Recreation"], place: true,
    summary: "The civic heart of the city: City Hall, the library, the Community & Aquatic Center, and the plaza where the farmers market is held.",
    address: "801 228th Ave SE, Sammamish, WA 98075",
    website: "https://www.sammamish.us",
    image: "assets/img/commons-plaza-night.jpg", imageAlt: "Sammamish Commons plaza at night, lit by tall street lamps",
    source: "farmersMarket2026", checked: "2026-10-21"
  },
  {
    id: "volunteer-food-bank", type: "resource", name: "Volunteer: Issaquah Food & Clothing Bank",
    topics: ["Volunteer", "Food"], volunteer: true,
    summary: "Help sort donations and stock the market. Students can earn service hours.",
    website: "https://issaquahfoodbank.org", source: "foodBankHours", checked: "2026-10-21"
  },
  {
    id: "volunteer-friends-library", type: "resource", name: "Volunteer: Friends of the Sammamish Library",
    topics: ["Volunteer", "Learning"], volunteer: true,
    summary: "Support library programs and book sales. Meets the first Thursday of each month.",
    website: "https://kcls.org/sammamish", source: "kcls", checked: "2026-10-21"
  },
  {
    id: "volunteer-sammamish-friends", type: "resource", name: "Volunteer: Sammamish Friends",
    topics: ["Volunteer", "Seniors"], volunteer: true,
    summary: "Lead a walk, help with senior programs, or join environmental projects.",
    website: "", source: "sammamishFriends", checked: "2026-10-21"
  }
];

window.PHOTO_CREDITS = [
  { file: "sammamish-landing.jpg", subject: "Sammamish Landing Park", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "sammamish-library.jpg", subject: "Sammamish Library at dusk", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "community-center-dusk.jpg", subject: "Sammamish Community & Aquatic Center at dusk", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "community-center-day.jpg", subject: "Sammamish Community & Aquatic Center", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "sammamish-commons.jpg", subject: "Sammamish Commons building", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "sammamish-commons-winter.jpg", subject: "Sammamish Commons in winter", credit: "Web photo supplied by the team. Original photographer to be confirmed." },
  { file: "commons-plaza-night.jpg", subject: "Sammamish Commons plaza at night", credit: "Web photo supplied by the team. Original photographer to be confirmed." }
];
