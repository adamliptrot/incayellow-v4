const pluginRss = require("@11ty/eleventy-plugin-rss");
const { parseDate, allMonthNames, tagTemplate, imageList, heroTemplate, mediaDisplay } = require("./_source/assets/js/app/filters");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPlugin(pluginRss);

    eleventyConfig.addCollection("posts", (collection) => {
		return collection.getFilteredByGlob("_source/posts/**/*.md").sort((a, b) => {
            return a.date - b.date;
        })
    });
    eleventyConfig.addCollection("postsRev", (collection) => {
		return collection.getFilteredByGlob("_source/posts/**/*.md").sort((a, b) => {
            return b.date - a.date;
        })
    });
    eleventyConfig.addCollection("latestPosts", (collection) => {
        return collection.getFilteredByGlob("_source/posts/**/*.md").sort((a, b) => {
            return a.date - b.date;
        }).reverse().slice(0,5);
    });


    eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));

    eleventyConfig.addNunjucksFilter("heroTemplate", function(images){
        return heroTemplate(images);
    })

    eleventyConfig.addNunjucksFilter("imageList", function(images){
        return imageList(images);
    })

    eleventyConfig.addNunjucksFilter("mediaDisplay", function(images){
        return mediaDisplay(images);
    })

    eleventyConfig.addNunjucksFilter("tagTemplate", function(tags){
        return tagTemplate(tags);
    })

    eleventyConfig.addNunjucksFilter("sortAZ", function(arr) {
        return arr.sort(function (a, b) {
            if (a < b) return -1;
            else if (a > b) return 1;
            return 0;
        });
    });

    eleventyConfig.addNunjucksFilter("reverse", function(arr) {
        return arr.sort((a, b) => {
            return b.date - a.date;
        })
    });



    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }



    function getTheMonth(date) {
        var month = date.getMonth() + 1;
        return month < 10 ? '0' + month : '' + month;
    }

    function capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    eleventyConfig.addNunjucksFilter("getMonth", function(date) {
        return getTheMonth(date);
    });

    eleventyConfig.addNunjucksFilter("getDay", function(date) {
        return date.getDate();
    });

    eleventyConfig.addNunjucksFilter("getYear", function(date) {
        return date.getFullYear();
    });

    eleventyConfig.addNunjucksFilter("getMonthName", function(month, format) {
        return allMonthNames(format)[parseInt(month - 1)];
    });

    eleventyConfig.addNunjucksFilter('parseDate', function(stringDate, format) {
        //console.log(stringDate);
        return parseDate(stringDate, format);
    });

    // eleventyConfig.addNunjucksFilter('slugify', function(str) {
    //     return slug(str);
    // });

    eleventyConfig.addNunjucksFilter('json', function(context) {
    return JSON.stringify(context);
    });


    eleventyConfig.addNunjucksFilter('toLowerCase', function(str) {
    return str.toLowerCase();
    });

    eleventyConfig.addNunjucksFilter('formatDataAttr', function(str) {
    var newStr = str.replace(new RegExp(escapeRegExp(' '), 'g'), '-');
    return newStr.toLowerCase();
    });

    eleventyConfig.addNunjucksFilter('getRelated', function(arr, tags, exclude) {
    var related = [];
    for(var p = 0; p<arr.length; p++){
        if(arr[p].tags){
        var match = false;
        for(var t = 0; t<tags.length; t++){
            if(!match && arr[p].tags.indexOf(tags[t]) != -1){ //check one of the tags is a match
            if(arr[p].title != exclude){ //exclude current post - doing this on title
                related.push(arr[p]);
                match = true;
            }
            }
        }
        }
    }
    return related;
    });

    eleventyConfig.addNunjucksFilter('byDate', function(arr){
        // creates a date-ordered array with the following structure
        // [
        //      {
        //          year: 2018,
        //          months:
        //              [
        //                  month: 01,
        //                  posts:
        //                      [
        //                          { post objects }
        //                      ]
        //              ]
        //      }
        // ]
        arr = arr.slice(0).reverse()
        var dateList = [];

        var showYear = "";
        var showMonth = 0;

        var ycount = -1;
        var postYear = "";

        for(var p = 0; p<arr.length; p++){
            var pDate = new Date(arr[p].date);

            //assign year to array and store the current year
            if(showYear != pDate.getFullYear()) {
            showYear = pDate.getFullYear();
            dateList.push({'year': showYear, 'months': []});
            ycount ++;
            }

            var monthExists = false;
            if(dateList[ycount].months.length > 0){
            for(var m = 0; m < dateList[ycount].months.length; m++){
                //console.log(stringify(dateList[ycount].months[m].month))
                if(getTheMonth(pDate) == dateList[ycount].months[m].month){
                monthExists = true;
                dateList[ycount].months[m].posts.push(arr[p]);
                }
            }
            }
            if(!monthExists){
            dateList[ycount].months.push({'month': getTheMonth(pDate), 'posts': [arr[p]]});
            }

        }
        return dateList;
    });



    eleventyConfig.addNunjucksFilter('countRelated', function(arr, tags, exclude) {
        var related = [];
        for(var p = 0; p<arr.length; p++){
            if(arr[p].tags){
            var match = false;
            for(var t = 0; t<tags.length; t++){
                if(!match && arr[p].tags.indexOf(tags[t]) != -1){ //check one of the tags is a match
                if(arr[p].title != exclude){ //exclude current post - doing this on title
                    related.push(arr[p]);
                    match = true;
                }
                }
            }
            }
        }
        return related.length;
    });

    eleventyConfig.addNunjucksFilter('limit', function(arr, limit) {
        console.log("====================" , arr)
        return arr.slice(-1, limit);
    });

    eleventyConfig.addNunjucksFilter('activeTags', function(arr, tags) {
        var activetags = [];

        if(!Array.isArray(tags)){
            var tempStr = tags;
            var tags = [];
            tags.push(tempStr);
        }

        for(var t = 0; t<tags.length; t++){
            var match = false;
            for(var p = 0; p<arr.length; p++){
            if(arr[p].tags){
                if(!match && arr[p].tags.indexOf(tags[t]) != -1){ //check one of the tags is a match
                activetags.push(tags[t]);
                match = true;
                }
            }
            }

        }
        return activetags;
    });

    eleventyConfig.addNunjucksFilter('block-params', function() {
        var args = [],
            options = arguments[arguments.length - 1];
        for (var i = 0; i < arguments.length - 1; i++) {
            args.push(arguments[i]);
        }

        return options.fn(this, {data: options.data, blockParams: args});
    });

    eleventyConfig.addNunjucksFilter('capitalizeFirstLetter', function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    });

    eleventyConfig.addNunjucksFilter('limit', function (arr, limit) {
        if (!_.isArray(arr)) { return []; } // remove this line if you don't want the lodash/underscore dependency
        return arr.slice(0, limit);
    });

    eleventyConfig.addNunjucksFilter('placeholders', function(content, imgs){
        var newContent = content;
        imgs.forEach(function(image){
            // let re = new RegExp('\/\/PH+' + image.marker + '}\b', "g");
            newContent = newContent.replace(`//PH${image.marker}`, mediaDisplay(image))
        });
        return newContent;
    });

    eleventyConfig.addNunjucksFilter('firstPara', function (context) {
        if(!context){return}
        //console.log('--------CONTEXT-----------')
        //console.log(context)
        return context.split('\n')[0];
    });

    eleventyConfig.addNunjucksFilter('stripHTML', function(context){
        if(!context){return}
        return context.replace(/(<([^>]+)>)/ig,"");

    })


    eleventyConfig.addNunjucksFilter('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    eleventyConfig.addPassthroughCopy('_source/assets');

    return {
		templateFormats: [
			"md",
			"ejs",
            "njk"
		],
        passthroughFileCopy: true,
        dir: {
            input: "_source",
            output: "_site",
            includes: "_includes"
        }
	};
}