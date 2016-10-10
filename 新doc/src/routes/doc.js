var express = require('express');
var router = express.Router();

// 对 markdown 文件进行处理

var markdown = require("markdown").markdown;
var path = require('path');
var fs = require('fs');
var basePath = 'public/doc/markdown'
var htmlPath = 'public/doc/html'
var ejsPath = 'views/doc/widgets'

// init compile markdown file
var mdFileList = fs.readdirSync(basePath, 'utf8');
mdFileList.forEach(function (mdFile) {
    var fileContent = fs.readFileSync(path.join(basePath, mdFile), 'utf8');
    var compileContent = markdown.toHTML(fileContent);

    // create html
    fs.writeFileSync(path.join(htmlPath, mdFile.replace('.md', '.html')), compileContent, 'utf8');

    var ejsContent = [
        '<% include ../header %>',
        compileContent,
        '<% include ../footer %>'
    ].join('\n');

    fs.writeFileSync(path.join(ejsPath, mdFile.replace(/\./g, '_').replace('_md', '.ejs')), ejsContent, 'utf8');
}, this);


var widgetList = [];
mdFileList.forEach(function (fileName) {
    widgetList.push(fileName.split('.md')[0]);
}, this);

//init finish

var viewBasePath = 'doc/widgets'

router.get('/', function (req, res, next) {
    var widget = widgetList[0].replace('.', '_');
    try {
        res.render(path.join(viewBasePath, widget), {
            title: widget,
            widgets: widgetList
        });
    } catch (error) {
        console.log(error);
    }

});

router.get('/:widget', function (req, res, next) {
    var widget = req.params.widget.replace('.', '_');
    try {
        res.render(path.join(viewBasePath, widget), {
            title: widget,
            widgets: widgetList
        });
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;
