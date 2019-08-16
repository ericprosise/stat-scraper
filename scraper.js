let cheerio = require('cheerio');
let axios = require('axios');
let rushingReceivingHtml = require('./rushingReceiving');

const url = 'https://www.pro-football-reference.com/players/S/StarBa00.htm';

//let $ = cheerio.load('https://www.pro-football-reference.com/players/S/StarBa00.htm');

var player = {
    playerInformation: {},
    passingStats: [],
    careerPassingStats: {},
    passingPlayoffStats: [],
    rushingReceivingStats: []
};

const passingStats = [
    'year_id',
    'age',
    'team',
    'pos',
    'uniform_number',
    'g',
    'gs',
    'qb_rec',
    'pass_cmp',
    'pass_att',
    'pass_cmp_perc',
    'pass_yds',
    'pass_td',
    'pass_td_perc',
    'pass_int',
    'pass_int_perc',
    'pass_long',
    'pass_yds_per_att',
    'pass_adj_yds_per_att',
    'pass_yds_per_cmp',
    'pass_yds_per_g',
    'pass_rating',
    'pass_sacked',
    'pass_sacked_yds',
    'pass_net_yds_per_att',
    'pass_adj_net_yds_per_att',
    'pass_sacked_perc',
    'comebacks',
    'gwd',
    'av',
];

const rushingReceivingStats = [
    'year_id',
    'age',
    'team',
    'pos',
    'uniform_number',
    'g',
    'gs',
    'rush_att',
    'rush_yds',
    'rush_td',
    'rush_long',
    'rush_yds_per_att',
    'rush_yds_per_g',
    'rush_att_per_g',
    'rec',
    'rec_yds',
    'rec_yds_per_rec',
    'rec_td',
    'rec_long',
    'rec_per_g',
    'rec_yds_per_g',
    'touches',
    'yds_per_touch',
    'yds_from_scrimmage',
    'rush_receive_td',
    'fumbles'
];

const fetchData = async () => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
};

const getResults = async () => {
    var $ = await fetchData();
    // }

    // axios.get(url)
    //     .then(response => {
    //         const $ = cheerio.load(response.data);

    var body = $('body');

    body.find('*')
        .contents()
        .filter(function () { return this.type == 'comment' })
        .remove();

    $ = cheerio.load(body.html());

    //Get Player Image
    const pic = $('.media-item');
    const image = $(pic).find('img')[0];
    const source = $(image).attr('src');
    player.playerInformation.imageSrc = source;

    //Get Player Person Info
    const playerInformation = $('div[itemtype="https://schema.org/Person"]');
    player.playerInformation.name = $(playerInformation).find('h1[itemprop=name]').text();

    $(playerInformation).find('p').each((i, info) => {
        switch (i) {
            case 0:
                player.playerInformation.fullName = $(info).slice(i, 1).eq(0).find('strong').text();
                break;
            case 1:
                player.playerInformation.position = $(info).slice(0, 1).eq(0).eq(0).text();
                break;
            case 2:
                player.playerInformation.height = $(info).slice(0, 1).eq(0).find('[itemprop=height]').text();
                player.playerInformation.weight = $(info).slice(0, 1).eq(0).find('[itemprop=weight]').text();
                break;
            case 3:
                player.playerInformation.birthDate = $(info).slice(0, 1).eq(0).find('[itemprop=birthDate]').text();
                player.playerInformation.birthPlace = $(info).slice(0, 1).eq(0).find('[itemprop=birthPlace]').text();
                break;
            case 5:
                player.playerInformation.college = $(info).slice(0, 1).eq(0).text();
                break;


        }
    });


    //Passing Table
    const passingTable = $('div#div_passing table tbody tr');
    let yearPassingRecord = {};
    passingTable.each((i, row) => {
        passingStats.forEach((stat) => {
            yearPassingRecord = {
                ...yearPassingRecord,
                [stat]: $(row).find(`[data-stat=${stat}]`).text()
            };
        });

        player.passingStats.push(yearPassingRecord);

    });

    const careerPassing = $('div#div_passing table tfoot tr');
    let careerPassingRecord = {};
    careerPassing.each((i, row) => {
        passingStats.forEach((stat) => {
            careerPassingRecord = {
                ...careerPassingRecord,
                [stat]: $(row).find(`[data-stat=${stat}]`).text()
            };
        });

        player.careerPassingStats = Object.assign({}, careerPassingRecord);

    });


    $ = cheerio.load(rushingReceivingHtml);

    //Rushing/Receiving Table
    //There's an error with this I believe due to PFR having commented code that this is matching on
    const rushingReceivingTable = $('table#rushing_and_receiving tbody tr');
    // const rushingReceivingTable = $('div#div_rushing_and_receiving table#rushing_and_receiving tbody tr');
    let yearRushingReceivingRecord = {};
    rushingReceivingTable.each((i, row) => {
        rushingReceivingStats.forEach((stat) => {
            yearRushingReceivingRecord = {
                ...yearRushingReceivingRecord,
                [stat]: $(row).find(`[data-stat=${stat}]`).text()
            };
        });

        player.rushingReceivingStats.push(yearRushingReceivingRecord);

    });

    return {
        player: player
    }
}

module.exports = getResults;

