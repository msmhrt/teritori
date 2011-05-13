/*!
teritori - A bookmarklet for generating static HTML codes for tweets

Copyright (c) 2011 Masami HIRATA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function () {
    var trtr = teritori;

    trtr.get_option_from_cfg = function (config_string) {
        var i, newconfig_table, config_list, config, option;

        option = {
            'mode': 'tweet',
            'debug': false,
            'link': 'entity'
        };

        if (!config_string) {
            return option;
        }

        newconfig_table = {
            'tweet': 'mode:tweet',
            'profile': 'mode:profile',
            'kml': 'mode:tweet4kml'
        };

        if (newconfig_table.hasOwnProperty(config_string)) {
            config_string = newconfig_table[config_string];
        }

        config_list = config_string.split(',');
        for (i = 0; i < config_list.length; i += 1) {
            config = config_list[i].split(':');
            switch (config[0]) {
            case 'mode':
                option.mode = config[1];
                break;
            case 'debug':
                if (config[1] === 'true') {
                    option.debug = true;
                } else if (config[1] === 'false') {
                    option.debug = false;
                }
                break;
            case 'link':
                if (config[1] === 'entity' || config[1] === 'auto') {
                    option.link = config[1];
                }
                break;
            }
        }

        if (option.debug) {
            console.info('teritori: option = ', option);
        }

        return option;
    };

    trtr.display_dialog = function (title, htmlcode) {
        var close_dialog, select_text, trtr_dialog, position, trtr_dialog_header;

        close_dialog = function () {
            $('.trtr-dialog').remove();
            trtr.dialog_loaded = false;
        };

        if (trtr.dialog_loaded) {
            position = $('.trtr-dialog').position();
            trtr.dialog_loaded = false;
            close_dialog();
        }

        trtr_dialog = $('<div class="trtr-dialog" style="position:fixed;z-index:21;font: 13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-serif;width:500px;height:auto;-webkit-box-shadow:0 3px 0 rgba(0,0,0,0.1);background-color:rgba(0,0,0,0.8);border-radius:5px;box-shadow:0 3px 0 rgba(0,0,0,0.1);display:block;margin:0;padding:6px;"><div class="trtr-dialog-header" style="position:relative;border-top-radius:4px;cursor:move;display:block;margin:0;padding:0"><h3 style="color:#fff;font-size:15px;font-weight:bold;margin:0;padding:2px 15px 7px 5px">teritori</h3><div class="trtr-dialog-close" style="position:absolute;cursor:pointer;top:3px;font:bold 16px Tahoma,sans-serif;right:0%;line-height: 18px;color:white;width:20px;height:20px;text-align:center;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;background: rgba(0, 0, 0, 0.3);margin:0;padding:0"><b>×</b></div></div><div class="trtr-dialog-content" style="-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;background-color:#fff;box-shadow: 0 1px 1px rgba(0,0,0,0.2);padding:5px 15px 8px 15px"><div>' + title + '</div><div class="trtr-dialog-textarea"><textarea class="trtr-textarea" style="font: 14px/18px \'Helvetica Neue\',Arial,sans-serif;width:452px;height:156px;border:1px solid #CCC;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;padding:8px;-webkit-box-shadow:0 1px white;-moz-box-shadow:0 1px white;box-shadow:0 1px white;">' + htmlcode + '</textarea></div></div></div>').appendTo('body');

        if (position) {
            trtr_dialog.css({
                'top': position.top,
                'left': position.left
            });
        } else {
            trtr_dialog.css({
                'top': Math.floor(($(window).height() - trtr_dialog.height()) / 2),
                'left': Math.floor(($(window).width() - trtr_dialog.width()) / 2)
            });
        }

        select_text = function () {
            trtr_dialog.find('.trtr-textarea').focus().select();
        };

        select_text();

        trtr_dialog_header = trtr_dialog.find('.trtr-dialog-header');

        if (trtr_dialog.draggable) {
            trtr_dialog.draggable({
                handle: trtr_dialog_header,
                stop: function (e, ui) {
                    select_text();
                }
            });
        } else {
            trtr_dialog_header.css({
                'cursor': 'auto'
            });
        }

        trtr_dialog.find('.trtr-dialog-close').click(close_dialog);

        $(document).keyup(function (event) {
            if (event.which === 27) {
                close_dialog();
            }
        });

        trtr.dialog_loaded = true;
    };

    trtr.apply_entities = function (text, entities, entity_callback) {
        var i, j, index, start, end, linked_text, entity_list, entity;

        entity_list = [];
        for (i in entities) {
            if ((typeof entities[i] !== 'function') && (entities[i].length !== 0)) {
                for (j = 0; j < entities[i].length; j += 1) {
                    entity_list.push([i, entities[i][j]]);
                }
            }
        }

        if (entity_list.length === 0) {
            return text;
        }

        entity_list.sort(function (a, b) {
            return a[1].indices[0] - b[1].indices[0];
        });

        index = 0;
        linked_text = '';
        for (i = 0; i < entity_list.length; i += 1) {
            entity = entity_list[i];
            if (entity_callback.hasOwnProperty(entity[0]) !== true) {
                alert("teritori: Unknown parameter '" + entity[0] + "' in entity");
                return text;
            }

            start = entity[1].indices[0];
            end = entity[1].indices[1];

            if (index > start || start > end || end > text.length) {
                alert('teritori: Unordered indices (' + index + ', ' + start + ', ' + end + ', ' + text.length + ')');
                return text;
            }

            linked_text += text.substring(index, start);
            linked_text += entity_callback[entity[0]](entity[1], text.substring(start, end));
            index = end;

        }
        if (end < text.length) {
            linked_text += text.substring(end, text.length);
        }

        return linked_text;
    };

    trtr.display_htmlcode = function (tweet) {
        var tweet_id, source, screen_name, user_name, user_id, user_description, user_location, user_url, background_image_url, profile_image_url, background_color, text_color, link_color, timestamp, title, htmlcode;

        if (tweet.retweeted_status) {
            tweet = tweet.retweeted_status;
        }

        tweet_id = tweet.id_str;
        source = tweet.source;

        screen_name = tweet.user.screen_name;
        user_name = tweet.user.name;
        user_id = tweet.user.id_str;
        user_description = tweet.user.description;
        user_location = tweet.user.location;
        user_url = tweet.user.url;
        background_image_url = tweet.user.profile_background_image_url;
        profile_image_url = tweet.user.profile_image_url;
        background_color = tweet.user.profile_background_color;
        text_color = tweet.user.profile_text_color;
        link_color = tweet.user.profile_link_color;

        timestamp = (function (dt_tweeted_string) {
            var dt_value, dt_js_string, parsed_dt, dt_delta, dt_tweeted;

            dt_value = dt_tweeted_string.split(' ');
            dt_js_string = dt_value[1] + ' ' + dt_value[2] + ', ' + dt_value[5] + ' ' + dt_value[3];
            parsed_dt = Date.parse(dt_js_string);
            dt_tweeted = new Date();
            dt_delta = dt_tweeted.getTimezoneOffset() * 60 * 1000;
            dt_tweeted.setTime(parsed_dt - dt_delta);
            return dt_tweeted.getFullYear() + '年' + (dt_tweeted.getMonth() + 1) + '月' + dt_tweeted.getDate() + '日 ' + dt_tweeted.getHours() + ':' + ("0" + dt_tweeted.getMinutes()).slice(-2);
        }(tweet.created_at));

        if (trtr.option.mode === 'profile') {
            (function () {
                var to_link, content, user_url_html;

                title = 'Twitter User Profile';

                to_link = function () {
                    var a = arguments,
                        url = '',
                        text = '',
                        pre_text = '';

                    if (a[1]) {
                        url = a[1];
                        text = a[1];
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + a[2];
                        text = '#' + a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + a[3];
                        pre_text = '@';
                        text = a[3];
                    }

                    return pre_text + '<a href="' + url + '" target="_new">' + text + '</a>';
                };

                content = tweet.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                profile_image_url = profile_image_url.replace(/_normal\.([a-zA-Z]+)$/, '_reasonably_small.$1');

                if (user_url) {
                    user_url_html = '<div><a target="_blank" rel="me nofollow" href="' + user_url + '">' + user_url + '</a></div>';
                } else {
                    user_url_html = '<div><a target="_blank" rel="me nofollow"></a></div>';
                }

                htmlcode = '<!-- http://twitter.com/' + screen_name + ' -->\n';
                htmlcode += '<style type="text/css">.trtr_userid_' + user_id + ' a {text-decoration:none;color:#' + link_color + ' !important;} .trtr_userid_' + user_id + ' a:hover {text-decoration:underline;}</style>\n';
                htmlcode += '<div class="trtr_userid_' + user_id + '" style="display:block;-webkit-font-smoothing:antialiased;color:#444;font:13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-sefif"><div style="display:inline-block;padding:20px 20px 16px 20px;width:510px;background-color#fff"><div style="float:left"><a href="http://twitter.com/' + screen_name + '" target="_blank"><img src="' + profile_image_url + '" alt="' + user_name + '"></a></div><div style="margin-left:15px;display:inline-block;width:367px"><div style="font-weight:bold"><h2 style="line-height:36px;font-size:30px;margin:0">' + user_name + '</h2></div><div style="font-size:13px;line-height:22px;padding:0"><span style="font-size:18px;font-weight:bold"><a href="http://twitter.com/' + screen_name + '" target="_blank">@' + screen_name + '</a></span> ' + user_location + ' </div><div style="overflow:hidden;text-overflow:ellipsis;color:#777;font-family:Georgia,serif;font-size:14px;font-style:italic;">' + user_description + '</div>' + user_url_html + '</div></div></div>\n';
                htmlcode += '<!-- end of profile -->\n';
            }());
        } else if (trtr.option.mode === 'tweet4kml') {
            (function () {
                var link_style, to_link, content, entity_callback;

                entity_callback = {
                    'hashtags': function (entity, string) {
                        return '<a href="http://search.twitter.com/search?q=%23' + entity.text + '" style="color:#' + link_color + '">#' + entity.text + '</a>';
                    },
                    'urls': function (entity, string) {
                        return '<a href="' + entity.url + '" style="color:#' + link_color + '">' + entity.url + '</a>';
                    },
                    'user_mentions': function (entity, string) {
                        return '@<a href="http://twitter.com/' + entity.screen_name + '" style="color:#' + link_color + '">' + string.substring(1) + '</a>';
                    }
                };

                title = 'Placemark\'s description of Google Maps';

                link_style = ' style="color:#' + link_color + '"';

                to_link = function () {
                    var a = arguments,
                        url = '',
                        text = '',
                        pre_text = '';

                    if (a[1]) {
                        url = a[1];
                        text = a[1];
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + a[2];
                        text = '#' + a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + a[3];
                        pre_text = '@';
                        text = a[3];
                    }

                    return pre_text + '<a href="' + url + '"' + link_style + '>' + text + '</a>';
                };

                if (trtr.option.link === 'entity') {
                    content = trtr.apply_entities(tweet.text, tweet.entities, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    content = tweet.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                } else {
                    alert("teritori: Unknown link option '" + trtr.option.link + "'");
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity, link_auto;

                        if (trtr.option.link === 'entity') {
                            link_entity = content;
                            link_auto = tweet.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                        } else if (trtr.option.link === 'auto') {
                            link_entity = trtr.apply_entities(tweet.text, tweet.entities, entity_callback);
                            link_auto = content;
                        }

                        if (link_entity !== link_auto) {
                            alert('teritori: link_entity !== link_auto');
                            console.info('teritori: link_entity = ', link_entity);
                            console.info('teritori: link_auto =   ', link_auto);
                        }
                    }());
                }

                if (source === 'web') {
                    source = '<a href="http://twitter.com/"' + link_style + ' rel="nofollow">Twitter</a>';
                } else {
                    source = source.replace(/^<a href="([!#$%&'()*+,\-.\/0-9:;=?@A-Z\\_a-z~]+)" rel="nofollow">/, '<a href="$1"' + link_style + ' rel="nofollow">');
                }

                htmlcode = '<div style="margin:0 .5em .3em .5em;min-height:60px;color:#' + text_color + ';font-size:16px"><div>' + content + ' </div><div style="margin-bottom:.5em"><span style="font-size:12px;display:block;color:#999"><a href="http://twitter.com/' + screen_name + '/status/' + tweet_id + '"' + link_style + '>' + timestamp + '</a> ' + source + 'から </span></div><div style="padding:.5em 0 .5em 0;width:100%;border-top:1px solid #e6e6e6"><a href="http://twitter.com/' + screen_name + '"' + link_style + '><img src="' + profile_image_url + '" alt="' + user_name + '" width="38" height="38" style="float:left;margin-right:7px;width:38px;padding:0;border:none"></a><strong><a href="http://twitter.com/' + screen_name + '"' + link_style + '>@' + screen_name + '</a></strong><span style="color:#999;font-size:14px"><br>' + user_name + ' </span></div></div>';
            }());
        } else if (trtr.option.mode === 'tweet') {
            (function () {
                var to_link, content, entity_callback;

                entity_callback = {
                    'hashtags': function (entity, string) {
                        return '<a href="http://search.twitter.com/search?q=%23' + entity.text + '" target="_new">#' + entity.text + '</a>';
                    },
                    'urls': function (entity, string) {
                        return '<a href="' + entity.url + '" target="_new">' + entity.url + '</a>';
                    },
                    'user_mentions': function (entity, string) {
                        return '@<a href="http://twitter.com/' + entity.screen_name + '" target="_new">' + string.substring(1) + '</a>';
                    }
                };

                title = 'Tweet';

                to_link = function () {
                    var a = arguments,
                        url = '',
                        text = '',
                        pre_text = '';


                    if (a[1]) {
                        url = a[1];
                        text = a[1];
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + a[2];
                        text = '#' + a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + a[3];
                        pre_text = '@';
                        text = a[3];
                    }

                    return pre_text + '<a href="' + url + '" target="_new">' + text + '</a>';
                };

                if (trtr.option.link === 'entity') {
                    content = trtr.apply_entities(tweet.text, tweet.entities, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    content = tweet.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                } else {
                    alert("teritori: Unknown link option '" + trtr.option.link + "'");
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity, link_auto;

                        if (trtr.option.link === 'entity') {
                            link_entity = content;
                            link_auto = tweet.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                        } else if (trtr.option.link === 'auto') {
                            link_entity = trtr.apply_entities(tweet.text, tweet.entities, entity_callback);
                            link_auto = content;
                        }

                        if (link_entity !== link_auto) {
                            alert('teritori: link_entity !== link_auto');
                            console.info('teritori: link_entity = ', link_entity);
                            console.info('teritori: link_auto =   ', link_auto);
                        }
                    }());
                }

                htmlcode = '<!-- http://twitter.com/' + screen_name + '/status/' + tweet_id + ' -->\n';
                htmlcode += '<style type="text/css">.trtr_tweetid_' + tweet_id + ' a {text-decoration:none;color:#' + link_color + ' !important;} .trtr_tweetid_' + tweet_id + ' a:hover {text-decoration:underline;}</style>\n';
                htmlcode += '<div class="trtr_tweetid_' + tweet_id + '" style="background:url(' + background_image_url + ') #' + background_color + ';padding:20px;"><p class="trtrTweet" style="background:#fff;padding:10px 12px 10px 12px;margin:0;min-height:48px;color:#' + text_color + ';font-size:16px !important;line-height:22px;-moz-border-radius:5px;-webkit-border-radius:5px;">' + content + ' <span class="timestamp" style="font-size:12px;display:block;"><a title="' + timestamp + '" href="http://twitter.com/' + screen_name + '/status/' + tweet_id + '">' + timestamp + '</a> via ' + source + ' </span><span class="metadata" style="display:block;width:100%;clear:both;margin-top:8px;padding-top:12px;height:40px;border-top:1px solid #fff;border-top:1px solid #e6e6e6;"><span class="author" style="line-height:19px;"><a href="http://twitter.com/' + screen_name + '"><img src="' + profile_image_url + '" style="float:left;margin:0 7px 0 0px;width:38px;height:38px;" /></a><strong><a href="http://twitter.com/' + screen_name + '">' + user_name + '</a></strong><br/>@' + screen_name + '</span></span></p></div>';
                htmlcode += '<!-- end of tweet -->';
            }());
        } else {
            alert("teritori: Unknown mode '" + trtr.option.mode + "'");
            return;
        }

        trtr.display_dialog(title, htmlcode);
    };

    trtr.main = function () {
        var url, matches, load_jsonp;

        trtr.option = trtr.get_option_from_cfg(trtr.cfg);

        url = document.location.href;
        matches = url.match(/^https?:\/\/twitter\.com(\/#\!)?(\/([a-zA-Z0-9_]{1,15})(\/status(es)?\/([1-9][0-9]+))?)?/);
        if (!matches) {
            alert('teritori can use only twitter.com.');
            return;
        }

        load_jsonp = function (id) {
            var jsonp;

            if (id === 0) {
                return;
            }
            jsonp = document.createElement('script');
            jsonp.type = 'text/javascript';
            jsonp.src = 'http://api.twitter.com/1/statuses/show.json?include_entities=true&contributor_details=true&callback=teritori.display_htmlcode&id=' + id;
            document.getElementsByTagName('head')[0].appendChild(jsonp);
        };

        if (matches[6]) {
            load_jsonp(matches[6]);
        } else {
            $('.stream-tweet').live('hover', function () {
                var actions, tweet_link, tweet_id, action_gethtml;

                actions = $(this).find('.tweet-actions');
                if (actions && actions.find('.trtr_gethtml').length === 0) {
                    tweet_link = actions.siblings('.tweet-timestamp').attr('href');
                    tweet_id = (tweet_link.match(/^\/(#\!\/)?([a-zA-Z0-9_]{1,15})\/status(es)?\/([1-9][0-9]+)/))[4];
                    action_gethtml = $('<a href="#" class="trtr_gethtml" style="padding-left:18px"><span>GetHTML</span></a>');
                    actions.append(action_gethtml);
                    action_gethtml.click(function () {
                        load_jsonp(tweet_id);
                    });
                }
            });
        }
    };

    trtr.main();
}());
