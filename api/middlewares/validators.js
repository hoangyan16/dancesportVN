const {oneOf,check}                        = require('express-validator');


// Athlete
let validateAthlete = () => {
  return [ 
    check('full_name_one', 'full_name_one does not Empty').not().isEmpty(),
    check('full_name_one', 'full_name_one more than 5 degits').escape().trim().isLength({ min: 5}),
    check('full_name_two', 'full_name_two does not Empty').not().isEmpty(),
    check('full_name_two', ' full_name_two should be form of Email').escape().trim().isLength({ min: 5}),
    check('date_of_birth_one', 'date_of_birth_one is date').notEmpty().trim().isDate(),
    check('date_of_birth_two', 'date_of_birth_two is date').notEmpty().trim().isDate(),
    check('email', 'Email does not Empty').not().isEmpty(),
    check('email', 'Invalid Email').escape().trim().isEmail(),
    check('mobile','Phone does not Empty').not().isEmpty(),
    check('mobile','Phone does not Empty').isNumeric(),
    check('user_name', 'user_name does not Empty').not().isEmpty(),
    check('user_name', 'user_name more than 5 degits').escape().trim().isLength({ min: 5}),
    check('password', 'Password more than 8 degits').trim().isLength({ min: 8}),
    check('password', 'Password should have number and words').isAlphanumeric(),
  ]; 
}

// ContentCompetition
let validateContentCompetition=()=>{
  return[
      check('symbol').exists(),
      check('symbol', 'Invalid does not Empty').not().isEmpty(),
      check('name').exists(),
      check('grade_id','grade_id does not Empty').not().isEmpty(),
      check('age_id','age_id does not Empty').not().isEmpty(),
      check('minimum_athletes','minimum_athletes does not Empty').not().isEmpty(),
    ];
}

// Roles

let validateRegistration = () => {
    return [ 
        check('email', 'Invalid does not Empty').not().isEmpty(),
        check('email', 'Invalid Email').escape().trim().isEmail(),
        check('mobile','Phone does not Empty').not().isEmpty(),
        check('mobile','Phone does not Empty').isNumeric(),
    ]; 
}

// Resources

// let validateResources = () => {
//     return [ 
//         check('url', 'url must be correct form').isURL(),
//     ]; 
// }

// Tournaments

let validateTournaments = () => {
    return [ 
        // check('name', 'Name does not Empty').not().isEmpty(),
        // // check('name', 'Name more than 3 degits').escape().trim().isLength({ min:3 }),
        // check('address', 'address does not Empty').not().isEmpty(),
        // check('currency_name', 'currency_name does not Empty').not().isEmpty(),
        // check('content', 'content does not Empty').not().isEmpty(),
    ]; 
}
let validateThemes = () => {
  return [ 
      check('name', 'name does not Empty').not().isEmpty(),
      check('name', 'name does not Empty').exists(),
  ]; 
}

let validateNews = () => {
  return [ 
      check('name', 'name does not Empty').not().isEmpty(),
      check('content_detail', 'content_detail does not Empty').not().isEmpty(),
  ]; 
}
// Users
let validateRegisterUser = () => {
  return [ 
    check('name', 'Name does not Empty').not().isEmpty(),
    check('name', 'Name more than 2 degits').escape().trim().isLength({ min: 2 }),
    check('user_name', 'UserName does not Empty').not().isEmpty(),
    check('user_name', 'UserName more than 6 degits').escape().trim().isLength({ min: 6 }),
    check('email', 'Email does not Empty').not().isEmpty(),
    check('email', ' Email should be form of Email').escape().trim().isEmail(),
    check('password', 'Password more than 8 degits').notEmpty().trim().isLength({ min:8 }),
    check('password', 'Password should have number and words').isAlphanumeric(),
  ]; 
}

let validateCheckLogin=()=>{
  return[
    oneOf([
      [
      check('user_name').exists(),
      check('user_name', 'Invalid does not Empty').not().isEmpty(),
      check('user_name', 'UserName more than 8 degits').escape().trim().isLength({ min: 8 }),
      check('user_name').exists(),
      check('user_name', 'Password more than 8 degits').trim().isLength({ min: 8}),
      check('user_name', 'Password should have number and words').isAlphanumeric(),
    ],
      check('access_token').exists()
    ]),
];
}


//ages
let validateAges = () => {
    return [ 
        check('name', 'Name does not Empty').not().isEmpty(),
        check('name', 'Name more than 2 degits').escape().trim(),
        check('start_age', 'StartAge is a number').isNumeric(),
        check('end_age', 'EndAge is a number').isNumeric(),
    ];
}

//dance_types
let validateDanceTypes = () => {
    return [ 
        check('name', 'Name does not Empty').not().isEmpty(),
        check('name', 'Name more than 2 degits').escape().trim(),
    ];
}

//dances
let validateDances = () => {
    return [ 
        check('name', 'Name does not Empty').not().isEmpty(),
        check('symbol', 'Symbol does not Empty').not().isEmpty(),
        check('dance_type_id', 'DanceTypesId does not Empty').not().isEmpty(),
    ]; 
}

//grades
let validateGrades = () => {
    return [ 
        check('name', 'Name does not Empty').not().isEmpty(),
        check('dance_id', 'DanceId does not Empty').not().isEmpty(),
        check('dance_type_id', 'DanceTypesId does not Empty').not().isEmpty(),


    ]; 
}
//fees
let validateFees = () => {
    return [
        check('name', 'Name does not Empty').not().isEmpty(),
        check('amount','Amount does not Empty').not().isEmpty(),
        check('amount', 'Amount is a number').isNumeric(), 
    ]
}

let validate = {
    validateAges: validateAges,
    validateDanceTypes: validateDanceTypes,
    validateDances : validateDances,
    validateGrades: validateGrades,
    validateFees: validateFees,
    validateAthlete: validateAthlete,
    // validateTournamentDetails: validateTournamentDetails,
    validateTournaments: validateTournaments,
    // validateResources: validateResources,
    validateRegistration: validateRegistration,
    validateThemes: validateThemes,
    validateNews: validateNews,
    validateContentCompetition:  validateContentCompetition,
    validateCheckLogin: validateCheckLogin,
    validateRegisterUser:validateRegisterUser
};

module.exports = {validate};