const got = require('got');
const cheerio = require('cheerio');
const colors = require('colors');
const Table = require('cli-table');

const states = require('./states');
const URLS = require('./urls');

const table = new Table({
    head: [
        'RANK'.yellow.bold,
        'TEAM'.yellow.bold,
        'SCORE'.yellow.bold
    ],
    colWidths: [10, 20, 10]
});

const pool_matches = [];

const scrap = () => {
    got(URLS.URLS_DATA_SCORE)
        .then(response => {
            const $ = cheerio.load(response.body);

            $('table').find('tr').each((i, el) => {
                const rank = $(el).find('td').eq(0).text();
                const team = $(el).find('td').eq(1).text();
                const score = $(el).find('td').eq(2).text();
                const state = states[i];
                const obj = {};


                obj[state] = {
                    state: states[i],
                    rank: rank,
                    team: team,
                    score: score
                };

                if (rank !== "Rank") {
                    table.push(
                        [rank.magenta.bold.underline, team.green.bold.underline, score.cyan.bold]
                    );
                }

                pool_matches.push(obj);
            });
            console.log(table.toString());
        })
        .catch(error => {
            console.log("OOPS!!" + error.response.body);
        });
}

module.exports = scrap();
