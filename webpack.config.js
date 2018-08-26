/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Copyright (c) 2018 WanFoxOne <contact@corler.pro>

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions
 of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 OR OTHER DEALINGS IN THE SOFTWARE.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const path = require("path");
/**
 * Files and folders copier and mover
 * @type {ncp|*}
 */
const ncp = require("ncp").ncp;
/**
 * Images manager
 * @type {*|Sharp}
 */
const sharp = require("sharp");
/**
 * CSS separation in specific files
 * @type {ExtractTextPlugin}
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
/**
 * HTML generation in specific file
 * @type {HtmlWebpackPlugin}
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * Specific assets exclusion in HTML
 * @type {HtmlWebpackExcludeAssetsPlugin}
 */
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
/**
 * JSON manifest generation
 */
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");

/**
 * JSON package
 */
const config = require("./package.json");

/**
 * CSS separation in specific files (path and filename configured)
 * @type {ExtractTextPlugin}
 */
const extractSass = new ExtractTextPlugin({
    filename: "./static/css/[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        background_scripts: "./src/background/background.js",
        popup: "./src/popup/popup.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [{
                    loader: "eslint-loader",
                    options: {
                        emitError: true,
                        failOnWarning: false
                    }
                }, {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/transform-runtime"]
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader"
                        }
                    ],
                    fallback: "style-loader"
                })
            }
        ],
    },
    plugins: [
        extractSass,
        new WebpackExtensionManifestPlugin({
            config: {
                "manifest_version": 2,
                "name": "__MSG_extensionName__",
                "version": config.version,
                "description": "__MSG_extensionDescription__",
                "author": config.author.name,
                "homepage_url": config.author.url,
                "default_locale": "en",
                "icons": {
                    "16": "static/icons/logo_16.png",
                    "32": "static/icons/logo_32.png",
                    "48": "static/icons/logo_48.png",
                    "64": "static/icons/logo_64.png",
                    "128": "static/icons/logo_128.png"
                },
                "browser_action": {
                    "default_icon": "./static/icons/logo_32.png",
                    "default_title": config.build_parameters.name,
                    "default_popup": "./popup/index.html",
                    "browser_style": true
                },
                "background": {
                    "scripts": [
                        "background/index.js"
                    ]
                }
            }
        }),
        (function () {

            // Move translations to the addon's _locales folder
            ncp("./src/static/traductions/", "./addon/_locales/", function (err) {
                if (err) {
                    return console.error(err);
                }
                console.info("[OK] Translations set up");
            });

            // Resize and duplicate icon
            config.build_parameters.icon_sizes.forEach(function (index) {
                let image = sharp("./src/logo.png");
                image.resize(index)
                    .toFile("./addon/static/icons/logo_" + index + ".png",
                        (err, info) => (err !== null) ?
                            console.error("[ERR] " + index + " | " + err) :
                            console.log("[OK] " + "logo_" + index + ".png")
                    );

            });


        }),
        new HtmlWebpackPlugin({
            title: config.build_parameters.name,
            filename: "./popup/index.html",
            template: "./src/index.html",
            minify: false,
            hash: true,
            cache: true,
            excludeAssets: [/background_scripts.*.js/]
        }),
        new HtmlWebpackExcludeAssetsPlugin()
    ]
};
