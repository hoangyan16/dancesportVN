const contentCompetitionRouter           = require('./contentCompetition')
const athleteRouter                      = require('./athlete');
const registrationRouter                 = require('./registration');
const resourceRouter                     = require('./resource');
const tournamentRouter                   = require('./tournament');
const tournamentDetailRouter             = require('./tournamentDetail');
const agesRouter                         = require('./age');
const danceTypeRouter                    = require('./danceType');
const danceRouter                        = require('./dance');
const gradeRouter                        = require('./grade');
const feeRouter                          = require('./fee');
const themesRouter                       = require('./themes');
const newsRouter                         = require('./news');
const userRouter                         = require('./user');
const formalityRouter                    = require('./formality');
const settingRouter                      = require('./setting');
const contactRouter                      = require('./contact');
const commentRouter                      = require('./comment');
const mcRouter                           = require('./mc');
const unitRouter                         = require('./unit');
const feeDetailRouter                    = require('./fee_details');


function route (app){
    app.use('/api/v1/content_competition',contentCompetitionRouter),
    app.use('/api/v1/athletes',athleteRouter),
    app.use('/api/v1/registration',registrationRouter),
    app.use('/api/v1/resources',resourceRouter),
    app.use('/api/v1/tournaments',tournamentRouter),
    app.use('/api/v1/tournament_details',tournamentDetailRouter)
    app.use('/api/v1/ages', agesRouter),
    app.use('/api/v1/dance-types', danceTypeRouter),
    app.use('/api/v1/dances', danceRouter),
    app.use('/api/v1/grades', gradeRouter),
    app.use('/api/v1/fees', feeRouter),
    app.use('/api/v1/themes', themesRouter),
    app.use('/api/v1/news', newsRouter),
    app.use('/api/v1/users', userRouter),
    app.use('/api/v1/formality', formalityRouter),
    app.use('/api/v1/settings', settingRouter),
    app.use('/api/v1/contacts', contactRouter),
    app.use('/api/v1/comments', commentRouter),
    app.use('/api/v1/mc', mcRouter),
    app.use('/api/v1/units', unitRouter),
    app.use('/api/v1/fee_details', feeDetailRouter)
};

module.exports= route;