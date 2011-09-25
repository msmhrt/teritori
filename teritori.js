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

    var trtr, mes, escape_html, normalize_html, percent_encode;

    trtr = window.teritori;

    mes = function (key) {
        return trtr.lang[trtr.option.lang][key];
    };

    trtr.escape_html = function (text) {
        if (text === null || text === undefined) {
            return '';
        }

        return text.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');
    };

    escape_html = trtr.escape_html;

    trtr.normalize_html = function (text) {
        var escaped_text, strings, i, match;

        if (text === null || text === undefined) {
            return '';
        }

        strings = text.toString().split('&');

        if (trtr.option.debug) {
            console.info('teritori: strings = ', strings);
        }

        escaped_text = strings[0];
        for (i = 1; i < strings.length; i += 1) {
            match = strings[i].match(/^(?:((?:l(?:e(?:ft(?:right(?:squigarrow|harpoons|arrows?)|(?:leftarrow|threetime)s|harpoon(?:down|up)|arrow(?:tail)?)|s(?:s(?:(?:eq?q)?gtr|approx|dot|sim)|dot(?:or?)?|g(?:es)?|cc)?|q(?:slant|q)?|g)?|o(?:ng(?:(?:lef(?:trigh)?|righ)tarrow|mapsto)|oparrow(?:righ|lef)t|p(?:lus|ar|f)|w(?:ast|bar)|z(?:enge|f)?|a(?:ng|rr)|times|brk)|a(?:rr(?:b(?:fs)?|[pt]l|sim|fs|hk|lp)?|t(?:ail|es?)?|ng(?:le|d)?|emptyv|cute|gran|mbda|quo|p)|t(?:r(?:i[ef]?|Par)|(?:ques|do)t|c(?:ir|c)|hree|imes|larr)?|s(?:q(?:uor?|b)|im[eg]?|aquo|trok|cr|h)|b(?:r(?:k(?:sl[du]|e)|ac[ek])|arr|brk)|n(?:ap(?:prox)?|e(?:q?q)?|sim|E)|r(?:(?:corne|ar)r|hard?|tri|m)|d(?:r(?:us|d)har|quor?|ca|sh)|l(?:(?:corne|ar)r|hard|tri)?|(?:(?:ur(?:ds|u)h|H)a|Bar)r|m(?:oust(?:ache)?|idot)|c(?:ed?il|aron|ub|y)|h(?:ar(?:ul?|d)|blk)|f(?:(?:loo)?r|isht)|v(?:ertneqq|nE)|A(?:a?rr|tail)|par(?:lt)?|Eg?|gE?|jcy)|n(?:s(?:u(?:[bp](?:[Ee]|set(?:eq?q)?)?|cc(?:eq)?)|hort(?:parallel|mid)|c(?:(?:cu)?e|r)?|im(?:eq?)?|qsu[bp]e|mid|par)|l(?:e(?:f(?:trigh)?tarrow|q(?:slant|q)?|s?s)?|(?:[Aa]r|d)r|t(?:rie?)?|sim|E)|v(?:l(?:t(?:rie)?|Arr|e)|r(?:trie|Arr)|[Dd]ash|g[et]|infin|Harr|sim|ap)|p(?:r(?:e(?:c(?:eq)?)?|cue)?|ar(?:(?:alle|s)l|t)?|olint)|e(?:ar(?:r(?:ow)?|hk)|s(?:ear|im)|xists?|quiv|Arr|dot)?|a(?:p(?:prox|id|os|E)?|tur(?:als?)?|cute|bla|ng)|o(?:t(?:in(?:v[abc]|dot|E)?|ni(?:v[abc])?)?|pf)|t(?:riangle(?:righ|lef)t(?:eq)?|ilde|gl|lg)|c(?:ong(?:dot)?|a(?:ron|p)|edil|up|y)|g(?:e(?:q(?:slant|q)?|s)?|sim|tr?|E)|w(?:ar(?:r(?:ow)?|hk)|(?:nea|Ar)r)|r(?:ightarrow|arr[cw]?|trie?|Arr)|L(?:ef(?:trigh)?tarrow|tv?|l)|(?:h(?:[Aa]r|pa)|f)r|u(?:m(?:ero|sp)?)?|(?:V[Dd]|d)ash|b(?:umpe?|sp)|i(?:sd?|v)?|G(?:tv?|g)|Rightarrow|jcy|mid)|s(?:u(?:p(?:[123E]|s(?:et(?:n?eq?q)?|u[bp]|im)|d(?:sub|ot)|hs(?:ol|ub)|e(?:dot)?|n[Ee]|larr|mult|plus)?|b(?:s(?:et(?:n?eq?q)?|u[bp]|im)|(?:mul|do)t|e(?:dot)?|n[Ee]|plus|rarr|E)?|cc(?:n(?:approx|eqq|sim)|(?:curly)?eq|approx|sim)?|ng|m)|c(?:[Ey]|n(?:sim|ap|E)|a(?:ron|p)|e(?:dil)?|polint|cue|irc|sim)?|e(?:ar(?:r(?:ow)?|hk)|tm(?:inus|n)|(?:swa|Ar)r|[cx]t|mi)|q(?:su[bp](?:set(?:eq)?|e)?|u(?:ar[ef]|f)?|c[au]ps?)|m(?:a(?:llsetminus|shp)|i(?:le|d)|t(?:es?)?|eparsl)|i(?:m(?:[gl]E?|plus|rarr|dot|eq?|ne)?|gma[fv]?)|h(?:ort(?:parallel|mid)|(?:(?:ch)?c)?y|arp)|t(?:r(?:aight(?:epsilon|phi)|ns)|arf?)|w(?:ar(?:r(?:ow)?|hk)|(?:nwa|Ar)r)|o(?:l(?:b(?:ar)?)?|ftcy|pf)|s(?:etmn|mile|tarf|cr)|pa(?:des(?:uit)?|r)|fr(?:own)?|dot[be]?|[lr]arr|acute|bquo|zlig)|N(?:o(?:t(?:S(?:u(?:cceeds(?:(?:Slant)?Equal|Tilde)?|(?:per|b)set(?:Equal)?)|quareSu(?:per|b)set(?:Equal)?)|Le(?:ss(?:(?:Slant)?Equal|Greater|Tilde|Less)?|ftTriangle(?:Equal|Bar)?)|Greater(?:(?:Slant|Full)?Equal|Greater|Tilde|Less)?|R(?:ightTriangle(?:Equal|Bar)?|everseElement)|Nested(?:GreaterGreater|LessLess)|E(?:qual(?:Tilde)?|lement|xists)|Tilde(?:(?:Full)?Equal|Tilde)?|Precedes(?:(?:Slant)?Equal)?|(?:Double)?VerticalBar|Hump(?:DownHump|Equal)|C(?:ongruent|upCap))?|nBreakingSpace|Break|pf)|e(?:(?:gative(?:Thi(?:ck|n)|VeryThin|Medium)Spac|wLin)e|sted(?:GreaterGreater|LessLess))|c(?:aron|edil|y)|(?:acut|tild)e|(?:sc|f)r|Jcy|u)|r(?:i(?:ght(?:(?:left(?:harpoon|arrow)|rightarrow|threetime)s|harpoon(?:down|up)|arrow(?:tail)?|squigarrow)|singdotseq|ng)|a(?:rr(?:[cw]|b(?:fs)?|[al]p|[pt]l|sim|fs|hk)?|t(?:io(?:nals)?|ail)|ng(?:l?e|d)?|c(?:ut)?e|emptyv|dic|quo)|o(?:p(?:lus|ar|f)|a(?:ng|rr)|times|brk)|b(?:r(?:k(?:sl[du]|e)|ac[ek])|arr|brk)|t(?:ri(?:[ef]|ltri)?|hree|imes)|e(?:al(?:part|ine|s)?|ct|g)|s(?:q(?:uor?|b)|aquo|cr|h)|(?:(?:uluh|H)a|[Br]ar)r|d(?:ldhar|quor?|ca|sh)|p(?:ar(?:gt)?|polint)|c(?:ed?il|aron|ub|y)|h(?:ar(?:ul?|d)|ov?)|f(?:(?:loo)?r|isht)|l(?:(?:ar|ha)r|m)|A(?:a?rr|tail)|moust(?:ache)?|nmid|x)|c(?:u(?:r(?:ly(?:eq(?:pre|suc)c|(?:wedg|ve)e)|vearrow(?:righ|lef)t|arrm?|ren)|p(?:(?:c[au]|brca)p|dot|or|s)?|e(?:pr|sc)|darr[lr]|larrp?|vee|wed)|o(?:m(?:p(?:le(?:ment|xes)|fn)?|mat?)|p(?:y(?:sr)?|rod|f)|n(?:g(?:dot)?|int)|lon(?:eq?)?)|ir(?:[Ee]|c(?:le(?:d(?:[RS]|circ|dash|ast)|arrow(?:righ|lef)t)|eq)?|fnint|scir|mid)?|a(?:p(?:(?:c[au]|brcu)p|and|dot|s)?|r(?:et|on)|cute)|c(?:a(?:ron|ps)|ups(?:sm)?|edil|irc)|e(?:n(?:terdo)?t|mptyv|dil)|h(?:ec(?:kmar)?k|cy|i)|(?:w(?:con)?in|t?do)t|s(?:u[bp]e?|cr)|lubs(?:uit)?|r(?:arr|oss)|ylcty|fr)|b(?:ig(?:o(?:(?:time|plu)s|dot)|triangle(?:down|up)|c(?:[au]p|irc)|s(?:qcup|tar)|(?:wedg|ve)e|uplus)|o(?:x(?:(?:(?:min|pl)u|time)s|[Vv][HLRhlr]?|[DUdu][LRlr]|[Hh][DUdu]?|box)|t(?:tom)?|wtie|pf)|l(?:a(?:ck(?:triangle(?:(?:righ|lef)t|down)?|(?:lozeng|squar)e)|nk)|k(?:1[24]|34)|ock)|a(?:ck(?:sim(?:eq)?|epsilon|prime|cong)|r(?:wed(?:ge)?|vee))|e(?:t(?:[ah]|ween)|cause?|mptyv|rnou|psi)|s(?:ol(?:(?:hsu)?b)?|ime?|emi|cr)|u(?:mp(?:eq?|E)?|ll(?:et)?)|n(?:e(?:quiv)?|ot)|r(?:vbar|eve)|(?:brkt)?brk|c(?:ong|y)|karow|prime|dquo|Not|fr)|L(?:e(?:ft(?:(?:Up(?:(?:Down|Tee)Vecto|Vecto(?:rBa)?)|Vecto(?:rBa)?|Floo)r|Do(?:wn(?:Vecto(?:rBa)?|TeeVecto)r|ubleBracket)|T(?:riangle(?:Equal|Bar)?|ee(?:Vector|Arrow)?)|A(?:rrow(?:RightArrow|Bar)?|ngleBracket)|Right(?:Vector|Arrow)|(?:right)?arrow|Ceiling)|ss(?:(?:Slant|Full)Equal|(?:Equal)?Greater|Tilde|Less))|o(?:(?:ng(?:(?:Lef(?:tRigh)?|Righ)tA|(?:lef(?:trigh)?|righ)ta)|wer(?:Righ|Lef)tA)rrow|pf)|a(?:placetrf|cute|mbda|ng|rr)|c(?:aron|edil|y)|l(?:eftarrow)?|s(?:trok|cr|h)|(?:mido)?t|Jcy|fr|T)|D(?:o(?:uble(?:L(?:ong(?:Lef(?:tRigh)?|Righ)tArrow|eft(?:(?:Right)?Arrow|Tee))|Right(?:Arrow|Tee)|Up(?:Down)?Arrow|ContourIntegral|Do(?:wnArrow|t)|VerticalBar)|wn(?:(?:Left(?:(?:Right|Tee)Vecto|Vecto(?:rBa)?)|Right(?:Vecto(?:rBa)?|TeeVecto))r|Arrow(?:UpArrow|Bar)?|Tee(?:Arrow)?|Breve|arrow)|t(?:Equal|Dot)?|pf)|i(?:a(?:critical(?:(?:Acut|Grav|Tild)e|Do(?:ubleAcute|t))|mond)|fferentialD)|a(?:(?:gge|r)r|shv)|D(?:otrahd)?|s(?:trok|cr)|c(?:aron|y)|el(?:ta)?|[JSZ]cy|fr)|d(?:o(?:wn(?:harpoon(?:righ|lef)t|downarrows|arrow)|t(?:(?:min|pl)us|eq(?:dot)?|square)?|ublebarwedge|llar|pf)|i(?:v(?:ide(?:ontimes)?|onx)?|am(?:ond(?:suit)?|s)?|gamma|sin|e)|a(?:(?:gge|r)r|leth|shv?)|r(?:c(?:orn|rop)|bkarow)|d(?:a(?:gge|r)r|otseq)?|(?:u(?:ar|ha)|Ar|Ha)r|s(?:c[ry]|trok|ol)|e(?:mptyv|lta|g)|b(?:karow|lac)|z(?:igrarr|cy)|lc(?:orn|rop)|t(?:rif?|dot)|c(?:aron|y)|f(?:isht|r)|har[lr]|wangle|jcy)|R(?:ight(?:(?:Up(?:(?:Down|Tee)Vecto|Vecto(?:rBa)?)|Vecto(?:rBa)?|Floo)r|Do(?:wn(?:Vecto(?:rBa)?|TeeVecto)r|ubleBracket)|T(?:riangle(?:Equal|Bar)?|ee(?:Vector|Arrow)?)|A(?:rrow(?:LeftArrow|Bar)?|ngleBracket)|Ceiling|arrow)|e(?:verse(?:E(?:quilibrium|lement)|UpEquilibrium))?|a(?:rr(?:tl)?|cute|ng)|o(?:undImplies|pf)|c(?:aron|edil|y)|(?:Bar|f)r|rightarrow|uleDelayed|s(?:cr|h)|EG|ho)|e(?:q(?:s(?:lant(?:less|gtr)|im)|u(?:iv(?:DD)?|als|est)|c(?:olon|irc)|vparsl)|m(?:pty(?:set|v)?|sp(?:1[34])?|acr)|x(?:p(?:onentiale|ectation)|ist|cl)|p(?:si(?:lon|v)?|ar(?:sl)?|lus)|l(?:s(?:dot)?|inters|l)?|c(?:(?:ar|ol)on|irc?|y)|g(?:s(?:dot)?|rave)?|a(?:cute|ster)|s(?:dot|cr|im)|r(?:Dot|arr)|(?:D?D|d)ot|o(?:gon|pf)|f(?:Dot|r)|u(?:ml|ro)|n(?:sp|g)|t[ah]|e)|t(?:r(?:i(?:angle(?:(?:righ|lef)t(?:eq)?|down|q)?|(?:min|pl)us|(?:tim)?e|dot|sb)|pezium|ade)|h(?:e(?:re(?:fore|4)|ta(?:sym|v)?)|i(?:ck(?:approx|sim)|nsp)|k(?:sim|ap)|orn)|o(?:p(?:f(?:ork)?|bot|cir)?|[es]a)|w(?:ohead(?:righ|lef)tarrow|ixt)|i(?:mes(?:b(?:ar)?|d)?|lde|nt)|s(?:c[ry]|trok|hcy)|c(?:aron|edil|y)|a(?:rget|u)|elrec|prime|brk|dot|fr)|p(?:r(?:e(?:c(?:n(?:approx|eqq|sim)|(?:curly)?eq|approx|sim)?)?|o(?:f(?:alar|line|surf)|p(?:to)?|d)|n(?:sim|ap|E)|imes?|urel|cue|sim|ap|E)?|l(?:us(?:[be]|a?cir|d[ou]|sim|two|mn)?|an(?:ckh?|kv))|ar(?:a(?:llel)?|s(?:im|l)|t)?|er(?:tenk|cnt|iod|mil|p)|o(?:intint|und|pf)|h(?:mmat|iv?|one)|i(?:tchfork|v)?|s(?:cr|i)|uncsp|cy|fr|m)|u(?:p(?:harpoon(?:righ|lef)t|(?:uparrow|lu)s|(?:down)?arrow|si(?:lon|h)?)|r(?:c(?:orn(?:er)?|rop)|ing|tri)|l(?:c(?:orn(?:er)?|rop)|tri)|d(?:(?:ar|ha)r|blac)|t(?:ilde|rif?|dot)|(?:wangl|grav)e|h(?:ar[lr]|blk)|(?:Ar|Ha|sc)r|a(?:cute|rr)|br(?:eve|cy)|f(?:isht|r)|o(?:gon|pf)|u(?:arr|ml)|c(?:irc|y)|m(?:acr|l))|C(?:o(?:n(?:(?:grue|i)nt|tourIntegral)|unterClockwiseContourIntegral|p(?:roduct|f)|lone?)|lo(?:seCurly(?:Double)?Quote|ckwiseContourIntegral)|a(?:p(?:italDifferentialD)?|yleys|cute)|ircle(?:(?:(?:Min|Pl)u|Time)s|Dot)|c(?:onint|aron|edil|irc)|e(?:nterDot|dilla)|u(?:pCa)?p|(?:sc|f)r|ross|Hcy|OPY|dot|hi)|S(?:u(?:c(?:ceeds(?:(?:Slant)?Equal|Tilde)?|hThat)|p(?:erset(?:Equal)?|set)?|b(?:set(?:Equal)?)?|m)|q(?:uare(?:Su(?:per|b)set(?:Equal)?|(?:Intersect|Un)ion)?|rt)|hort(?:(?:Righ|Lef)t|Down|Up)Arrow|c(?:aron|edil|irc|y)?|(?:mallCircl|acut)e|(?:(?:HC)?H|OFT)cy|(?:sc|ta|f)r|igma|opf)|U(?:p(?:(?:(?:per(?:Righ|Lef)t|Down)A|(?:down)?a)rrow|Arrow(?:DownArrow|Bar)?|Tee(?:Arrow)?|Equilibrium|si(?:lon)?)|n(?:der(?:B(?:rac(?:ket|e)|ar)|Parenthesis)|ion(?:Plus)?)|a(?:r(?:roci)?r|cute)|(?:(?:ma|s)c|f)r|(?:grav|tild)e|br(?:eve|cy)|o(?:gon|pf)|c(?:irc|y)|dblac|ring|uml)|a(?:n(?:g(?:msd(?:a[abcdefgh])?|rt(?:vbd?)?|s(?:ph|t)|zarr|l?e)?|d(?:(?:an)?d|slope|v)?)|p(?:[Ee]|prox(?:eq)?|acir|id|os)?|(?:(?:bre|gra)v|acut|tild)e|l(?:e(?:fsym|ph)|pha)|s(?:ymp(?:eq)?|cr|t)|c(?:[Edy]|irc|ute)?|m(?:a(?:cr|lg)|p)|(?:eli|rin)g|w(?:con)?int|o(?:gon|pf)|fr?|uml)|o(?:r(?:d(?:[fm]|er(?:of)?)?|(?:ar|o)r|slope|igof|v)?|m(?:i(?:cron|nus|d)|acr|ega)|l(?:c(?:ross|ir)|arr|ine|t)|d(?:blac|sold|ash|iv|ot)|ti(?:me(?:sa)?s|lde)|(?:f(?:ci)?|vba)r|p(?:erp|lus|ar)|s(?:lash|cr|ol)|g(?:rave|on|t)|a(?:cute|st)|c(?:irc?|y)|h(?:bar|m)|elig|int|opf|uml|S)|g(?:t(?:r(?:(?:eq?q)?less|a(?:pprox|rr)|dot|sim)|(?:ques|do)t|c(?:ir|c)|lPar)?|e(?:s(?:dot(?:ol?)?|l(?:es)?|cc)?|q(?:slant|q)?|l)?|n(?:ap(?:prox)?|e(?:q?q)?|sim|E)|a(?:mmad?|cute|p)|s(?:im[el]?|cr)|v(?:ertneqq|nE)|(?:bre|ra)ve|c(?:irc|y)|l[Eaj]?|imel|El?|dot|g?g|jcy|opf|fr)|i(?:n(?:t(?:e(?:gers|rcal)|larhk|prod|cal)?|fin(?:tie)?|care|odot)?|m(?:a(?:g(?:(?:lin)?e|part)|cr|th)|ped|of)|s(?:in(?:[Ev]|dot|sv?)?|cr)|i(?:i?int|nfin|ota)?|o(?:gon|cy|pf|ta)|(?:acut|grav)e|c(?:irc|y)?|e(?:xcl|cy)|u(?:kcy|ml)|t(?:ilde)?|f[fr]|quest|jlig|prod)|v(?:a(?:r(?:t(?:riangle(?:righ|lef)t|heta)|s(?:u[bp]setneq?q|igma)|p(?:ropto|h?i)|r(?:ho)?|epsilon|nothing|kappa)|ngrt)|e(?:e(?:bar|eq)?|r(?:bar|t)|llip)|s(?:u[bp]n[Ee]|cr)|(?:Ar|f)r|[Dd]ash|[lr]tri|nsu[bp]|zigzag|Barv?|prop|opf|cy)|m(?:a(?:p(?:sto(?:down|left|up)?)?|l(?:t(?:ese)?|e)|(?:rke|c)r)|i(?:d(?:(?:as|do)t|cir)?|nus(?:du?|b)?|cro)|u(?:(?:lti)?map)?|easuredangle|o(?:dels|pf)|s(?:tpos|cr)|c(?:omma|y)|l(?:cp|dr)|nplus|DDot|dash|fr|ho|p)|h(?:o(?:ok(?:righ|lef)tarrow|(?:rba|ar)r|mtht|pf)|a(?:r(?:r(?:cir|w)?|dcy)|irsp|milt|lf)|e(?:arts(?:uit)?|llip|rcon)|s(?:lash|trok|cr)|y(?:bull|phen)|(?:Ar|ba|f)r|ks[ew]arow|circ)|E(?:m(?:pt(?:yVer)?ySmallSquare|acr)|qu(?:al(?:Tilde)?|ilibrium)|x(?:ponentialE|ists)|c(?:aron|irc|y)|(?:acut|grav)e|(?:lemen|do)t|o(?:gon|pf)|s(?:cr|im)|psilon|uml|NG|TH|fr|ta)|I(?:n(?:t(?:e(?:rsection|gral))?|visible(?:Comma|Times))|m(?:a(?:ginaryI|cr)|plies)?|(?:acut|grav|tild)e|o(?:gon|pf|ta)|u(?:kcy|ml)|c(?:irc|y)|(?:sc|f)r|[EO]cy|Jlig|dot)|O(?:(?:(?:penCurly(?:Double)?Quo|acu)t|grav)e|ver(?:B(?:rac(?:ket|e)|ar)|Parenthesis)|m(?:icron|acr|ega)|ti(?:lde|mes)|s(?:lash|cr)|c(?:irc|y)|dblac|Elig|f?r|opf|uml)|f(?:r(?:a(?:c(?:1[234568]|3[458]|2[35]|5[68]|45|78)|sl)|own)|o(?:r(?:all|kv?)|pf)|f(?:(?:l?|i)lig|r)|l(?:lig|tns|at)|allingdotseq|[ij]lig|partint|emale|nof|scr|cy)|T(?:h(?:e(?:refore|ta)|i(?:ck|n)Space)|ilde(?:(?:Full)?Equal|Tilde)?|c(?:aron|edil|y)|s(?:trok|cr)|ripleDot|SH?cy|a[bu]|HORN|RADE|opf|fr)|G(?:[Tg]|reater(?:(?:Slant|Full)Equal|Equal(?:Less)?|Greater|Tilde|Less)|c(?:edil|irc|y)|(?:sc|f)r|(?:do)?t|ammad?|breve|Jcy|opf)|P(?:r(?:ecedes(?:(?:Slant)?Equal|Tilde)?|o(?:portion(?:al)?|duct)|ime)?|o(?:incareplane|pf)|s(?:cr|i)|lusMinus|artialD|h?i|cy|fr)|A(?:(?:(?:bre|gra)v|acut|tild)e|(?:Eli|rin)g|pplyFunction|s(?:sign|cr)|o(?:gon|pf)|(?:mac|f)r|c(?:irc|y)|lpha|uml|MP|nd)|x(?:o(?:p(?:lus|f)|time|dot)|(?:[hlr][Aa]r|f)r|c(?:[au]p|irc)|u(?:plus|tri)|(?:wedg|ve)e|s(?:qcup|cr)|(?:dtr)?i|map|nis)|V(?:e(?:r(?:t(?:ical(?:(?:Separato|Ba)r|(?:Tild|Lin)e))?|yThinSpace|bar)|e)|(?:ba|sc|f)r|(?:vd|D)ash|dashl?|opf|cy)|H(?:ump(?:DownHump|Equal)|o(?:rizontalLine|pf)|s(?:trok|cr)|ilbertSpace|a(?:cek|t)|ARDcy|circ|fr)|B(?:a(?:r(?:wed|v)|ckslash)|e(?:rnoullis|cause|ta)|(?:sc|f)r|umpeq|reve|opf|cy)|F(?:illed(?:Very)?SmallSquare|o(?:(?:uriertr|p)f|rAll)|(?:sc|f)r|cy)|z(?:(?:igrar|sc|f)r|e(?:etrf|ta)|c(?:aron|y)|acute|wn?j|dot|hcy|opf)|Z(?:e(?:roWidthSpace|ta)|c(?:aron|y)|(?:sc|f)r|acute|Hcy|dot|opf)|q(?:u(?:at(?:ernions|int)|est(?:eq)?|ot)|(?:sc|f)r|prime|int|opf)|w(?:e(?:d(?:geq?|bar)|ierp)|r(?:eath)?|(?:sc|f)r|circ|opf|p)|y(?:ac(?:ute|y)|c(?:irc|y)|u(?:cy|ml)|(?:sc|f)r|icy|opf|en)|M(?:e(?:diumSpace|llintrf)|(?:sc|f)r|inusPlus|opf|ap|cy|u)|k(?:c(?:edil|y)|(?:sc|f)r|[hj]cy|appav?|green|opf)|Y(?:c(?:irc|y)|(?:sc|f)r|[AIU]cy|acute|opf|uml)|j(?:s(?:ercy|cr)|c(?:irc|y)|math|ukcy|opf|fr)|K(?:c(?:edil|y)|(?:sc|f)r|[HJ]cy|appa|opf)|J(?:s(?:ercy|cr)|c(?:irc|y)|ukcy|opf|fr)|#(?:\d+|[Xx][\dABCDEFabcdef]+)|W(?:(?:sc|f)r|circ|edge|opf)|Q(?:(?:sc|f)r|UOT|opf)|X(?:(?:sc|f)r|opf|i));)|((?:a(?:(?:acut|grav|tild)e|(?:eli|rin)g|c(?:irc|ute)|uml|mp)|A(?:(?:acut|grav|tild)e|(?:Eli|rin)g|circ|uml|MP)|o(?:(?:acut|grav|tild)e|rd[fm]|slash|circ|uml)|i(?:(?:acut|grav)e|(?:exc|um)l|quest|circ)|O(?:(?:acut|grav|tild)e|slash|circ|uml)|c(?:e(?:dil|nt)|cedil|urren|opy)|E(?:(?:acut|grav)e|circ|uml|TH)|e(?:(?:acut|grav)e|circ|uml|th)|u(?:(?:acut|grav)e|circ|u?ml)|I(?:(?:acut|grav)e|circ|uml)|U(?:(?:acut|grav)e|circ|uml)|s(?:up[123]|zlig|ect|hy)|m(?:i(?:ddot|cro)|acr)|p(?:lusmn|ound|ara)|n(?:tilde|bsp|ot)|y(?:acute|uml|en)|(?:Ntild|Yacut)e|frac(?:1[24]|34)|C(?:cedil|OPY)|t(?:horn|imes)|(?:[GL]|QUO)T|d(?:ivide|eg)|r(?:aquo|eg)|l(?:aquo|t)|(?:quo|g)t|brvbar|THORN|REG)))/);
            if (match) {
                if (trtr.option.debug) {
                    console.info('teritori: match = ', match);
                }

                if (match[1] !== undefined) {
                    escaped_text += ('&' + strings[i]);
                } else if (match[2] !== undefined) {
                    escaped_text += ('&' + match[2] + ';' + strings[i].slice(match[2].length));
                } else {
                    alert('teritori: RegExp in trtr.normalize_html() is corrputed.');
                }
            } else {
                escaped_text += ('&amp;' + strings[i]);
            }
        }

        return escaped_text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');
    };

    normalize_html = trtr.normalize_html;

    trtr.percent_encode = function (text) {
        if (text === null || text === undefined) {
            return '';
        }

        return encodeURIComponent(text).replace(/[!*'()]/g, function (m) {
            return '%' + m.charCodeAt(0).toString(16).toUpperCase();
        });
    };

    percent_encode = trtr.percent_encode;

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
            'format_source_html': 'via %s',
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
            'format_source_html': '%sから',
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
            'media': false,
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

        dialog_html = '<div class="trtr-dialog" style="text-align:left;position:fixed;z-index:21;font: 13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-serif;width:560px;height:auto;-webkit-box-shadow:0 3px 0 rgba(0,0,0,0.1);background-color:rgba(0,0,0,0.8);border-radius:5px;box-shadow:0 3px 0 rgba(0,0,0,0.1);display:block;margin:0;padding:6px;"><div class="trtr-dialog-header" style="position:relative;border-top-radius:4px;cursor:move;display:block;margin:0;padding:0"><h3 style="color:#fff;font-size:15px;font-weight:bold;margin:0;padding:2px 15px 7px 5px">teritori</h3><div class="trtr-dialog-close" style="position:absolute;cursor:pointer;top:3px;font:bold 16px Tahoma,sans-serif;right:0%;line-height: 18px;color:white;width:20px;height:20px;text-align:center;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;background: rgba(0, 0, 0, 0.3);margin:0;padding:0"><b>×</b></div></div><div class="trtr-dialog-content" style="-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;background-color:#fff;box-shadow: 0 1px 1px rgba(0,0,0,0.2);padding:10px 15px 10px 15px"><div style="margin-bottom:10px"><span style="margin-right:0.5em"><strong>' + escape_html(mes('option_mode')) + '</strong></span><select class="trtr-mode-select-menu"></select><span style="margin-left:1em;margin-right:0.5em"><strong>' + escape_html(mes('option_lang')) + '</strong></span><select class="trtr-lang-select-menu"></select></div><div class="trtr-dialog-textarea" style="margin-bottom:5px"><textarea class="trtr-textarea" style="font: 14px/18px \'Helvetica Neue\',Arial,sans-serif;width:512px;height:106px;border:1px solid #CCC;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;padding:8px;-webkit-box-shadow:0 1px white;-moz-box-shadow:0 1px white;box-shadow:0 1px white;">' + escape_html(t.tweet_html) + '</textarea></div><div>';
        dialog_html += '<input class="trtr-dialog-preview-checkbox" type="checkbox" > <strong>' + escape_html(mes('option_preview')) + '</strong>';
        dialog_html += '<input class="trtr-dialog-showtco-checkbox" style="margin-left:1em" type="checkbox" > <strong>' + escape_html(mes('option_showtco')) + '</strong>';
        dialog_html += '<input class="trtr-dialog-media-checkbox" style="margin-left:1em" type="checkbox" > <strong>' + escape_html(mes('option_media')) + '</strong>';
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
            trtr_mode_select_menu.append($('<option value="' + escape_html(mode_list[i][0]) + '">' + escape_html(mode_list[i][1]) + '</option>'));
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
            trtr_lang_select_menu.append($('<option value="' + escape_html(lang_list[i][0]) + '">' + escape_html(lang_list[i][1]) + '</option>'));
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
            trtr_dialog.find('.trtr-dialog-previewbox').append(t.tweet_html);
        } else {
            trtr_preview_checkbox.attr('checked', '');
        }

        if (trtr.templates[trtr.option.mode].uses_option.preview && t.needs_option.preview) {
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

        if (trtr.templates[trtr.option.mode].uses_option.showtco && t.needs_option.showtco) {
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

        if (trtr.templates[trtr.option.mode].uses_option.media && t.needs_option.media) {
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

    trtr.apply_entities = function (t, entity_callback) {
        var i, j, text, entities, key, index, start, end, linked_text, entity_list, entity;

        text = t.text;
        entities = t.entities;

        entity_list = [];
        for (key in entities) {
            if ((typeof entities[key] !== 'function') && (entities[key].length !== 0)) {
                for (j = 0; j < entities[key].length; j += 1) {
                    entity_list.push([key, entities[key][j]]);
                }
            }
        }

        if (entity_list.length === 0) {
            return normalize_html(text);
        }

        entity_list.sort(function (a, b) {
            return a[1].indices[0] - b[1].indices[0];
        });

        index = 0;
        linked_text = '';
        for (i = 0; i < entity_list.length; i += 1) {
            entity = entity_list[i];
            if (!entity_callback.hasOwnProperty(entity[0])) {
                alert('teritori: Unknown parameter \'' + escape_html(entity[0]) + '\' in entity');
                return normalize_html(text);
            }

            start = entity[1].indices[0];
            end = entity[1].indices[1];

            if (index > start || start > end || end > text.length) {
                alert('teritori: Unordered indices (' + escape_html(index.toString()) + ', ' + escape_html(start.toString()) + ', ' + escape_html(end.toString()) + ', ' + escape_html(text.length.toString()) + ')');
                return normalize_html(text);
            }

            linked_text += normalize_html(text.substring(index, start));
            linked_text += entity_callback[entity[0]](entity, normalize_html(text.substring(start, end)));
            index = end;

        }
        if (end < text.length) {
            linked_text += normalize_html(text.substring(end, text.length));
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
            alert('teritori: fgcolor_str has unknown color format \'' + escape_html(fgcolor_str) + '\'');
            return undefined;
        }

        bgcolor_array = trtr.get_color_array(bgcolor_str);
        if (bgcolor_array === undefined) {
            alert('teritori: bgcolor_str has unknown color format \'' + escape_html(bgcolor_str) + '\'');
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

    trtr.media = [{
        'provider_name': 'Photobucket',
        'provider_url': 'http://photobucket.com/twitter',
        'provider_icon_url': 'http://twitter.com/phoenix/img/turkey-icon.png',
        'regexp_media_url': /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]{1,15}\/status\/[1-9][0-9]*\/photo\/[1-9][0-9]*$/,
        'get_middle_thumbnail_url': function (url, entity) { //
            if (!url || !entity || (entity[0] !== 'media')) {
                return '';
            }

            return entity[1].media_url + ':thumb';
        },
        'get_large_thumbnail_url': function (url, entity) { //
            if (!url || !entity || (entity[0] !== 'media')) {
                return '';
            }

            return entity[1].media_url;
        }
    }, {
        'provider_name': 'YFrog',
        'provider_url': 'http://yfrog.com/',
        'provider_icon_url': 'http://yfrog.com/favicon.ico',
        'regexp_media_url': /^http:\/\/yfrog\.(?:com|us)\/([0-9a-zA-Z]+[jpbtgsdfzx])$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://yfrog.com/' + percent_encode(url.match(this.regexp_media_url)[1]) + ':small';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://yfrog.com/' + percent_encode(url.match(this.regexp_media_url)[1]) + ':iphone';
        }
    }, {
        'provider_name': 'TwitPic',
        'provider_url': 'http://twitpic.com/',
        'provider_icon_url': 'http://twitpic.com/favicon.ico',
        'regexp_media_url': /^http:\/\/twitpic\.com\/([0-9a-zA-Z]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://twitpic.com/show/thumb/' + percent_encode(url.match(this.regexp_media_url)[1]);
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://twitpic.com/show/large/' + percent_encode(url.match(this.regexp_media_url)[1]);
        }
    }, {
        'provider_name': 'Lockerz',
        'provider_url': 'http://lockerz.com/',
        'provider_icon_url': 'http://lockerz.com/favicon.ico',
        'regexp_media_url': /^https?:\/\/(?:www\.)?lockerz\.com\/s\/([1-9][0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://api.plixi.com/api/tpapi.svc/imagefromurl?url=http://lockerz.com/s/' + percent_encode(url.match(this.regexp_media_url)[1]) + '&size=small';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://api.plixi.com/api/tpapi.svc/imagefromurl?url=http://lockerz.com/s/' + percent_encode(url.match(this.regexp_media_url)[1]) + '&size=medium';
        }
    }, {
        'provider_name': 'Instagram',
        'provider_url': 'http://instagr.am/',
        'provider_icon_url': 'http://instagr.am/favicon.ico',
        'regexp_media_url': /^https?:\/\/instagr(?:\.am|am\.com)\/p\/([0-9a-zA-Z_\-]+)\/$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://instagr.am/p/' + percent_encode(url.match(this.regexp_media_url)[1]) + '/media?size=t';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://instagr.am/p/' + percent_encode(url.match(this.regexp_media_url)[1]) + '/media';
        }
    }, {
        'provider_name': 'Mobypicture',
        'provider_url': 'http://www.mobypicture.com/',
        'provider_icon_url': null,
        'regexp_media_url': /^http:\/\/moby\.to\/([a-z0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://moby.to/' + percent_encode(url.match(this.regexp_media_url)[1]) + ':thumb';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://moby.to/' + percent_encode(url.match(this.regexp_media_url)[1]) + ':medium';
        }
    }, {
        'provider_name': 'フォト蔵',
        'provider_url': 'http://photozou.jp/',
        'provider_icon_url': 'http://photozou.jp/favicon.ico',
        'regexp_media_url': /^http:\/\/photozou\.jp\/photo\/show\/[0-9]+\/([0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://photozou.jp/p/thumb/' + percent_encode(url.match(this.regexp_media_url)[1]);
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://photozou.jp/p/img/' + percent_encode(url.match(this.regexp_media_url)[1]);
        }
    }, {
        'provider_name': '携帯百景',
        'provider_url': 'http://movapic.com/',
        'provider_icon_url': null,
        'regexp_media_url': /^http:\/\/movapic\.com\/pic\/([0-9a-zA-Z]+)$/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://image.movapic.com/pic/s_' + percent_encode(url.match(this.regexp_media_url)[1]) + '.jpeg';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://image.movapic.com/pic/m_' + percent_encode(url.match(this.regexp_media_url)[1]) + '.jpeg';
        }
    }, {
        'provider_name': 'Hatena Fotolife',
        'provider_url': 'http://f.hatena.ne.jp/',
        'provider_icon_url': 'http://f.hatena.ne.jp/favicon.ico',
        'regexp_media_url': /^http:\/\/f\.hatena\.ne\.jp\/(([a-zA-Z])[a-zA-Z0-9_\-]{1,30}[a-zA-Z0-9])\/(([1-9][0-9]{7})[0-9]+)$/,
        'get_middle_thumbnail_url': function (url) {
            var m;

            m = url.match(this.regexp_media_url);
            return 'http://img.f.hatena.ne.jp/images/fotolife/' + percent_encode(m[2]) + '/' + percent_encode(m[1]) + '/' + percent_encode(m[4]) + '/' + percent_encode(m[3]) + '_120.jpg';
        },
        'get_large_thumbnail_url': function (url) {
            var m;

            m = url.match(this.regexp_media_url);
            return 'http://img.f.hatena.ne.jp/images/fotolife/' + percent_encode(m[2]) + '/' + percent_encode(m[1]) + '/' + percent_encode(m[4]) + '/' + percent_encode(m[3]) + '_120.jpg';
        }
    }, {
        'provider_name': 'ニコニコ静画',
        'provider_url': 'http://seiga.nicovideo.jp/',
        'provider_icon_url': 'http://seiga.nicovideo.jp/favicon.ico',
        'regexp_media_url': /^http:\/\/(?:seiga\.nicovideo\.jp\/seiga|nico\.ms)\/im([1-9][0-9]+)/,
        'get_middle_thumbnail_url': function (url) {
            return 'http://lohas.nicoseiga.jp/thumb/' + percent_encode(url.match(this.regexp_media_url)[1]) + 'q?';
        },
        'get_large_thumbnail_url': function (url) {
            return 'http://lohas.nicoseiga.jp/thumb/' + percent_encode(url.match(this.regexp_media_url)[1]) + 'i?';
        },
        'get_html_middle': function (url) {
            var embed_url = 'http://ext.seiga.nicovideo.jp/thumb/im' + percent_encode(url.match(this.regexp_media_url)[1]);

            return '<div style="margin:.75em 0 .75em 0;font-size:12px"><iframe width="312" height="176" src="' + escape_html(embed_url) + '" scrolling="no" style="border:solid 1px #888;" frameborder="0"></iframe><br><img src="' + escape_html(this.provider_icon_url) + '" width="14" height="14" style="vertical-align:middle;margin-right:3px"><span style="color:#999">' + escape_html(this.provider_name) + '</span></div>';
        }
    }];

    trtr.media_methods = {
        'get_html_middle': function (url, entity) {
            var thumbnail_url;

            thumbnail_url = this.get_middle_thumbnail_url(url, entity);
            if ((typeof thumbnail_url !== 'string') || (thumbnail_url === '')) {
                return '';
            }
            return '<div style="margin:.75em 0 .75em 0;font-size:12px"><a href="' + escape_html(url) + '"><img src="' + escape_html(thumbnail_url) + '" style="max-height:244px;max-width:244px"></a><br>' + this.get_attribution_html_middle() + '</div>';
        },
        'get_html_large': function (url, entity) {
            var thumbnail_url;

            thumbnail_url = this.get_large_thumbnail_url(url, entity);
            if ((typeof thumbnail_url !== 'string') || (thumbnail_url === '')) {
                return '';
            }
            return '<div style="margin:12px 0 12px 0;font-size:12px;line-height:normal"><a href="' + escape_html(url) + '"><img src="' + escape_html(thumbnail_url) + '" style="max-height:700px;max-width:317px"></a><br>' + this.get_attribution_html_large() + '</div>';
        },
        'get_attribution_html_middle': function () {
            if (this.provider_icon_url === null) {
                return this.get_attribution_html_textonly();
            }
            return '<a href="' + escape_html(this.provider_url) + '"><img src="' + escape_html(this.provider_icon_url) + '" width="14" height="14" style="vertical-align:middle;margin-right:3px"></a><span style="color:#999">' + escape_html(this.provider_name) + '</span>';
        },
        'get_attribution_html_large': function () {
            if (this.provider_icon_url === null) {
                return this.get_attribution_html_textonly();
            }
            return '<a href="' + escape_html(this.provider_url) + '"><img src="' + escape_html(this.provider_icon_url) + '" width="16" height="16" style="vertical-align:middle;margin-right:3px"></a><span style="color:#999">' + escape_html(this.provider_name) + '</span>';
        },
        'get_attribution_html_textonly': function () {
            return '<a href="' + escape_html(this.provider_url) + '"><span style="color:#999">' + escape_html(this.provider_name) + '</span></a>';
        }
    };

    trtr.set_media_default_methods = function (media) {
        var key, default_methods;

        default_methods = {
            'get_html_middle': trtr.media_methods.get_html_middle,
            'get_html_large': trtr.media_methods.get_html_large,
            'get_html_kml': trtr.media_methods.get_html_middle,
            'get_attribution_html_middle': trtr.media_methods.get_attribution_html_middle,
            'get_attribution_html_large': trtr.media_methods.get_attribution_html_large,
            'get_attribution_html_textonly': trtr.media_methods.get_attribution_html_textonly
        };

        for (key in default_methods) {
            if (default_methods.hasOwnProperty(key)) {
                if (media[key] === undefined) {
                    media[key] = default_methods[key];
                }
            }
        }
    };

    trtr.add_media_html = function (t, entity, media_mode) {
        var e, j, url, match;

        if (trtr.option.debug) {
            console.info('teritori: entity = ', entity);
        }

        e = entity[1];
        if (e.expanded_url !== null) {
            url = e.expanded_url;
        } else if (e.url !== null) {
            url = e.url;
        } else {
            return;
        }

        for (j = 0; j < trtr.media.length; j += 1) {
            match = url.match(trtr.media[j].regexp_media_url);
            if (match) {
                trtr.set_media_default_methods(trtr.media[j]);
                t.media_html += trtr.media[j]['get_html_' + media_mode](url, entity);

                if (t.media_html.length > 0) {
                    t.needs_option.media = true;
                }

                break;
            }
        }
    };

    trtr.templates = {
        'profile-mode': {
            'description': 'profile_description',
            'set_tweet_html': function (t) {
                var to_linked_html, body_html, user_url_html, twitter_url, tweet_html;

                to_linked_html = function () {
                    var a = arguments,
                        url = '',
                        text = '',
                        pre_text_html = '';

                    if (a[1]) {
                        url = a[1];
                        text = a[1];
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + percent_encode(a[2]);
                        text = '#' + a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + percent_encode(a[3]);
                        pre_text_html = '@';
                        text = a[3];
                    }

                    return pre_text_html + '<a href="' + escape_html(url) + '" target="_new">' + normalize_html(text) + '</a>';
                };

                body_html = t.text.replace(/(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_linked_html);
                t.profile_image_url = t.profile_image_url.replace(/_normal\.([a-zA-Z]+)$/, '_reasonably_small.$1');

                if (t.user_url) {
                    user_url_html = '<div><a target="_blank" rel="me nofollow" href="' + escape_html(t.user_url) + '">' + escape_html(t.user_url) + '</a></div>';
                } else {
                    user_url_html = '<div><a target="_blank" rel="me nofollow"></a></div>';
                }

                twitter_url = 'http://twitter.com/' + percent_encode(t.screen_name);

                tweet_html = '<!-- ' + escape_html(twitter_url) + ' -->\n';
                tweet_html += '<style type="text/css">.trtr_userid_' + escape_html(t.user_id) + ' a {text-decoration:none;color:#' + escape_html(t.link_color) + ' !important;} .trtr_userid_' + escape_html(t.user_id) + ' a:hover {text-decoration:underline;}</style>\n';
                tweet_html += '<div class="trtr_userid_' + escape_html(t.user_id) + '" style="display:block;-webkit-font-smoothing:antialiased;color:#444;font:13px/1.5 Helvetica Neue,Arial,Helvetica,\'Liberation Sans\',FreeSans,sans-sefif"><div style="display:inline-block;padding:20px 20px 16px 20px;width:510px;background-color#fff"><div style="float:left"><a href="' + escape_html(twitter_url) + '" target="_blank"><img src="' + escape_html(t.profile_image_url) + '" alt="' + escape_html(t.user_name) + '"></a></div><div style="margin-left:15px;display:inline-block;width:367px"><div style="font-weight:bold"><h2 style="line-height:36px;font-size:30px;margin:0">' + escape_html(t.user_name) + '</h2></div><div style="font-size:13px;line-height:22px;padding:0"><span style="font-size:18px;font-weight:bold"><a href="' + escape_html(twitter_url) + '" target="_blank">@' + escape_html(t.screen_name) + '</a></span> ' + escape_html(t.user_location) + ' </div><div style="overflow:hidden;text-overflow:ellipsis;color:#777;font-family:Georgia,serif;font-size:14px;font-style:italic;">' + normalize_html(t.user_description) + '</div>' + user_url_html + '</div></div></div>\n';
                tweet_html += '<!-- end of profile -->\n';

                t.tweet_html = tweet_html;
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
            'set_tweet_html': function (t) {
                var link_style_html, to_linked_html, body_html, entity_callback, source_html, tweet_url, twitter_url, tweet_html;

                entity_callback = {
                    'hashtags': function (entity) {
                        var e, hashtag_url;

                        e = entity[1];
                        hashtag_url = 'http://search.twitter.com/search?q=%23' + percent_encode(e.text);
                        return '<span style="color:#' + escape_html(t.symbol_color) + '">#</span><a href="' + escape_html(hashtag_url) + '" style="color:#' + escape_html(t.link_color) + '">' + escape_html(e.text) + '</a>';
                    },
                    'urls': function (entity) {
                        var e, linktext;

                        trtr.add_media_html(t, entity, 'kml');

                        e = entity[1];
                        linktext = e.url;
                        if (e.hasOwnProperty('display_url')) {
                            t.needs_option.showtco = true;
                            if (!trtr.option.showtco) {
                                linktext = e.display_url;
                            }
                        }

                        return '<a href="' + escape_html(e.url) + '" style="color:#' + escape_html(t.link_color) + '">' + escape_html(linktext) + '</a>';
                    },
                    'user_mentions': function (entity, string) {
                        var e, twitter_url;


                        e = entity[1];
                        twitter_url = 'http://twitter.com/' + percent_encode(e.screen_name);
                        return '<span style="color:#' + escape_html(t.symbol_color) + '">@</span><a href="' + escape_html(twitter_url) + '" style="color:#' + escape_html(t.link_color) + '">' + escape_html(string.substring(1)) + '</a>';
                    },
                    'media': function (entity) {
                        var e, linktext;

                        trtr.add_media_html(t, entity, 'kml');

                        e = entity[1];
                        linktext = e.url;
                        if (e.hasOwnProperty('display_url')) {
                            t.needs_option.showtco = true;
                            if (!trtr.option.showtco) {
                                linktext = e.display_url;
                            }
                        }

                        return '<a href="' + escape_html(e.url) + '" style="color:#' + escape_html(t.link_color) + '">' + escape_html(linktext) + '</a>';
                    }
                };

                link_style_html = ' style="color:#' + escape_html(t.link_color) + '"';

                to_linked_html = function () {
                    var a = arguments,
                        url = '',
                        text = '',
                        pre_text_html = '';

                    if (a[1]) {
                        url = a[1];
                        text = a[1];
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + percent_encode(a[2]);
                        pre_text_html = '<span style="color:#' + escape_html(t.symbol_color) + '">#</span>';
                        text = a[2];
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + percent_encode(a[3]);
                        pre_text_html = '<span style="color:#' + escape_html(t.symbol_color) + '">@</span>';
                        text = a[3];
                    }

                    return pre_text_html + '<a href="' + escape_html(url) + '"' + link_style_html + '>' + escape_html(text) + '</a>';
                };

                if (trtr.option.link === 'entity') {
                    body_html = trtr.apply_entities(t, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    body_html = t.text.replace(/(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_linked_html);
                } else {
                    alert('teritori: Unknown link option \'' + escape_html(trtr.option.link) + '\'');
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity_html, link_auto_html;

                        if (trtr.option.link === 'entity') {
                            link_entity_html = body_html;
                            link_auto_html = t.text.replace(/(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_linked_html);
                        } else if (trtr.option.link === 'auto') {
                            link_entity_html = trtr.apply_entities(t, entity_callback);
                            link_auto_html = body_html;
                        }

                        if (link_entity_html !== link_auto_html) {
                            alert('teritori: link_entity_html !== link_auto_html');
                            console.info('teritori: link_entity_html = ', link_entity_html);
                            console.info('teritori: link_auto_html =   ', link_auto_html);
                        }
                    }());
                }

                if (t.source_html === 'web') {
                    t.source_html = '<a href="http://twitter.com/" rel="nofollow"' + link_style_html + '>Twitter</a>';
                } else {
                    t.source_html = t.source_html.replace(/^<a href="(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)" rel="nofollow">/, '<a href="$1" rel="nofollow"' + link_style_html + '>');
                }

                source_html = mes('format_source_html').replace('%s', t.source_html);
                tweet_url = 'http://twitter.com/' + percent_encode(t.screen_name) + '/status/' + percent_encode(t.tweet_id);
                twitter_url = 'http://twitter.com/' + percent_encode(t.screen_name);

                tweet_html = '<div style="margin:0 .5em .3em .5em;min-height:60px;color:#' + escape_html(t.text_color) + ';font-size:16px"><div>' + body_html;

                if (trtr.option.media) {
                    tweet_html += t.media_html;
                }

                tweet_html += ' </div><div style="margin-bottom:.5em"><span style="font-size:12px;display:block;color:#999"><a href="' + escape_html(tweet_url) + '"' + link_style_html + '>' + escape_html(t.timestamp) + '</a> ' + source_html + ' </span></div><div style="padding:.5em 0 .5em 0;width:100%;border-top:1px solid #E6E6E6"><a href="' + escape_html(twitter_url) + '"' + link_style_html + '><img src="' + escape_html(t.profile_image_url) + '" alt="' + escape_html(t.user_name) + '" width="38" height="38" style="float:left;margin-right:7px;width:38px;padding:0;border:none"></a><strong><a href="' + escape_html(twitter_url) + '"' + link_style_html + '>@' + escape_html(t.screen_name) + '</a></strong><span style="color:#999;font-size:14px"><br>' + escape_html(t.user_name) + ' </span></div></div>';

                t.tweet_html = tweet_html;
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
            'set_tweet_html': function (t) {
                var to_linked_html, body_html, entity_callback, background_html, source_html, tweet_url, twitter_url, intent_follow_url, intent_reply_url, intent_retweet_url, intent_favorite_url, tweet_html;

                entity_callback = {
                    'hashtags': function (entity) {
                        var e, hashtag_url;

                        e = entity[1];
                        hashtag_url = 'http://search.twitter.com/search?q=%23' + percent_encode(e.text);
                        return '<a class="trtr_link" href="' + escape_html(hashtag_url) + '" target="_new"><span class="trtr_link_symbol">#</span><span class="trtr_link_text">' + escape_html(e.text) + '</span></a>';
                    },
                    'urls': function (entity) {
                        var e, linktext;

                        trtr.add_media_html(t, entity, 'large');

                        e = entity[1];
                        linktext = e.url;
                        if (e.hasOwnProperty('display_url')) {
                            t.needs_option.showtco = true;
                            if (!trtr.option.showtco) {
                                linktext = e.display_url;
                            }
                        }

                        return '<a href="' + escape_html(e.url) + '" target="_new"><span class="trtr_link_text">' + escape_html(linktext) + '</span></a>';
                    },
                    'user_mentions': function (entity, string) {
                        var e, twitter_url;

                        e = entity[1];
                        twitter_url = 'http://twitter.com/' + percent_encode(e.screen_name);
                        return '<a class="trtr_link" href="' + escape_html(twitter_url) + '" target="_new"><span class="trtr_link_symbol">@</span><span class="trtr_link_text">' + escape_html(string.substring(1)) + '</span></a>';
                    },
                    'media': function (entity) {
                        var e, linktext;

                        trtr.add_media_html(t, entity, 'large');

                        e = entity[1];
                        linktext = e.url;
                        if (e.hasOwnProperty('display_url')) {
                            t.needs_option.showtco = true;
                            if (!trtr.option.showtco) {
                                linktext = e.display_url;
                            }
                        }

                        return '<a href="' + escape_html(e.url) + '" target="_new"><span class="trtr_link_text">' + escape_html(linktext) + '</span></a>';
                    }
                };

                to_linked_html = function () {
                    var a = arguments,
                        url;

                    if (a[1]) {
                        return '<a href="' + normalize_html(a[1]) + '" target="_new"><span class="trtr_link_text">' + escape_html(a[1]) + '</span></a>';
                    } else if (a[2]) {
                        url = 'http://search.twitter.com/search?q=%23' + percent_encode(a[2]);
                        return '<a class="trtr_link" href="' + escape_html(url) + '" target="_new"><span class="trtr_link_symbol">#</span><span class="trtr_link_text">' + escape_html(a[2]) + '</span></a>';
                    } else if (a[3]) {
                        url = 'http://twitter.com/' + percent_encode(a[3]);
                        return '<a class="trtr_link" href="' + escape_html(url) + '" target="_new"><span class="trtr_link_symbol">@</span><span class="trtr_link_text">' + escape_html(a[3]) + '</span></a>';
                    } else {
                        alert('teritori: Unknown link error');
                    }
                };

                if (trtr.option.link === 'entity') {
                    body_html = trtr.apply_entities(t, entity_callback);
                } else if (trtr.option.link === 'auto') {
                    body_html = t.text.replace(/(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_linked_html);
                } else {
                    alert('teritori: Unknown link option \'' + escape_html(trtr.option.link) + '\'');
                    return;
                }

                if (trtr.option.debug) {
                    (function () {
                        var link_entity_html, link_auto_html;

                        if (trtr.option.link === 'entity') {
                            link_entity_html = body_html;
                            link_auto_html = t.text.replace(/(https?:\/\/[#$%&+,\-.\/0-9:;=?@A-Z_a-z~]+)|#([a-zA-Z0-9_]+)|@([a-zA-Z0-9_]{1,15})/g, to_linked_html);
                        } else if (trtr.option.link === 'auto') {
                            link_entity_html = trtr.apply_entities(t, entity_callback);
                            link_auto_html = body_html;
                        }

                        if (link_entity_html !== link_auto_html) {
                            alert('teritori: link_entity_html !== link_auto_html');
                            console.info('teritori: link_entity_html = ', link_entity_html);
                            console.info('teritori: link_auto_html =   ', link_auto_html);
                        }
                    }());
                }

                background_html = '#' + escape_html(t.background_color);
                if (t.background_image) {
                    background_html += ' url(' + escape_html(t.background_image_url) + ')';
                    if (!t.background_tile) {
                        background_html += ' no-repeat';
                    }
                }

                source_html = mes('format_source_html').replace('%s', t.source_html);
                tweet_url = 'http://twitter.com/' + percent_encode(t.screen_name) + '/status/' + percent_encode(t.tweet_id);
                twitter_url = 'http://twitter.com/' + percent_encode(t.screen_name);
                intent_follow_url = 'https://twitter.com/intent/user?user_id=' + percent_encode(t.user_id);
                intent_reply_url = 'https://twitter.com/intent/tweet?in_reply_to=' + percent_encode(t.tweet_id);
                intent_retweet_url = 'https://twitter.com/intent/retweet?tweet_id=' + percent_encode(t.tweet_id);
                intent_favorite_url = 'https://twitter.com/intent/favorite?tweet_id=' + percent_encode(t.tweet_id);

                tweet_html = '<!-- ' + escape_html(tweet_url) + ' -->\n';
                tweet_html += '<style type="text/css">.trtr_tweetid_' + escape_html(t.tweet_id) + ' a {text-decoration:none;color:#' + escape_html(t.link_color) + ' !important} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_link span.trtr_link_symbol {opacity:0.5} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a:hover {text-decoration:underline} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_link:hover {text-decoration:none} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_link:hover span.trtr_link_text {text-decoration:underline} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action span em {background:transparent url(http://si0.twimg.com/images/dev/cms/intents/icons/sprites/everything-spritev2.png) no-repeat;margin:0 3px -3.5px 3px;display:inline-block;vertical-align:baseline;position:relative;outline:none;width:15px;height:15px;} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_reply span em {background-position 0 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_reply:hover span em {background-position:-16px 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_retweet span em {background-position:-80px 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_retweet:hover span em {background-position:-96px 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_favorite span em {background-position:-32px 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_favorite:hover span em {background-position:-48px 0} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_follow span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_blue/bird_16_blue.png)} .trtr_tweetid_' + escape_html(t.tweet_id) + ' a.trtr_action_follow:hover span em {background-image:url(http://si0.twimg.com/images/dev/cms/intents/bird/bird_black/bird_16_black.png)}</style>';
                tweet_html += '<div class="trtr_tweetid_' + escape_html(t.tweet_id) + '" style="background:' + background_html + ';padding:20px"><div style="background:#fff;padding:10px 12px 10px 12px;margin:0;min-height:48px;color:#' + escape_html(t.text_color) + ';font-size:16px !important;line-height:22px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;word-wrap:break-word">' + body_html;

                if (trtr.option.media) {
                    tweet_html += t.media_html;
                }

                tweet_html += ' <div class="trtr_actions" style="color:#999;font-size:12px;display:block"><a href="' + escape_html(intent_follow_url) + '" class="trtr_action trtr_action_follow" title="' + escape_html(mes('action_follow')) + '"><span><em></em></span></a> <span class="trtr_timestamp"><a title="' + escape_html(t.timestamp) + '" href="' + escape_html(tweet_url) + '">' + escape_html(t.timestamp) + '</a> ' + source_html + ' </span><a href="' + escape_html(intent_reply_url) + '" class="trtr_action trtr_action_reply" title="' + escape_html(mes('action_reply')) + '"><span><em></em>' + escape_html(mes('action_reply')) + '</span></a> <a href="' + escape_html(intent_retweet_url) + '" class="trtr_action trtr_action_retweet" title="' + escape_html(mes('action_retweet')) + '"><span><em></em>' + escape_html(mes('action_retweet')) + '</span></a> <a href="' + escape_html(intent_favorite_url) + '" class="trtr_action trtr_action_favorite" title="' + escape_html(mes('action_favorite')) + '"><span><em></em>' + escape_html(mes('action_favorite')) + '</span></a> </div><span class="trtr_metadata" style="display:block;width:100%;clear:both;margin-top:8px;padding-top:12px;height:40px;border-top:1px solid #fff;border-top:1px solid #e6e6e6;"><span class="trtr_author" style="color:#999;line-height:19px;"><a href="' + escape_html(twitter_url) + '"><img src="' + escape_html(t.profile_image_url) + '" style="float:left;margin:0 7px 0 0;width:38px;height:38px;" /></a><strong><a href="' + escape_html(twitter_url) + '">' + escape_html(t.user_name) + '</a></strong><br/>@' + escape_html(t.screen_name) + '</span></span></div></div>\n';
                tweet_html += '<!-- end of tweet -->\n';

                t.tweet_html = tweet_html;
            },
            'uses_option': {
                'media': true,
                'preview': true,
                'showtco': true
            },
            'preview_box': '<div class="trtr-dialog-previewbox" style="max-height:400px;overflow:auto"></div>'
        }
    };

    trtr.display_html = function (tweet) {
        var t;

        trtr.cached_json['statuses/show/' + tweet.id_str] = tweet;

        if (tweet.retweeted_status) {
            tweet = tweet.retweeted_status;
        }

        if (trtr.option.debug) {
            console.info('teritori: tweet = ', tweet);
        }

        t = {};
        t.tweet_id = tweet.id_str;
        t.source_html = tweet.source;

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
        t.needs_option = {
            'media': false,
            'preview': true,
            'showtco': false
        };

        t.media_html = '';

        if (trtr.templates.hasOwnProperty(trtr.option.mode)) {
            trtr.templates[trtr.option.mode].set_tweet_html(t);
        } else {
            alert('teritori: Unknown mode \'' + escape_html(trtr.option.mode.toString()) + '\'');
            return;
        }

        if (t.tweet_html === undefined) {
            t.tweet_html = '';
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
            trtr.display_html(trtr.cached_json[cache_key]);
            if (trtr.option.debug) {
                console.info('teritori: cache_key = ', cache_key);
            }
        } else {
            jsonp = document.createElement('script');
            jsonp.type = 'text/javascript';
            jsonp.src = 'https://api.twitter.com/1/statuses/show.json?include_entities=true&contributor_details=true&callback=teritori.display_html&id=' + percent_encode(id);
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
        matches = url.match(/^https?:\/\/twitter\.com(?:\/#(?:\!|%21))?(?:\/(?:[a-zA-Z0-9_]{1,15})(?:\/status(?:es)?\/([1-9][0-9]+))?)?/);
        if (!matches) {
            alert('teritori can use only twitter.com.');
            return;
        }

        if (matches[1]) {
            trtr.load_jsonp(matches[1]);
        } else if (trtr.new_twitter) {
            $('.stream-tweet').live('hover', function () {
                var actions, tweet_link, tweet_id, action_gethtml_html;

                actions = $(this).find('.tweet-actions');
                if (actions && actions.find('.trtr_gethtml').length === 0) {
                    tweet_link = actions.siblings('.tweet-timestamp').attr('href');
                    tweet_id = (tweet_link.match(/^\/(?:#\!\/)?(?:[a-zA-Z0-9_]{1,15})\/status(?:es)?\/([1-9][0-9]+)/))[1];
                    action_gethtml_html = $('<a href="#" class="trtr_gethtml" style="padding-left:18px"><span>GetHTML</span></a>');
                    actions.append(action_gethtml_html);
                    action_gethtml_html.click(function () {
                        trtr.load_jsonp(tweet_id);
                    });
                }
            });
        } else {
            $('.hentry').live('mouseover', function () {
                var actions, tweet_link, tweet_id, action_gethtml_html;

                actions = $(this).children('.status-body').children('.actions-hover');
                if (actions && actions.find('.trtr_gethtml').length === 0) {
                    tweet_link = actions.siblings('.entry-meta').children('.entry-date').attr('href');
                    tweet_id = (tweet_link.match(/^https?:\/\/twitter\.com\/(?:#\!\/)?(?:[a-zA-Z0-9_]{1,15})\/status(?:es)?\/([1-9][0-9]+)/))[1];
                    action_gethtml_html = $('<li style="line-height:16px"><span><a href="#" class="trtr_gethtml" style="padding-left:18px"><span>GetHTML</span></a></span></li>');
                    actions.prepend(action_gethtml_html);
                    action_gethtml_html.click(function () {
                        trtr.load_jsonp(tweet_id);
                        return false;
                    });
                }
            });
        }
    };

    trtr.main();
}());
