'use strict';
const Sequelize = require('sequelize');
const moment = require('moment'); // used for formatting dates

module.exports = (sequelize) => {
    class Article extends Sequelize.Model {
// add an instance method (i.e. non-static) to format the dates:
        publishedAt() {
            const date = moment(this.createdAt)
                .format('MMMM D, YYYY, h:mma'); // is the final 'a' correct?
            return date;
        }
// the above method is straightforwardly accessed in views/articles/by_line
        shortDescription() {
            const shortDesc = this.body.length > 200 ? this.body.substring(0,200) + '...' : this.body;
            return shortDesc;
        }
// the above method is likewise accessed in views/articles/index
        veryShortDescription() {
            const shortDesc = this.body.length > 50 ? this.body.substring(0,50) + '...' : this.body;
            return shortDesc;
        }
// and finally, that one's in by_line again
    }
    Article.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"Title" is required'
                }
            }
        },
        author: Sequelize.STRING,
        body: Sequelize.TEXT
    }, {sequelize});
    return Article;
}