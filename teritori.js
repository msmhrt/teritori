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
    var trtr = window.teritori;

    trtr.get_option_from_cfg = function (config_string) {
        var i, newconfig_table, config_list, config, option;

        option = {
            'mode': 'tweet',
            'debug': false,
            'link': 'entity',
            'showtco': true,
            'preview': true
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
            case 'showtco':
                if (config[1] === 'true') {
                    option.showtco = true;
                } else if (config[1] === 'false') {
                    option.showtco = false;
                }
                break;
            case 'preview':
                if (config[1] === 'true') {
                    option.preview = true;
                } else if (config[1] === 'false') {
                    option.preview = false;
                }
                break;
            }
        }

        if (option.debug) {
            console.info('teritori: option = ', option);
        }

        return option;
    };

    trtr.display_dialog = function (htmlcode) {
        var close_dialog, select_text, trtr_dialog, dialog_position, trtr_dialog_header, trtr_mode_select_menu, trtr_preview_checkbox, trtr_showtco_checkbox;

        close_dialog = function () {
            $('.trtr-dialog').remove();
            trtr.dialog_loaded = false;
        };

        if (trtr.dialog_loaded) {
            dialog_position = [parseInt($('.trtr-dialog').css('top'), 10), parseInt($('.trtr-dialog').css('left'), 10)];
            trtr.dialog_loaded = false;
            close_dialog();
        }

        trtr_dialog = $('<div class="trtr-dialog" style="position:fixed;z-index:21;font: 13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-serif;width:560px;height:auto;-webkit-box-shadow:0 3px 0 rgba(0,0,0,0.1);background-color:rgba(0,0,0,0.8);border-radius:5px;box-shadow:0 3px 0 rgba(0,0,0,0.1);display:block;margin:0;padding:6px;"><div class="trtr-dialog-header" style="position:relative;border-top-radius:4px;cursor:move;display:block;margin:0;padding:0"><h3 style="color:#fff;font-size:15px;font-weight:bold;margin:0;padding:2px 15px 7px 5px">teritori</h3><div class="trtr-dialog-close" style="position:absolute;cursor:pointer;top:3px;font:bold 16px Tahoma,sans-serif;right:0%;line-height: 18px;color:white;width:20px;height:20px;text-align:center;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;background: rgba(0, 0, 0, 0.3);margin:0;padding:0"><b>×</b></div></div><div class="trtr-dialog-content" style="-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;background-color:#fff;box-shadow: 0 1px 1px rgba(0,0,0,0.2);padding:10px 15px 10px 15px"><span style="margin-right:1em"><strong>Mode</strong></span><select style="margin-bottom:10px" class="trtr-mode-select-menu"></select><div class="trtr-dialog-textarea" style="margin-bottom:5px"><textarea class="trtr-textarea" style="font: 14px/18px \'Helvetica Neue\',Arial,sans-serif;width:512px;height:106px;border:1px solid #CCC;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;padding:8px;-webkit-box-shadow:0 1px white;-moz-box-shadow:0 1px white;box-shadow:0 1px white;">' + htmlcode + '</textarea></div><div><input class="trtr-dialog-preview-checkbox" type="checkbox" > <strong>Preview</strong><input class="trtr-dialog-showtco-checkbox" style="margin-left:1em" type="checkbox" > <strong>Show http://t.co/...</strong></div><div class="trtr-dialog-previewarea"></div></div></div>').appendTo('body');

        trtr_mode_select_menu = trtr_dialog.find('.trtr-mode-select-menu');
        trtr_mode_select_menu.append($('<option value="tweet">Tweet</option>'));
        trtr_mode_select_menu.append($('<option value="profile">Twitter User Profile</option>'));
        trtr_mode_select_menu.append($('<option value="tweet4kml">Placemark\'s description of Google Maps</option>'));
        trtr_mode_select_menu.val(trtr.option.mode);

        trtr_mode_select_menu.bind('change', function () {
            trtr.option.mode = trtr_dialog.find('.trtr-mode-select-menu option:selected').val();
            trtr.load_jsonp('repeat');
        });

        trtr_preview_checkbox = trtr_dialog.find(".trtr-dialog-preview-checkbox");
        if (trtr.option.preview) {
            trtr_preview_checkbox.attr("checked", "checked");
            trtr_dialog.find(".trtr-dialog-previewarea").append('<div class="trtr-dialog-preview" style="margin-top:5px">' + htmlcode + '</div>');
        } else {
            trtr_preview_checkbox.attr("checked", "");
        }

        trtr_preview_checkbox.click(function () {
            if (trtr_preview_checkbox.is(":checked")) {
                trtr_dialog.find(".trtr-dialog-previewarea").append('<div class="trtr-dialog-preview" style="margin-top:5px">' + htmlcode + '</div>');
                trtr.option.preview = true;
            } else {
                trtr_dialog.find(".trtr-dialog-preview").remove();
                trtr.option.preview = false;
            }
        });

        trtr_showtco_checkbox = trtr_dialog.find(".trtr-dialog-showtco-checkbox");
        if (trtr.option.showtco) {
            trtr_showtco_checkbox.attr("checked", "checked");
        } else {
            trtr_showtco_checkbox.attr("checked", "");
        }

        trtr_showtco_checkbox.click(function () {
            trtr.option.showtco = trtr_showtco_checkbox.is(":checked") ? true : false;
            trtr.load_jsonp('repeat');
        });

        if (dialog_position) {
            trtr_dialog.css({
                'top': dialog_position[0],
                'left': dialog_position[1]
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
                stop: function () {
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
                alert('teritori: Unordered indices (' + index.toString() + ', ' + start.toString() + ', ' + end.toString() + ', ' + text.length.toString() + ')');
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

    trtr.get_color_array = function (color_str) {
        var m, color_array;

        color_array = [];
        m = color_str.match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (m) {
            color_array[0] = parseInt(m[1], 16);
            color_array[1] = parseInt(m[2], 16);
            color_array[2] = parseInt(m[3], 16);
            return color_array;
        }

        m = color_str.match(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (m) {
            color_array[0] = parseInt(m[1] + m[1], 16);
            color_array[1] = parseInt(m[2] + m[2], 16);
            color_array[2] = parseInt(m[3] + m[3], 16);
            return color_array;
        }

        return undefined;
    };

    trtr.get_color_str_blended = function (fgcolor_val, bgcolor_val, opacity) {
        var color_val;

        if (opacity < 0) {
            opacity = 0;
        } else if (1.0 < opacity) {
            opacity = 1.0;
        }

        color_val = Math.round(bgcolor_val + ((fgcolor_val - bgcolor_val) * opacity));

        if (color_val < 0) {
            color_val = 0;
        } else if (color_val > 255) {
            color_val = 255;
        }

        return ('0' + color_val.toString(16)).slice(-2);
    };

    trtr.get_color_blended_by_opacity = function (fgcolor_str, bgcolor_str, opacity) {
        var fgcolor_array, bgcolor_array, color_str;

        if (bgcolor_str === undefined) {
            bgcolor_str = "FFFFFF";
        }

        if (opacity === undefined) {
            opacity = 0.5;
        }

        fgcolor_array = trtr.get_color_array(fgcolor_str);
        if (fgcolor_array === undefined) {
            alert("teritori: fgcolor_str has unknown color format '" + fgcolor_str + "'");
            return undefined;
        }

        bgcolor_array = trtr.get_color_array(bgcolor_str);
        if (bgcolor_array === undefined) {
            alert("teritori: bgcolor_str has unknown color format '" + bgcolor_str + "'");
            return undefined;
        }

        color_str = "";
        color_str += trtr.get_color_str_blended(fgcolor_array[0], bgcolor_array[0], opacity);
        color_str += trtr.get_color_str_blended(fgcolor_array[1], bgcolor_array[1], opacity);
        color_str += trtr.get_color_str_blended(fgcolor_array[2], bgcolor_array[2], opacity);
        color_str = color_str.toUpperCase();

        if (trtr.option.debug) {
            console.info('teritori: fgcolor_str =', fgcolor_str);
            console.info('teritori: bgcolor_str =', bgcolor_str);
            console.info('teritori: opacity =', opacity);
            console.info('teritori: color_str =', color_str);
        }

        return color_str;
    };

    trtr.display_htmlcode = function (tweet) {
        var tweet_id, source, screen_name, user_name, user_id, user_description, user_location, user_url, background_image_url, profile_image_url, background_color, text_color, link_color, symbol_color, background_image, background_tile, timestamp, htmlcode;

        trtr.cached_json['statuses/show/' + tweet.id_str] = tweet;

        if (tweet.retweeted_status) {
            tweet = tweet.retweeted_status;
        }

        tweet_id = tweet.id_str;
        source = tweet.source;

        screen_name = tweet.user.screen_name;
        user_name = tweet.user.name;
        user_id = tweet.user.id_str;
        user_description = (tweet.user.description === null) ? "" : tweet.user.description;
        user_location = (tweet.user.location === null) ? "" : tweet.user.location;
        user_url = tweet.user.url;
        background_image = tweet.user.profile_use_background_image;
        background_image_url = tweet.user.profile_background_image_url;
        background_tile = tweet.user.profile_background_tile;
        profile_image_url = tweet.user.profile_image_url;
        background_color = tweet.user.profile_background_color;
        text_color = tweet.user.profile_text_color;
        link_color = tweet.user.profile_link_color;
        symbol_color = trtr.get_color_blended_by_opacity(link_color);

        timestamp = (function (dt_tweeted_string) {
            var dt_value, dt_js_string, parsed_dt, dt_delta, dt_tweeted;

            dt_value = dt_tweeted_string.split(' ');
            dt_js_string = dt_value[1] + ' ' + dt_value[2] + ', ' + dt_value[5] + ' ' + dt_value[3];
            parsed_dt = Date.parse(dt_js_string);
            dt_tweeted = new Date();
            dt_delta = dt_tweeted.getTimezoneOffset() * 60 * 1000;
            dt_tweeted.setTime(parsed_dt - dt_delta);
            return dt_tweeted.getFullYear().toString() + '年' + (dt_tweeted.getMonth() + 1).toString() + '月' + dt_tweeted.getDate().toString() + '日 ' + dt_tweeted.getHours().toString() + ':' + ("0" + dt_tweeted.getMinutes().toString()).slice(-2);
        }(tweet.created_at));

        if (trtr.option.mode === 'profile') {
            (function () {
                var to_link, content, user_url_html;

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
                    'hashtags': function (entity) {
                        return '<span style="color:#' + symbol_color + '">#</span><a href="http://search.twitter.com/search?q=%23' + entity.text + '" style="color:#' + link_color + '">' + entity.text + '</a>';
                    },
                    'urls': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" style="color:#' + link_color + '">' + linktext + '</a>';
                    },
                    'user_mentions': function (entity, string) {
                        return '<span style="color:#' + symbol_color + '">@</span><a href="http://twitter.com/' + entity.screen_name + '" style="color:#' + link_color + '">' + string.substring(1) + '</a>';
                    },
                    'media': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" style="color:#' + link_color + '">' + linktext + '</a>';
                    }
                };

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
                        pre_text = '<span style="color:#' + symbol_color + '">#</span>';
                        text = a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + a[3];
                        pre_text = '<span style="color:#' + symbol_color + '">@</span>';
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

                htmlcode = '<div style="margin:0 .5em .3em .5em;min-height:60px;color:#' + text_color + ';font-size:16px"><div>' + content + ' </div><div style="margin-bottom:.5em"><span style="font-size:12px;display:block;color:#999"><a href="http://twitter.com/' + screen_name + '/status/' + tweet_id + '"' + link_style + '>' + timestamp + '</a> ' + source + 'から </span></div><div style="padding:.5em 0 .5em 0;width:100%;border-top:1px solid #E6E6E6"><a href="http://twitter.com/' + screen_name + '"' + link_style + '><img src="' + profile_image_url + '" alt="' + user_name + '" width="38" height="38" style="float:left;margin-right:7px;width:38px;padding:0;border:none"></a><strong><a href="http://twitter.com/' + screen_name + '"' + link_style + '>@' + screen_name + '</a></strong><span style="color:#999;font-size:14px"><br>' + user_name + ' </span></div></div>';
            }());
        } else if (trtr.option.mode === 'tweet') {
            (function () {
                var to_link, content, entity_callback, background;

                entity_callback = {
                    'hashtags': function (entity) {
                        return '<a class="trtr_link" href="http://search.twitter.com/search?q=%23' + entity.text + '" target="_new"><span class="trtr_link_symbol">#</span><span class="trtr_link_text">' + entity.text + '</span></a>';
                    },
                    'urls': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" target="_new"><span class="trtr_link_text">' + linktext + '</span></a>';
                    },
                    'user_mentions': function (entity, string) {
                        return '<a class="trtr_link" href="http://twitter.com/' + entity.screen_name + '" target="_new"><span class="trtr_link_symbol">@</span><span class="trtr_link_text">' + string.substring(1) + '</span></a>';
                    },
                    'media': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" target="_new"><span class="trtr_link_text">' + linktext + '</span></a>';
                    }
                };

                to_link = function () {
                    var a = arguments;

                    if (a[1]) {
                        return '<a href="' + a[1] + '" target="_new"><span class="trtr_link_text">' + a[1] + '</span></a>';
                    } else if (a[2]) {
                        return '<a class="trtr_link" href="http://search.twitter.com/search?q=%23' + a[2] + '" target="_new"><span class="trtr_link_symbol">#</span><span class="trtr_link_text">' + a[2] + '</span></a>';
                    } else if (a[3]) {
                        return '<a class="trtr_link" href="http://twitter.com/' + a[3] + '" target="_new"><span class="trtr_link_symbol">@</span><span class="trtr_link_text">' + a[3] + '</span></a>';
                    } else {
                        alert("teritori: Unknown link error");
                    }
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

                background = '#' + background_color;
                if (background_image) {
                    background += ' url(' + background_image_url + ')';
                    if (!background_tile) {
                        background += " no-repeat";
                    }
                }

                htmlcode = '<!-- http://twitter.com/' + screen_name + '/status/' + tweet_id + ' -->\n';
                htmlcode += '<style type="text/css">.trtr_tweetid_' + tweet_id + ' a {text-decoration:none;color:#' + link_color + ' !important} .trtr_tweetid_' + tweet_id + ' a.trtr_link span.trtr_link_symbol {opacity:0.5} .trtr_tweetid_' + tweet_id + ' a:hover {text-decoration:underline} .trtr_tweetid_' + tweet_id + ' a.trtr_link:hover {text-decoration:none} .trtr_tweetid_' + tweet_id + ' a.trtr_link:hover span.trtr_link_text {text-decoration:underline} .trtr_tweetid_' + tweet_id + ' a.trtr_action span em {background:transparent url(http://si0.twimg.com/images/dev/cms/intents/icons/sprites/everything-spritev2.png) no-repeat;margin:0 3px -3.5px 3px;display:inline-block;vertical-align:baseline;position:relative;outline:none;width:15px;height:15px;} .trtr_tweetid_' + tweet_id + ' a.trtr_action_reply span em {background-position 0 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_reply:hover span em {background-position:-16px 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_retweet span em {background-position:-80px 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_retweet:hover span em {background-position:-96px 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_favorite span em {background-position:-32px 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_favorite:hover span em {background-position:-48px 0} .trtr_tweetid_' + tweet_id + ' a.trtr_action_follow span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_blue/bird_16_blue.png)} .trtr_tweetid_' + tweet_id + ' a.trtr_action_follow:hover span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_black/bird_16_black.png)}</style>';
                htmlcode += '<div class="trtr_tweetid_' + tweet_id + '" style="background:' + background + ';padding:20px"><div style="background:#fff;padding:10px 12px 10px 12px;margin:0;min-height:48px;color:#' + text_color + ';font-size:16px !important;line-height:22px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;word-wrap:break-word">' + content + ' <div class="trtr_actions" style="color:#999;font-size:12px;display:block"><a href="https://twitter.com/intent/user?user_id=' + user_id + '" class="trtr_action trtr_action_follow" title="Follow"><span><em></em></span></a> <span class="trtr_timestamp"><a title="' + timestamp + '" href="http://twitter.com/' + screen_name + '/status/' + tweet_id + '">' + timestamp + '</a> via ' + source + ' </span><a href="https://twitter.com/intent/tweet?in_reply_to=' + tweet_id + '" class="trtr_action trtr_action_reply" title="Reply"><span><em></em>Reply</span></a> <a href="https://twitter.com/intent/retweet?tweet_id=' + tweet_id + '" class="trtr_action trtr_action_retweet" title="Retweet"><span><em></em>Retweet</span></a> <a href="https://twitter.com/intent/favorite?tweet_id=' + tweet_id + '" class="trtr_action trtr_action_favorite" title="Favorite"><span><em></em>Favorite</span></a> </div><span class="trtr_metadata" style="display:block;width:100%;clear:both;margin-top:8px;padding-top:12px;height:40px;border-top:1px solid #fff;border-top:1px solid #e6e6e6;"><span class="trtr_author" style="color:#999;line-height:19px;"><a href="http://twitter.com/' + screen_name + '"><img src="' + profile_image_url + '" style="float:left;margin:0 7px 0 0;width:38px;height:38px;" /></a><strong><a href="http://twitter.com/' + screen_name + '">' + user_name + '</a></strong><br/>@' + screen_name + '</span></span></div></div>\n';
                htmlcode += '<!-- end of tweet -->\n';
            }());
        } else {
            alert("teritori: Unknown mode '" + trtr.option.mode + "'");
            return;
        }

        trtr.display_dialog(htmlcode);
    };

    trtr.load_jsonp = function (id) {
        var jsonp, cache_key;

        if (id === 'repeat') {
            id = trtr.last_id;
        } else {
            trtr.last_id = id;
        }

        cache_key = 'statuses/show/' + id;
        if (trtr.cached_json.hasOwnProperty(cache_key)) {
            trtr.display_htmlcode(trtr.cached_json[cache_key]);
            if (trtr.option.debug) {
                console.info('teritori: cache_key = ', cache_key);
            }
        } else {
            jsonp = document.createElement('script');
            jsonp.type = 'text/javascript';
            jsonp.src = 'http://api.twitter.com/1/statuses/show.json?include_entities=true&contributor_details=true&callback=teritori.display_htmlcode&id=' + id;
            document.getElementsByTagName('head')[0].appendChild(jsonp);
        }
    };

    trtr.main = function () {
        var url, matches;

        trtr.option = trtr.get_option_from_cfg(trtr.cfg);

        if (!trtr.cached_json) {
            trtr.cached_json = {};
        }

        url = document.location.href;
        matches = url.match(/^https?:\/\/twitter\.com(\/#\!)?(\/([a-zA-Z0-9_]{1,15})(\/status(es)?\/([1-9][0-9]+))?)?/);
        if (!matches) {
            alert('teritori can use only twitter.com.');
            return;
        }

        if (matches[6]) {
            trtr.load_jsonp(matches[6]);
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
                        trtr.load_jsonp(tweet_id);
                    });
                }
            });
        }
    };

    trtr.main();
}());
