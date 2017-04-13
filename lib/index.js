const got = require('got');
const cheerio = require('cheerio');
const colors = require('colors');
const Table = require('cli-table');

const states = require('./states');
const URLS = require('./urls');

const table = new Table({
    head: [
        'PLAYER1'.yellow.bold,
        'PLAYER2'.yellow.bold,
        'WINNER'.yellow.bold,
        'REFEREE'.yellow.bold,
        'INITIATEDBY'.yellow.bold
    ],
    colWidths: [ 40, 40, 25, 25, 25]
});

const pool_matches = [];

const scrap = () => {
    got(URLS.URLS_DATA)
        .then(response => {
            const $ = cheerio.load(response.body);
            const size = Object.keys(states).length;

            $('table').find('tr').each((i, el) => {
                if (size >= ++i) {
                    const managerId = $(el).find('td').eq(0).text();
                    const player1 = $(el).find('td').eq(1).text();
                    const player2 = $(el).find('td').eq(2).text();
                    const winner = $(el).find('td').eq(3).text();
                    const referee = $(el).find('td').eq(4).text();
                    const initiatedBy = $(el).find('td').eq(5).text();

                    const state = states[i];
                    const obj = {};

                    obj[state] = {
                        state: states[i],
                        managerId: managerId,
                        player1: player1,
                        player2: player2,
                        winner: winner,
                        referee: referee,
                        initiatedBy: initiatedBy
                    };

                    table.push(
                        [player1.magenta.bold.underline, player2.green.bold.underline, winner.red.bold, referee.blue.bold, initiatedBy.green.bold]
                    );

                    pool_matches.push(obj);
                }
            });
            console.log(table.toString());
        })
        .catch(error => {
            console.log("OOPS!!" + error.response.body);
        });
}

module.exports = scrap();
