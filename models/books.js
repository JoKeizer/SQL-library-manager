const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model{};
    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please Enter a title!'
                },
            },
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please Enter an Author!',
                },
            },
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER,

    }, {sequelize});
    return Book;
}