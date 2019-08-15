let cheerio = require('cheerio');
let axios = require('axios');

const url = 'https://www.pro-football-reference.com/players/S/StarBa00.htm';

//let $ = cheerio.load('https://www.pro-football-reference.com/players/S/StarBa00.htm');

var player = {
    playerInformation: {},
    passingStats: []
};

const fetchData = async () => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
};

const getResults = async () => {
    const $ = await fetchData();
    // }

    // axios.get(url)
    //     .then(response => {
    //         const $ = cheerio.load(response.data);
    const tableElems = $('div#div_passing table tbody tr');

    //Get Player Image
    const pic = $('.media-item');
    const image = $(pic).find('img')[0];
    const source = $(image).attr('src');
    player.playerInformation.imageSrc = source;

    //Get Player Person Info
    const playerInformation = $('div[itemtype="https://schema.org/Person"]');
    player.playerInformation.name = $(playerInformation).find('h1[itemprop=name]').text();

    $(playerInformation).find('p').each((i, info) => {
        console.log('i', i);
        if (i === 0)
            player.playerInformation.fullName = $(info).slice(i, 1).eq(0).find('strong').text();
    });

    tableElems.each((i, row) => {
        let yearRecord = {
            'year': $(row).find('[data-stat=year_id]').text(),
            'age': $(row).find('[data-stat=age]').text(),
            'team': $(row).find('[data-stat=team]').text(),
            'pos': $(row).find('[data-stat=pos]').text(),
            'uniform_number': $(row).find('[data-stat=uniform_number]').text(),
            'g': $(row).find('[data-stat=g]').text(),
            'gs': $(row).find('[data-stat=gs]').text(),
            'qb_rec': $(row).find('[data-stat=qb_rec]').text(),
            'pass_cmp': $(row).find('[data-stat=pass_cmp]').text(),
            'pass_att': $(row).find('[data-stat=pass_att]').text(),
            'pass_cmp_perc': $(row).find('[data-stat=pass_cmp_perc]').text(),
            'pass_yds': $(row).find('[data-stat=pass_yds]').text(),
            'pass_td': $(row).find('[data-stat=pass_td]').text(),
            'pass_td_perc': $(row).find('[data-stat=pass_td_perc]').text(),
            'pass_int': $(row).find('[data-stat=pass_int]').text(),
            'pass_int_perc': $(row).find('[data-stat=pass_int_perc]').text(),
            'pass_long': $(row).find('[data-stat=pass_long]').text(),
            'pass_yds_per_att': $(row).find('[data-stat=pass_yds_per_att]').text(),
            'pass_adj_yds_per_att': $(row).find('[data-stat=pass_adj_yds_per_att]').text(),
            'pass_yds_per_cmp': $(row).find('[data-stat=pass_yds_per_cmp]').text(),
            'pass_yds_per_g': $(row).find('[data-stat=pass_yds_per_g]').text(),
            'pass_rating': $(row).find('[data-stat=pass_rating]').text(),
            'pass_sacked': $(row).find('[data-stat=pass_sacked]').text(),
            'pass_sacked_yds': $(row).find('[data-stat=pass_sacked_yds]').text(),
            'pass_net_yds_per_att': $(row).find('[data-stat=pass_net_yds_per_att]').text(),
            'pass_adj_net_yds_per_att': $(row).find('[data-stat=pass_adj_net_yds_per_att]').text(),
            'pass_sacked_perc': $(row).find('[data-stat=pass_sacked_perc]').text(),
            'comebacks': $(row).find('[data-stat=comebacks]').text(),
            'gwd': $(row).find('[data-stat=gwd]').text(),
            'av': $(row).find('[data-stat=av]').text()
        }

        // player.passingStats.push(yearRecord);

    });
    console.log(player);
    return {
        player: player
    }
}

module.exports = getResults;

