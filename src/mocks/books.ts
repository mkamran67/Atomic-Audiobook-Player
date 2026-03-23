import { bookCover, avatarPlaceholder } from '../utils/placeholder';

export const myBooks = [
  {
    id: 1,
    title: "Explorations Colony",
    author: "Nathan Hystad",
    genre: "Fantasy",
    cover: bookCover("Explorations Colony"),
    rating: 4,
    color: "bg-cyan-100"
  },
  {
    id: 2,
    title: "Lumen: The Ancient Me...",
    author: "Christoph Marzi",
    genre: "Novel",
    cover: bookCover("Lumen The Ancient"),
    rating: 3,
    color: "bg-purple-100"
  },
  {
    id: 3,
    title: "Dragon Fire Academy",
    author: "Rachel Janes",
    genre: "Academic Novel",
    cover: bookCover("Dragon Fire Academy"),
    rating: 5,
    color: "bg-emerald-100"
  },
  {
    id: 4,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    cover: bookCover("The Midnight Library"),
    rating: 5,
    color: "bg-rose-100"
  },
  {
    id: 5,
    title: "Neon Gods",
    author: "Katee Robert",
    genre: "Dark Romance",
    cover: bookCover("Neon Gods"),
    rating: 4,
    color: "bg-orange-100"
  },
  {
    id: 6,
    title: "House of Salt and Sorrows",
    author: "Erin A. Craig",
    genre: "Gothic Fantasy",
    cover: bookCover("House of Salt and Sorrows"),
    rating: 4,
    color: "bg-sky-100"
  },
  {
    id: 7,
    title: "The Atlas Six",
    author: "Olivie Blake",
    genre: "Dark Academia",
    cover: bookCover("The Atlas Six"),
    rating: 3,
    color: "bg-amber-100"
  },
  {
    id: 8,
    title: "Iron Flame",
    author: "Rebecca Yarros",
    genre: "Epic Fantasy",
    cover: bookCover("Iron Flame"),
    rating: 5,
    color: "bg-red-100"
  }
];

export const popularAuthors = [
  {
    id: 1,
    name: "Lauren Weisberger",
    avatar: avatarPlaceholder("Lauren Weisberger")
  },
  {
    id: 2,
    name: "Gregory David Roberts",
    avatar: avatarPlaceholder("Gregory David Roberts")
  },
  {
    id: 3,
    name: "Oksana Robsky",
    avatar: avatarPlaceholder("Oksana Robsky")
  },
  {
    id: 4,
    name: "Zadie Smith",
    avatar: avatarPlaceholder("Zadie Smith")
  }
];

export const keepReading = [
  {
    id: 1,
    title: "Sherwood",
    author: "Meagan Spooner",
    cover: bookCover("Sherwood", 100, 150),
    progress: 80,
    currentPage: "80/210",
    duration: "3:32:32",
    currentChapter: 10,
    totalChapters: 12,
  },
  {
    id: 2,
    title: "Awakening Bloodline",
    author: "Tara Rice",
    cover: bookCover("Awakening Bloodline", 100, 150),
    progress: 65,
    currentPage: "212/235",
    duration: "1:45:35",
    currentChapter: 12,
    totalChapters: 18,
  },
  {
    id: 3,
    title: "The Magician's Ruins",
    author: "Alexa Padgett",
    cover: bookCover("The Magicians Ruins", 100, 150),
    progress: 55,
    currentPage: "174/255",
    duration: "2:21:14",
    currentChapter: 7,
    totalChapters: 12,
  },
  {
    id: 4,
    title: "Sea Gave Back",
    author: "Adrienne Yong",
    cover: bookCover("Sea Gave Back", 100, 150),
    progress: 70,
    currentPage: "244/337",
    duration: "1:21:10",
    currentChapter: 11,
    totalChapters: 16,
  }
];

export const stats = {
  readBooks: 94,
  readAuthors: 24,
  areRead: 12,
  bookPages: "820/1216"
};
