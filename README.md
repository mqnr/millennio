# Millennio

Millennio is a Discord bot for school-related purposes. Namely, it made it easy for me and my friends to extract Zoom meeting URLs from event descriptions in our schedules. Previously, this was a task we did manually, for every single class. These meeting links would frequently change; as a result, this was something we needed to repeat several times a day, much to our chagrin.

After the development of the bot, meeting URLs would instead be sent automatically at their starting time to a Discord channel, pinging all of us. Millennio makes this easy: the schedule is configured through a single map object that establishes relationships between cronstrings and the events they are to trigger. The bot was a great time-saver for all of us, serving us well during two semesters. 

# Removed names

Millennio was tightly coupled to our specific school. Initially, I never planned on publishing it on GitHub. However, I decided it was worthwhile to archive it, since it was one of my first software projects after I learned to program. Before publishing, I stripped out all names associated with our school. A cursory search of the `src` folder indicates 327 instances of this. Therefore, it is in an entirely unrunnable state. Someone else getting it to work for another school would be a time-consuming undertaking requiring a thorough read of the source code. Generalizing the code so that it could work with any school would be an even more effortful endeavor. I likely would have done this myself, had I used the program for another semester, but I have already graduated high school. The code is, then, only provided as an archive.

# Feature overview

- Automatic and on-demand Zoom meeting URL retrieval
- Notifications of all incoming announcements
- Display of the list of people enrolled in the configured courses
- Quick retrieval of class schedule

# Installation

```
git clone https://github.com/mzacuna/millennio.git
cd millennio
npm install
npm run build
npm start
```

## License

Distributed under the [MIT](https://spdx.org/licenses/MIT.html) license.
