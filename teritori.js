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
    'use strict';

    var trtr, mes;

    trtr = window.teritori;

    mes = function (key) {
        return trtr.lang[trtr.option.lang][key];
    };

    trtr.lang = {
        'en': {
            'lang_en': 'English',
            'lang_ja': 'Japanese - 日本語',
            'tweet_description': 'Tweet',
            'profile_description': 'Twitter User Profile',
            'tweet4kml_description': 'Placemark\'s description of Google Maps',
            'option_media': 'Display media',
            'option_mode': 'Mode',
            'option_lang': 'Lang',
            'option_preview': 'Preview',
            'option_showtco': 'Show http://t.co/...',
            'action_favorite': 'Favorite',
            'action_follow': 'Follow',
            'action_reply': 'Reply',
            'action_retweet': 'Retweet',
            'format_source': 'via %s',
            'get_format_date': function (dt) {
                return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][dt.getMonth()] + ' ' + ('0' + dt.getDate().toString()).slice(-2) + ', ' + dt.getFullYear().toString() + ' ' + (dt.getHours() % 12 || 12).toString() + ':' + ('0' + dt.getMinutes().toString()).slice(-2) + ' ' + ((dt.getHours() < 12) ? 'am' : 'pm');
            }
        },
        'ja': {
            'lang_en': '英語 - English',
            'lang_ja': '日本語',
            'tweet_description': 'ツイート',
            'profile_description': 'ユーザープロフィール',
            'tweet4kml_description': 'ツイート（Googleマップ用）',
            'option_media': 'メディアを表示',
            'option_mode': '種類',
            'option_lang': '言語',
            'option_preview': 'プレビュー',
            'option_showtco': 'http://t.co/... を表示',
            'action_favorite': 'お気に入り',
            'action_follow': 'フォロー',
            'action_reply': '返信',
            'action_retweet': 'リツイート',
            'format_source': '%sから',
            'get_format_date': function (dt) {
                return dt.getFullYear().toString() + '年' + (dt.getMonth() + 1).toString() + '月' + dt.getDate().toString() + '日 ' + dt.getHours().toString() + ':' + ('0' + dt.getMinutes().toString()).slice(-2);
            }
        }
    };

    trtr.get_lang = function () {
        var lang;

        if (window.twttr && window.twttr.pageLocale) {
            lang = window.twttr.pageLocale;
            trtr.new_twitter = true;
        } else {
            lang = $('html').attr('lang');
            trtr.new_twitter = false;
        }

        if (!trtr.lang.hasOwnProperty(lang)) {
            lang = 'en';
        }

        return lang;
    };

    trtr.get_option_from_cfg = function (config_string) {
        var i, newconfig_table, config_list, config, option;

        option = {
            'mode': 'tweet-mode',
            'debug': false,
            'link': 'entity',
            'showtco': true,
            'media': true,
            'preview': true,
            'lang': trtr.get_lang() || 'en'
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
                if (trtr.templates.hasOwnProperty(config[1] + '-mode')) {
                    option.mode = config[1] + '-mode';
                }
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
            case 'media':
                if (config[1] === 'true') {
                    option.media = true;
                } else if (config[1] === 'false') {
                    option.media = false;
                }
                break;
            case 'preview':
                if (config[1] === 'true') {
                    option.preview = true;
                } else if (config[1] === 'false') {
                    option.preview = false;
                }
                break;
            case 'lang':
                if (trtr.lang.hasOwnProperty(config[1])) {
                    option.lang = config[1];
                }
                break;
            }
        }

        if (option.debug) {
            console.info('teritori: option = ', option);
        }

        return option;
    };

    trtr.display_dialog = function (t) {
        var i, key, close_dialog, dialog_html, trtr_dialog, mode_list, lang_list, dialog_position, trtr_dialog_header, trtr_mode_select_menu, trtr_lang_select_menu, trtr_preview_checkbox, trtr_showtco_checkbox, trtr_media_checkbox;

        close_dialog = function () {
            $('.trtr-dialog').remove();
            trtr.dialog_loaded = false;
        };

        if (trtr.dialog_loaded) {
            dialog_position = [parseInt($('.trtr-dialog').css('top'), 10), parseInt($('.trtr-dialog').css('left'), 10)];
            trtr.dialog_loaded = false;
            close_dialog();
        }

        dialog_html = '<div class="trtr-dialog" style="text-align:left;position:fixed;z-index:21;font: 13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-serif;width:560px;height:auto;-webkit-box-shadow:0 3px 0 rgba(0,0,0,0.1);background-color:rgba(0,0,0,0.8);border-radius:5px;box-shadow:0 3px 0 rgba(0,0,0,0.1);display:block;margin:0;padding:6px;"><div class="trtr-dialog-header" style="position:relative;border-top-radius:4px;cursor:move;display:block;margin:0;padding:0"><h3 style="color:#fff;font-size:15px;font-weight:bold;margin:0;padding:2px 15px 7px 5px">teritori</h3><div class="trtr-dialog-close" style="position:absolute;cursor:pointer;top:3px;font:bold 16px Tahoma,sans-serif;right:0%;line-height: 18px;color:white;width:20px;height:20px;text-align:center;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;background: rgba(0, 0, 0, 0.3);margin:0;padding:0"><b>×</b></div></div><div class="trtr-dialog-content" style="-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;background-color:#fff;box-shadow: 0 1px 1px rgba(0,0,0,0.2);padding:10px 15px 10px 15px"><div style="margin-bottom:10px"><span style="margin-right:0.5em"><strong>' + mes('option_mode') + '</strong></span><select class="trtr-mode-select-menu"></select><span style="margin-left:1em;margin-right:0.5em"><strong>' + mes('option_lang') + '</strong></span><select class="trtr-lang-select-menu"></select></div><div class="trtr-dialog-textarea" style="margin-bottom:5px"><textarea class="trtr-textarea" style="font: 14px/18px \'Helvetica Neue\',Arial,sans-serif;width:512px;height:106px;border:1px solid #CCC;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;padding:8px;-webkit-box-shadow:0 1px white;-moz-box-shadow:0 1px white;box-shadow:0 1px white;">' + t.htmlcode + '</textarea></div><div>';
        dialog_html += '<input class="trtr-dialog-preview-checkbox" type="checkbox" > <strong>' + mes('option_preview') + '</strong>';
        dialog_html += '<input class="trtr-dialog-showtco-checkbox" style="margin-left:1em" type="checkbox" > <strong>' + mes('option_showtco') + '</strong>';
        dialog_html += '<input class="trtr-dialog-media-checkbox" style="margin-left:1em" type="checkbox" > <strong>' + mes('option_media') + '</strong>';
        dialog_html += '</div><div class="trtr-dialog-previewarea" style="margin-top:5px"></div></div></div>';
        trtr_dialog = $(dialog_html).appendTo('body');

        mode_list = [];
        for (key in trtr.templates) {
            if (trtr.templates.hasOwnProperty(key)) {
                mode_list.push([key, mes(trtr.templates[key].description)]);
            }
        }

        mode_list.sort(function (a, b) {
            if (a[1] === b[1]) {
                if (a[0] === b[0]) {
                    return 0;
                }
                return (a[0] > b[0]) ? 1 : -1;
            }
            return (a[1] > b[1]) ? 1 : -1;
        });

        trtr_mode_select_menu = trtr_dialog.find('.trtr-mode-select-menu');
        for (i = 0; i < mode_list.length; i += 1) {
            trtr_mode_select_menu.append($('<option value="' + mode_list[i][0] + '">' + mode_list[i][1] + '</option>'));
        }
        trtr_mode_select_menu.val(trtr.option.mode);

        trtr_mode_select_menu.bind('change', function () {
            trtr.option.mode = $(this).find('option:selected').val();
            trtr.reload();
        });

        lang_list = [];
        for (key in trtr.lang) {
            if (trtr.lang.hasOwnProperty(key)) {
                lang_list.push([key, mes('lang_' + key)]);
            }
        }

        lang_list.sort(function (a, b) {
            if (a[1] === b[1]) {
                if (a[0] === b[0]) {
                    return 0;
                }
                return (a[0] > b[0]) ? 1 : -1;
            }
            return (a[1] > b[1]) ? 1 : -1;
        });

        trtr_lang_select_menu = trtr_dialog.find('.trtr-lang-select-menu');
        for (i = 0; i < lang_list.length; i += 1) {
            trtr_lang_select_menu.append($('<option value="' + lang_list[i][0] + '">' + lang_list[i][1] + '</option>'));
        }
        trtr_lang_select_menu.val(trtr.option.lang);

        trtr_lang_select_menu.bind('change', function () {
            trtr.option.lang = $(this).find('option:selected').val();
            trtr.reload();
        });

        trtr_preview_checkbox = trtr_dialog.find('.trtr-dialog-preview-checkbox');
        if (trtr.option.preview) {
            trtr_preview_checkbox.attr('checked', 'checked');
            trtr_dialog.find('.trtr-dialog-previewarea').append(trtr.templates[trtr.option.mode].preview_box);
            trtr_dialog.find('.trtr-dialog-previewbox').append(t.htmlcode);
        } else {
            trtr_preview_checkbox.attr('checked', '');
        }

        if (trtr.templates[trtr.option.mode].uses_option.preview) {
            trtr_preview_checkbox.click(function () {
                trtr.option.preview = $(this).is(':checked') ? true : false;
                trtr.reload();
            });
        } else {
            trtr_preview_checkbox.attr('disabled', 'disabled');
            trtr_preview_checkbox.next().css('color', '#7F7F7F');
        }

        trtr_showtco_checkbox = trtr_dialog.find('.trtr-dialog-showtco-checkbox');
        if (trtr.option.showtco) {
            trtr_showtco_checkbox.attr('checked', 'checked');
        } else {
            trtr_showtco_checkbox.attr('checked', '');
        }

        if (trtr.templates[trtr.option.mode].uses_option.showtco) {
            trtr_showtco_checkbox.click(function () {
                trtr.option.showtco = $(this).is(':checked') ? true : false;
                trtr.reload();
            });
        } else {
            trtr_showtco_checkbox.attr('disabled', 'disabled');
            trtr_showtco_checkbox.next().css('color', '#7F7F7F');
        }

        trtr_media_checkbox = trtr_dialog.find('.trtr-dialog-media-checkbox');
        if (trtr.option.media) {
            trtr_media_checkbox.attr('checked', 'checked');
        } else {
            trtr_media_checkbox.attr('checked', '');
        }

        if (trtr.templates[trtr.option.mode].uses_option.media) {
            trtr_media_checkbox.click(function () {
                trtr.option.media = $(this).is(':checked') ? true : false;
                trtr.reload();
            });
        } else {
            trtr_media_checkbox.attr('disabled', 'disabled');
            trtr_media_checkbox.next().css('color', '#7F7F7F');
        }

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

        trtr_dialog_header = trtr_dialog.find('.trtr-dialog-header');

        if (trtr_dialog.draggable) {
            trtr_dialog.draggable({
                handle: trtr_dialog_header,
                stop: function () {
                    trtr.reload();
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

        trtr_dialog.find('.trtr-textarea').focus().select();

        trtr.dialog_loaded = true;
    };

    trtr.apply_entities = function (text, entities, entity_callback) {
        var i, j, key, index, start, end, linked_text, entity_list, entity;

        entity_list = [];
        for (key in entities) {
            if ((typeof entities[key] !== 'function') && (entities[key].length !== 0)) {
                for (j = 0; j < entities[key].length; j += 1) {
                    entity_list.push([key, entities[key][j]]);
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
            if (!entity_callback.hasOwnProperty(entity[0])) {
                alert('teritori: Unknown parameter \'' + entity[0] + '\' in entity');
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
            bgcolor_str = 'FFFFFF';
        }

        if (opacity === undefined) {
            opacity = 0.5;
        }

        fgcolor_array = trtr.get_color_array(fgcolor_str);
        if (fgcolor_array === undefined) {
            alert('teritori: fgcolor_str has unknown color format \'' + fgcolor_str + '\'');
            return undefined;
        }

        bgcolor_array = trtr.get_color_array(bgcolor_str);
        if (bgcolor_array === undefined) {
            alert('teritori: bgcolor_str has unknown color format \'' + bgcolor_str + '\'');
            return undefined;
        }

        color_str = '';
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

    trtr.get_timestamp = function (dt_tweeted_string) {
        var dt_value, dt_js_string, parsed_dt, dt_delta, dt_tweeted;

        dt_value = dt_tweeted_string.split(' ');
        dt_js_string = dt_value[1] + ' ' + dt_value[2] + ', ' + dt_value[5] + ' ' + dt_value[3];
        parsed_dt = Date.parse(dt_js_string);
        dt_tweeted = new Date();
        dt_delta = dt_tweeted.getTimezoneOffset() * 60 * 1000;
        dt_tweeted.setTime(parsed_dt - dt_delta);
        return mes('get_format_date')(dt_tweeted);
    };

    trtr.get_media_htmlcode_middle = function (url) {
        return '<div style="margin:.75em 0 .75em 0;font-size:12px"><a href="' + url + '"><img src="' + this.get_middle_thumbnail_url(url) + '" style="max-height:244px;max-width:244px"></a><br>' + this.get_attribution_middle() + '</div>';
    };

    trtr.get_media_htmlcode_large = function (url) {
        return '<div style="margin:12px 0 12px 0;font-size:12px;line-height:normal"><a href="' + url + '"><img src="' + this.get_large_thumbnail_url(url) + '" style="max-height:700px;max-width:317px"></a><br>' + this.get_attribution_large() + '</div>';
    };

    trtr.get_media_attribution_textonly = function () {
        return '<a href="' + this.provider_url + '"><span style="color:#999">' + this.provider_name + '</span></a>';
    };

    trtr.get_media_attribution_middle = function () {
        if (this.provider_icon_url === null) {
            return this.get_attribution_textonly();
        }
        return '<a href="' + this.provider_url + '"><img src="' + this.provider_icon_url + '" width="14" height="14" style="vertical-align:middle;margin-right:3px"></a><span style="color:#999">' + this.provider_name + '</span>';
    };

    trtr.get_media_attribution_large = function () {
        if (this.provider_icon_url === null) {
            return this.get_attribution_textonly();
        }
        return '<a href="' + this.provider_url + '"><img src="' + this.provider_icon_url + '" width="16" height="16" style="vertical-align:middle;margin-right:3px"></a><span style="color:#999">' + this.provider_name + '</span>';
    };

    trtr.media = [{
        'provider_name': 'YFrog',
        'provider_url': 'http://yfrog.com/',
        'provider_icon_url': 'http://yfrog.com/favicon.ico',
        'regexp_media_url': /^http:\/\/yfrog\.(?:com|us)\/([0-9a-zA-Z]+[jpbtgsdfzx])$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://yfrog.com/' + url.match(this.regexp_media_url)[1] + ':small';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://yfrog.com/' + url.match(this.regexp_media_url)[1] + ':iphone';
        }
    }, {
        'provider_name': 'TwitPic',
        'provider_url': 'http://twitpic.com/',
        'provider_icon_url': 'http://twitpic.com/favicon.ico',
        'regexp_media_url': /^http:\/\/twitpic\.com\/([0-9a-zA-Z]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://twitpic.com/show/thumb/' + url.match(this.regexp_media_url)[1];
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://twitpic.com/show/large/' + url.match(this.regexp_media_url)[1];
        }
    }, {
        'provider_name': 'Instagram',
        'provider_url': 'http://instagr.am/',
        'provider_icon_url': 'http://instagr.am/favicon.ico',
        'regexp_media_url': /^https?:\/\/instagr(?:\.am|am\.com)\/p\/([0-9a-zA-Z]+)\/$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://instagr.am/p/' + url.match(this.regexp_media_url)[1] + '/media?size=t';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://instagr.am/p/' + url.match(this.regexp_media_url)[1] + '/media';
        }
    }, {
        'provider_name': 'Mobypicture',
        'provider_url': 'http://www.mobypicture.com/',
        'provider_icon_url': null,
        'regexp_media_url': /^http:\/\/moby\.to\/([a-z0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://moby.to/' + url.match(this.regexp_media_url)[1] + ':thumb';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://moby.to/' + url.match(this.regexp_media_url)[1] + ':medium';
        }
    }, {
        'provider_name': 'フォト蔵',
        'provider_url': 'http://photozou.jp/',
        'provider_icon_url': 'http://photozou.jp/favicon.ico',
        'regexp_media_url': /^http:\/\/photozou\.jp\/photo\/show\/[0-9]+\/([0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://photozou.jp/p/thumb/' + url.match(this.regexp_media_url)[1];
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://photozou.jp/p/img/' + url.match(this.regexp_media_url)[1];
        }
    }, {
        'provider_name': '携帯百景',
        'provider_url': 'http://movapic.com/',
        'provider_icon_url': null,
        'regexp_media_url': /^http:\/\/movapic\.com\/pic\/([0-9a-zA-Z]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://image.movapic.com/pic/s_' + url.match(this.regexp_media_url)[1] + '.jpeg';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://image.movapic.com/pic/m_' + url.match(this.regexp_media_url)[1] + '.jpeg';
        }
    }, {
        'provider_name': 'ニコニコ静画',
        'provider_url': 'http://seiga.nicovideo.jp/',
        'provider_icon_url': 'http://seiga.nicovideo.jp/favicon.ico',
        'regexp_media_url': /^http:\/\/(?:seiga\.nicovideo\.jp\/seiga|nico\.ms)\/im([1-9][0-9]+)/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://lohas.nicoseiga.jp/thumb/' + url.match(this.regexp_media_url)[1] + 'q?';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://lohas.nicoseiga.jp/thumb/' + url.match(this.regexp_media_url)[1] + 'i?';
        },
        'get_htmlcode_middle': function (url) {
            return '<div style="margin:5px 0 5px 0;font-size:12px"><iframe width="312" height="176" src="http://ext.seiga.nicovideo.jp/thumb/im' + url.match(this.regexp_media_url)[1] + '" scrolling="no" style="border:solid 1px #888;" frameborder="0"></iframe><br><img src="' + this.provider_icon_url + '" width="14" height="14" style="vertical-align:middle;margin-right:3px"><span style="color:#999">' + this.provider_name + '</span></div>';
        }
    }];

    trtr.set_media_property = function (media) {
        var key, property_default;

        property_default = {
            'get_htmlcode_middle': trtr.get_media_htmlcode_middle,
            'get_htmlcode_large': trtr.get_media_htmlcode_large,
            'get_htmlcode_kml': trtr.get_media_htmlcode_middle,
            'get_attribution_middle': trtr.get_media_attribution_middle,
            'get_attribution_large': trtr.get_media_attribution_large,
            'get_attribution_textonly': trtr.get_media_attribution_textonly
        };

        for (key in property_default) {
            if (property_default.hasOwnProperty(key)) {
                if (media[key] === undefined) {
                    media[key] = property_default[key];
                }
            }
        }
    };

    trtr.get_media_htmlcode = function (tweet_entities, media_mode) {
        var i, j, urls_entities, media_htmlcode, url, match;

        if (!tweet_entities.hasOwnProperty('urls')) {
            return '';
        }

        urls_entities = tweet_entities.urls;
        media_htmlcode = '';
        for (i = 0; i < urls_entities.length; i += 1) {
            url = urls_entities[i].expanded_url;

            if (url === null) {
                url = urls_entities[i].url;
            }

            if (url) {
                for (j = 0; j < trtr.media.length; j += 1) {
                    match = url.match(trtr.media[j].regexp_media_url);
                    if (match) {
                        trtr.set_media_property(trtr.media[j]);
                        media_htmlcode += trtr.media[j]['get_htmlcode_' + media_mode](url);
                    }
                }
            }
        }

        return media_htmlcode;
    };

    trtr.templates = {
        'profile-mode': {
            'description': 'profile_description',
            'set_htmlcode': function (t) {
                var to_link, content, user_url_html, htmlcode;

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

                content = t.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                t.profile_image_url = t.profile_image_url.replace(/_normal\.([a-zA-Z]+)$/, '_reasonably_small.$1');

                if (t.user_url) {
                    user_url_html = '<div><a target="_blank" rel="me nofollow" href="' + t.user_url + '">' + t.user_url + '</a></div>';
                } else {
                    user_url_html = '<div><a target="_blank" rel="me nofollow"></a></div>';
                }

                htmlcode = '<!-- http://twitter.com/' + t.screen_name + ' -->\n';
                htmlcode += '<style type="text/css">.trtr_userid_' + t.user_id + ' a {text-decoration:none;color:#' + t.link_color + ' !important;} .trtr_userid_' + t.user_id + ' a:hover {text-decoration:underline;}</style>\n';
                htmlcode += '<div class="trtr_userid_' + t.user_id + '" style="display:block;-webkit-font-smoothing:antialiased;color:#444;font:13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-sefif"><div style="display:inline-block;padding:20px 20px 16px 20px;width:510px;background-color#fff"><div style="float:left"><a href="http://twitter.com/' + t.screen_name + '" target="_blank"><img src="' + t.profile_image_url + '" alt="' + t.user_name + '"></a></div><div style="margin-left:15px;display:inline-block;width:367px"><div style="font-weight:bold"><h2 style="line-height:36px;font-size:30px;margin:0">' + t.user_name + '</h2></div><div style="font-size:13px;line-height:22px;padding:0"><span style="font-size:18px;font-weight:bold"><a href="http://twitter.com/' + t.screen_name + '" target="_blank">@' + t.screen_name + '</a></span> ' + t.user_location + ' </div><div style="overflow:hidden;text-overflow:ellipsis;color:#777;font-family:Georgia,serif;font-size:14px;font-style:italic;">' + t.user_description + '</div>' + user_url_html + '</div></div></div>\n';
                htmlcode += '<!-- end of profile -->\n';

                t.htmlcode = htmlcode;
            },
            'uses_option': {
                'media': false,
                'preview': true,
                'showtco': false
            },
            'preview_box': '<div class="trtr-dialog-previewbox"></div>'
        },
        'tweet4kml-mode': {
            'description': 'tweet4kml_description',
            'set_htmlcode': function (t) {
                var link_style, to_link, content, entity_callback, source, htmlcode;

                entity_callback = {
                    'hashtags': function (entity) {
                        return '<span style="color:#' + t.symbol_color + '">#</span><a href="http://search.twitter.com/search?q=%23' + encodeURIComponent(entity.text) + '" style="color:#' + t.link_color + '">' + entity.text + '</a>';
                    },
                    'urls': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" style="color:#' + t.link_color + '">' + linktext + '</a>';
                    },
                    'user_mentions': function (entity, string) {
                        return '<span style="color:#' + t.symbol_color + '">@</span><a href="http://twitter.com/' + entity.screen_name + '" style="color:#' + t.link_color + '">' + string.substring(1) + '</a>';
                    },
                    'media': function (entity) {
                        var linktext;

                        if (!trtr.option.showtco && entity.hasOwnProperty('display_url')) {
                            linktext = entity.display_url;
                        } else {
                            linktext = entity.url;
                        }

                        return '<a href="' + entity.url + '" style="color:#' + t.link_color + '">' + linktext + '</a>';
                    }
                };

                link_style = ' style="color:#' + t.link_color + '"';

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
                        pre_text = '<span style="color:#' + t.symbol_color + '">#</span>';
                        text = a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + a[3];
                        pre_text = '<span style="color:#' + t.symbol_color + '">@</span>';
                        text = a[3];
                    }

                    return pre_text + '<a href="' + url + '"' + link_style + '>' + text + '</a>';
                };

                if (trtr.option.link === 'entity') {
                    content = trtr.apply_entities(t.text, t.entities, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    content = t.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                } else {
                    alert('teritori: Unknown link option \'' + trtr.option.link + '\'');
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity, link_auto;

                        if (trtr.option.link === 'entity') {
                            link_entity = content;
                            link_auto = t.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                        } else if (trtr.option.link === 'auto') {
                            link_entity = trtr.apply_entities(t.text, t.entities, entity_callback);
                            link_auto = content;
                        }

                        if (link_entity !== link_auto) {
                            alert('teritori: link_entity !== link_auto');
                            console.info('teritori: link_entity = ', link_entity);
                            console.info('teritori: link_auto =   ', link_auto);
                        }
                    }());
                }

                if (t.source === 'web') {
                    t.source = '<a href="http://twitter.com/" rel="nofollow"' + link_style + '>Twitter</a>';
                } else {
                    t.source = t.source.replace(/^<a href="([!#$%&'()*+,\-.\/0-9:;=?@A-Z\\_a-z~]+)" rel="nofollow">/, '<a href="$1" rel="nofollow"' + link_style + '>');
                }

                source = mes('format_source').replace('%s', t.source);

                htmlcode = '<div style="margin:0 .5em .3em .5em;min-height:60px;color:#' + t.text_color + ';font-size:16px"><div>' + content;

                if (trtr.option.media) {
                    htmlcode += trtr.get_media_htmlcode(t.entities, 'kml');
                }

                htmlcode += ' </div><div style="margin-bottom:.5em"><span style="font-size:12px;display:block;color:#999"><a href="http://twitter.com/' + t.screen_name + '/status/' + t.tweet_id + '"' + link_style + '>' + t.timestamp + '</a> ' + source + ' </span></div><div style="padding:.5em 0 .5em 0;width:100%;border-top:1px solid #E6E6E6"><a href="http://twitter.com/' + t.screen_name + '"' + link_style + '><img src="' + t.profile_image_url + '" alt="' + t.user_name + '" width="38" height="38" style="float:left;margin-right:7px;width:38px;padding:0;border:none"></a><strong><a href="http://twitter.com/' + t.screen_name + '"' + link_style + '>@' + t.screen_name + '</a></strong><span style="color:#999;font-size:14px"><br>' + t.user_name + ' </span></div></div>';

                t.htmlcode = htmlcode;
            },
            'uses_option': {
                'media': true,
                'preview': true,
                'showtco': true
            },
            'preview_box': '<div style="background-color:#99B3CC;padding-top:10px;padding-bottom:10px;max-height:500px;overflow:auto"><div style="background-color:#FFFFFF;border:1px solid #ababab;margin:0 auto;padding-top:16px;padding-bottom:16px;width:339px"><div class="trtr-dialog-previewbox" style="color:black;font-size:13px;font-family:arial,sans-serif;padding-bottom:.7em;max-height:400px;overflow-y:auto;line-height:normal;margin:0 auto;width:303px;word-wrap:break-word"></div></div></div>'
        },
        'tweet-mode': {
            'description': 'tweet_description',
            'set_htmlcode': function (t) {
                var to_link, content, entity_callback, background, source, htmlcode;

                entity_callback = {
                    'hashtags': function (entity) {
                        return '<a class="trtr_link" href="http://search.twitter.com/search?q=%23' + encodeURIComponent(entity.text) + '" target="_new"><span class="trtr_link_symbol">#</span><span class="trtr_link_text">' + entity.text + '</span></a>';
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
                        alert('teritori: Unknown link error');
                    }
                };

                if (trtr.option.link === 'entity') {
                    content = trtr.apply_entities(t.text, t.entities, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    content = t.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                } else {
                    alert('teritori: Unknown link option \'' + trtr.option.link + '\'');
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity, link_auto;

                        if (trtr.option.link === 'entity') {
                            link_entity = content;
                            link_auto = t.text.replace(/(http:\/\/\S+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_link);
                        } else if (trtr.option.link === 'auto') {
                            link_entity = trtr.apply_entities(t.text, t.entities, entity_callback);
                            link_auto = content;
                        }

                        if (link_entity !== link_auto) {
                            alert('teritori: link_entity !== link_auto');
                            console.info('teritori: link_entity = ', link_entity);
                            console.info('teritori: link_auto =   ', link_auto);
                        }
                    }());
                }

                background = '#' + t.background_color;
                if (t.background_image) {
                    background += ' url(' + t.background_image_url + ')';
                    if (!t.background_tile) {
                        background += ' no-repeat';
                    }
                }

                source = mes('format_source').replace('%s', t.source);

                htmlcode = '<!-- http://twitter.com/' + t.screen_name + '/status/' + t.tweet_id + ' -->\n';
                htmlcode += '<style type="text/css">.trtr_tweetid_' + t.tweet_id + ' a {text-decoration:none;color:#' + t.link_color + ' !important} .trtr_tweetid_' + t.tweet_id + ' a.trtr_link span.trtr_link_symbol {opacity:0.5} .trtr_tweetid_' + t.tweet_id + ' a:hover {text-decoration:underline} .trtr_tweetid_' + t.tweet_id + ' a.trtr_link:hover {text-decoration:none} .trtr_tweetid_' + t.tweet_id + ' a.trtr_link:hover span.trtr_link_text {text-decoration:underline} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action span em {background:transparent url(http://si0.twimg.com/images/dev/cms/intents/icons/sprites/everything-spritev2.png) no-repeat;margin:0 3px -3.5px 3px;display:inline-block;vertical-align:baseline;position:relative;outline:none;width:15px;height:15px;} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_reply span em {background-position 0 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_reply:hover span em {background-position:-16px 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_retweet span em {background-position:-80px 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_retweet:hover span em {background-position:-96px 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_favorite span em {background-position:-32px 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_favorite:hover span em {background-position:-48px 0} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_follow span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_blue/bird_16_blue.png)} .trtr_tweetid_' + t.tweet_id + ' a.trtr_action_follow:hover span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_black/bird_16_black.png)}</style>';
                htmlcode += '<div class="trtr_tweetid_' + t.tweet_id + '" style="background:' + background + ';padding:20px"><div style="background:#fff;padding:10px 12px 10px 12px;margin:0;min-height:48px;color:#' + t.text_color + ';font-size:16px !important;line-height:22px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;word-wrap:break-word">' + content;

                if (trtr.option.media) {
                    htmlcode += trtr.get_media_htmlcode(t.entities, 'large');
                }

                htmlcode += ' <div class="trtr_actions" style="color:#999;font-size:12px;display:block"><a href="https://twitter.com/intent/user?user_id=' + t.user_id + '" class="trtr_action trtr_action_follow" title="' + mes('action_follow') + '"><span><em></em></span></a> <span class="trtr_timestamp"><a title="' + t.timestamp + '" href="http://twitter.com/' + t.screen_name + '/status/' + t.tweet_id + '">' + t.timestamp + '</a> ' + source + ' </span><a href="https://twitter.com/intent/tweet?in_reply_to=' + t.tweet_id + '" class="trtr_action trtr_action_reply" title="' + mes('action_reply') + '"><span><em></em>' + mes('action_reply') + '</span></a> <a href="https://twitter.com/intent/retweet?tweet_id=' + t.tweet_id + '" class="trtr_action trtr_action_retweet" title="' + mes('action_retweet') + '"><span><em></em>' + mes('action_retweet') + '</span></a> <a href="https://twitter.com/intent/favorite?tweet_id=' + t.tweet_id + '" class="trtr_action trtr_action_favorite" title="' + mes('action_favorite') + '"><span><em></em>' + mes('action_favorite') + '</span></a> </div><span class="trtr_metadata" style="display:block;width:100%;clear:both;margin-top:8px;padding-top:12px;height:40px;border-top:1px solid #fff;border-top:1px solid #e6e6e6;"><span class="trtr_author" style="color:#999;line-height:19px;"><a href="http://twitter.com/' + t.screen_name + '"><img src="' + t.profile_image_url + '" style="float:left;margin:0 7px 0 0;width:38px;height:38px;" /></a><strong><a href="http://twitter.com/' + t.screen_name + '">' + t.user_name + '</a></strong><br/>@' + t.screen_name + '</span></span></div></div>\n';
                htmlcode += '<!-- end of tweet -->\n';

                t.htmlcode = htmlcode;
            },
            'uses_option': {
                'media': true,
                'preview': true,
                'showtco': true
            },
            'preview_box': '<div class="trtr-dialog-previewbox" style="max-height:400px;overflow:auto"></div>'
        }
    };

    trtr.display_htmlcode = function (tweet) {
        var t;

        trtr.cached_json['statuses/show/' + tweet.id_str] = tweet;

        if (tweet.retweeted_status) {
            tweet = tweet.retweeted_status;
        }

        t = {};
        t.tweet_id = tweet.id_str;
        t.source = tweet.source;

        t.screen_name = tweet.user.screen_name;
        t.user_name = tweet.user.name;
        t.user_id = tweet.user.id_str;
        t.user_description = (tweet.user.description === null) ? '' : tweet.user.description;
        t.user_location = (tweet.user.location === null) ? '' : tweet.user.location;
        t.user_url = tweet.user.url;
        t.background_image = tweet.user.profile_use_background_image;
        t.background_image_url = tweet.user.profile_background_image_url;
        t.background_tile = tweet.user.profile_background_tile;
        t.profile_image_url = tweet.user.profile_image_url;
        t.background_color = tweet.user.profile_background_color;
        t.text_color = tweet.user.profile_text_color;
        t.link_color = tweet.user.profile_link_color;
        t.symbol_color = trtr.get_color_blended_by_opacity(t.link_color);
        t.timestamp = trtr.get_timestamp(tweet.created_at);
        t.text = tweet.text;
        t.entities = tweet.entities;

        if (trtr.templates.hasOwnProperty(trtr.option.mode)) {
            trtr.templates[trtr.option.mode].set_htmlcode(t);
        } else {
            alert('teritori: Unknown mode \'' + trtr.option.mode.toString() + '\'');
            return;
        }

        if (t.htmlcode === undefined) {
            t.htmlcode = '';
        }

        trtr.display_dialog(t);
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
            jsonp.src = 'https://api.twitter.com/1/statuses/show.json?include_entities=true&contributor_details=true&callback=teritori.display_htmlcode&id=' + id;
            document.getElementsByTagName('head')[0].appendChild(jsonp);
        }
    };

    trtr.reload = function () {
        trtr.load_jsonp('repeat');
    };

    trtr.main = function () {
        var url, matches;

        trtr.option = trtr.get_option_from_cfg(trtr.cfg);

        if (!trtr.cached_json) {
            trtr.cached_json = {};
        }

        url = document.location.href;
        matches = url.match(/^https?:\/\/twitter\.com(\/#(\!|%21))?(\/([a-zA-Z0-9_]{1,15})(\/status(es)?\/([1-9][0-9]+))?)?/);
        if (!matches) {
            alert('teritori can use only twitter.com.');
            return;
        }

        if (matches[7]) {
            trtr.load_jsonp(matches[7]);
        } else if (trtr.new_twitter) {
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
        } else {
            $('.hentry').live('mouseover', function () {
                var actions, tweet_link, tweet_id, action_gethtml;

                actions = $(this).children('.status-body').children('.actions-hover');
                if (actions && actions.find('.trtr_gethtml').length === 0) {
                    tweet_link = actions.siblings('.entry-meta').children('.entry-date').attr('href');
                    tweet_id = (tweet_link.match(/^https?:\/\/twitter\.com\/(#\!\/)?([a-zA-Z0-9_]{1,15})\/status(es)?\/([1-9][0-9]+)/))[4];
                    action_gethtml = $('<li style="line-height:16px"><span><a href="#" class="trtr_gethtml" style="padding-left:18px"><span>GetHTML</span></a></span></li>');
                    actions.prepend(action_gethtml);
                    action_gethtml.click(function () {
                        trtr.load_jsonp(tweet_id);
                        return false;
                    });
                }
            });
        }
    };

    trtr.main();
}());
