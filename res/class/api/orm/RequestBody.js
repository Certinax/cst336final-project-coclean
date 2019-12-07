"use strict";
var RequestBody = {
    post: {
        create: {
            user: function (name, surname, email, password) {
                return {
                    name: name,
                    surname: name,
                    email: email,
                    password: password,
                };
            },
            collective: function (name, email) {
                return {
                    name: name,
                    email: email,
                };
            },
            chore: function (name, title, description, startDate, frequency) {
                return {
                    name: name,
                    title: title,
                    description: description,
                    startDate: startDate,
                    frequency: frequency,
                };
            },
        },
    },
    put: {
        update: {
            user: function (oldPassword, name, surname, email, newPassword) {
                return {
                    oldPassword: oldPassword,
                    name: name,
                    surname: name,
                    newPassword: newPassword,
                };
            },
            collective: function (name, email) {
                return {
                    name: name,
                    email: email,
                };
            },
            chore: function (name, title, description, startDate, frequency) {
                return {
                    name: name,
                    title: title,
                    description: description,
                    startDate: startDate,
                    frequency: frequency,
                };
            },
        }
    },
    delete: {}
};
module.exports = RequestBody;
