'use strict'

const loginConfirm = `Bonjour ${req.query['name']} avec l'e-mail ${req.query['email']}, bienvenue sur le site !`

console.log('loginConfirm : ' + loginConfirm);