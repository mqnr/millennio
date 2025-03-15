# Millennio

Millennio is a Discord bot for school-related purposes. Most notably, it automated the extraction of Zoom meeting URLs from event descriptions in our Canvas schedules--which was a consistently tedious daily task during our online classes in the pandemic.

After developing the bot, meeting URLs would be sent at their appropiate time to a Discord channel, pinging all of us. It was a great time-saver and served us well throughout two semesters. 

## Removed (and re-added) names

When first pushing this to GitHub back in 2022, I stripped out all names that could lead back to our high school (such as function names with the name on it and such), likely out of an abundance of caution. Looking back, it's kind of silly opsec, so I undid all that.

## Feature overview

- Automatic and on-demand Zoom meeting URL retrieval
- Notifications of all incoming announcements
- Display of the list of people enrolled in the configured courses
- Quick retrieval of class schedule

## Installation

```
git clone https://github.com/mqnr/millennio.git
cd millennio
npm install
npm run build
npm start
```

## License

Distributed under the [MIT](https://spdx.org/licenses/MIT.html) license.
